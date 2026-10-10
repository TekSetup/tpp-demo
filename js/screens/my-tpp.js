// My TPP: points balance, level, ways to earn (with caps), rewards and ledger history.

import { s } from '../strings.js';
import { navigate, refresh } from '../router.js';
import { get, isAuthed, balance, levelInfo, earnedIn, spend, levelRank } from '../state.js';
import { POINTS, LEVELS } from '../../data/config.js';
import { rewards } from '../../data/rewards.js';
import { $, $$, esc, icon, header, tierBadge, progressBar, pizzaArt, openSheet, toast, tick, fmtDate, emptyState, pointsPill, ledgerLabel } from '../ui.js';

let lastBalance = 0;
const ORDER = ['review', 'eating', 'podcast', 'recipe', 'training', 'job', 'referral'];

export function render(el, { query }) {
  if (!isAuthed()) { guest(el); return; }
  const tab = ['earn', 'rewards', 'history'].includes(query.tab) ? query.tab : 'earn';
  const bal = balance();
  const lv = levelInfo();
  const pending = get().ledger.filter((e) => e.status === 'pending').reduce((n, e) => n + e.points, 0);
  const t = s.my;

  const earnPanel = () => `
    <h2 class="h2">${esc(t.earnTitle)}</h2><p class="muted small">${esc(t.earnSub)}</p>
    <ul class="earn-list">${ORDER.map((k) => {
      const c = s.points.cats[k], cap = POINTS[k].cap, got = Math.min(cap, earnedIn(k)), full = got >= cap;
      return `<li><a class="earn-row" href="#${c.route}">
        <span class="earn-row__icon">${icon(c.icon)}</span>
        <span class="earn-row__main"><b>${esc(c.name)}</b>${progressBar(got / cap, { color: full ? 'accent' : 'secondary', label: c.name })}
          <span class="muted small">${esc(full ? t.max : t.progress(got, cap))}</span></span>
        <span class="earn-row__go">${full ? icon('check-circle') : `<span class="small">${esc(c.how)}</span>${icon('chevron-right', { size: 18 })}`}</span></a></li>`;
    }).join('')}</ul>
    <p class="muted small">${icon('info', { size: 16 })} ${esc(t.note)}</p>`;

  const rewardsPanel = () => {
    const mine = get().redeemed;
    return `<h2 class="h2">${esc(t.rewardsTitle)}</h2>
      <ul class="rewards">${rewards.map((r) => {
        const lackPts = bal < r.cost, lackLv = levelRank(lv.current.id) < levelRank(r.minLevel);
        const why = lackLv ? t.needLevel(s.levels[r.minLevel].name) : lackPts ? t.needMore(r.cost - bal) : '';
        return `<li class="card reward"><div class="reward__art">${pizzaArt(r.seed, '')}</div>
          <div class="reward__body"><h3 class="h3">${esc(r.title)}</h3><p class="muted small">${esc(r.partner)} · ${esc(r.desc)}</p>
            <div class="row row--between"><span class="pts-pill">${icon('slice', { size: 14 })}${esc(s.common.pts(r.cost))}</span>
              <button class="btn btn--positive btn--sm" type="button" data-redeem="${r.id}" ${why ? 'disabled' : ''}>${esc(t.redeem)}</button></div>
            ${why ? `<p class="small reward__lock">${icon(lackLv ? 'lock' : 'info', { size: 14 })} ${esc(why)}</p>` : ''}</div></li>`;
      }).join('')}</ul>
      ${mine.length ? `<h2 class="h2">${esc(t.redeemedTitle)}</h2><ul class="list-plain">${mine.map((m) => { const r = rewards.find((x) => x.id === m.rewardId); return `<li class="ledger-row"><span class="ledger-row__icon">${icon('gift')}</span><div class="ledger-row__main"><b>${esc(r.title)}</b><span class="muted small">${esc(r.partner)} · ${esc(fmtDate(new Date(m.ts).toISOString()))}</span></div><code class="code">${esc(m.code)}</code></li>`; }).join('')}</ul>` : ''}`;
  };

  const historyPanel = () => {
    const rows = get().ledger;
    if (!rows.length) return emptyState({ ...t.emptyHistory, action: 'data-go-home' });
    return `<h2 class="h2">${esc(t.historyTitle)}</h2><ul class="list-plain">${rows.map((e) => {
      const spent = e.points < 0, pend = e.status === 'pending';
      const ic = (s.points.cats[e.cat] && s.points.cats[e.cat].icon) || (e.cat === 'reward' ? 'gift' : 'sparkle');
      return `<li class="ledger-row"><span class="ledger-row__icon">${icon(ic)}</span>
        <div class="ledger-row__main"><b>${esc(ledgerLabel(e))}</b><span class="muted small">${esc(fmtDate(new Date(e.ts).toISOString()))} · <span class="status ${pend ? 'status--pending' : spent ? 'status--off' : 'status--ok'}">${esc(pend ? t.status.pending : spent ? t.status.spent : t.status.approved)}</span></span></div>
        <b class="ledger-row__pts ${spent ? 'is-neg' : ''}">${spent ? '' : '+'}${e.points.toLocaleString(s.locale)}</b></li>`;
    }).join('')}</ul>`;
  };

  el.innerHTML = `
    ${header({ title: t.title })}
    <div class="page page--tight">
      <section class="points-hero" aria-label="${esc(t.title)}">
        <div class="row row--between">
          <div class="row">${tierBadge(lv.current.id, 44)}<div><p class="caption muted">${esc(s.levels.current)}</p><p class="h3">${esc(s.levels[lv.current.id].name)}</p></div></div>
          <button class="btn btn--text btn--sm" type="button" id="levels">${esc(t.seeLevels)}</button>
        </div>
        <p class="points-hero__num"><span id="bal" aria-hidden="true">${bal.toLocaleString(s.locale)}</span><span class="sr-only">${esc(s.common.pts(bal))}</span></p>
        <p class="points-hero__label">${esc(t.balance)}${pending ? ` · <span class="status status--pending">+${pending} ${esc(t.status.pending.toLowerCase())}</span>` : ''}</p>
        ${progressBar(lv.pct, { color: 'accent', label: lv.next ? t.toNext(lv.remaining, s.levels[lv.next.id].name) : t.maxLevel })}
        <p class="small">${esc(lv.next ? t.toNext(lv.remaining, s.levels[lv.next.id].name) : t.maxLevel)}</p>
      </section>
      <div class="tabs" role="tablist" aria-label="${esc(t.tabsLabel)}">
        ${['earn', 'rewards', 'history'].map((k) => `<button class="tab" role="tab" id="tab-${k}" aria-selected="${k === tab}" aria-controls="panel" tabindex="${k === tab ? 0 : -1}" data-tab="${k}">${esc(t.tabs[k])}</button>`).join('')}
      </div>
      <div id="panel" role="tabpanel" aria-labelledby="tab-${tab}" tabindex="0">${tab === 'earn' ? earnPanel() : tab === 'rewards' ? rewardsPanel() : historyPanel()}</div>
    </div>`;

  tick($('#bal', el), bal, lastBalance);
  lastBalance = bal;

  const tabs = $$('[data-tab]', el);
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => navigate(`/my-tpp?tab=${b.dataset.tab}`));
    b.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); tabs[(i + d + tabs.length) % tabs.length].click(); }
    });
  });
  const go = $('[data-go-home]', el);
  if (go) go.addEventListener('click', () => navigate('/home'));

  $('#levels', el).addEventListener('click', () => openSheet({
    title: s.levels.perksTitle,
    html: `<ul class="tiers">${LEVELS.map((l) => `<li class="tier-card ${l.id === lv.current.id ? 'is-current' : ''}">${tierBadge(l.id, 48)}<div><h3 class="h3">${esc(s.levels[l.id].name)} ${l.id === lv.current.id ? `<span class="status status--ok">${esc(s.levels.current)}</span>` : ''}</h3><p class="muted small">${esc(s.common.pts(l.min))}</p>
      <ul class="perk-list">${s.levels[l.id].perks.map((p) => `<li>${icon('check', { size: 16 })}${esc(p)}</li>`).join('')}</ul></div></li>`).join('')}</ul>
      <p class="muted small">${esc(s.levels.note)}</p>`,
  }));

  $$('[data-redeem]', el).forEach((b) => b.addEventListener('click', () => {
    const r = rewards.find((x) => x.id === b.dataset.redeem);
    openSheet({
      title: t.confirmTitle,
      html: `<p>${esc(t.confirmText(r.title, r.partner))}</p><p class="muted">${esc(s.common.pts(r.cost))} · ${esc(t.after(balance() - r.cost))}</p>
        <div class="stack"><button class="btn btn--positive btn--block" type="button" id="ok">${esc(t.confirm)}</button><button class="btn btn--ghost btn--block" type="button" data-close>${esc(s.common.cancel)}</button></div>`,
      onMount: (sh, close) => $('#ok', sh).addEventListener('click', () => {
        const code = spend(r);
        close();
        if (!code) { toast(s.common.errorGeneric, { type: 'error' }); return; }
        refresh();
        openSheet({
          title: t.done, variant: 'center',
          html: `<div class="center stack"><div class="done-badge">${icon('check-circle', { size: 48 })}</div><p>${esc(r.title)} · ${esc(r.partner)}</p><p class="caption muted">${esc(t.code)}</p><code class="code code--big">${esc(code)}</code><p class="muted small">${esc(t.codeHint)}</p><button class="btn btn--primary btn--block" type="button" data-close>${esc(s.common.close)}</button></div>`,
        });
      }),
    });
  }));
}

function guest(el) {
  const g = s.my.guest;
  el.innerHTML = `${header({ title: s.my.title })}<div class="page">${emptyState({ title: g.title, text: g.text, cta: g.cta, action: 'data-nav="/signup"' })}</div>`;
}
