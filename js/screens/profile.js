// Profile and settings: name, city, theme, notifications, favorites, activity, demo tools, log out.

import { s } from '../strings.js';
import { navigate } from '../router.js';
import { get, patch, setTheme, setCity, signOut, reset, demoBonus, reviewsFor } from '../state.js';
import { LANGS, setLang } from '../lang.js';
import { places } from '../../data/places.js';
import { jobs } from '../../data/jobs.js';
import { CITIES, DEMO_BONUS } from '../../data/config.js';
import { $, $$, esc, icon, header, toast, openSheet, openLevelUp, applyTheme, emptyState, stars, fmtDate, placePhoto } from '../ui.js';

const sw = (id, label, on) => `<div class="switch-row"><b id="${id}-l">${esc(label)}</b><button class="switch" type="button" role="switch" id="${id}" aria-checked="${on}" aria-labelledby="${id}-l"><span></span></button></div>`;

export function render(el) {
  const st = get();
  const t = s.profile;
  const authed = !!st.user;
  const name = (st.user && st.user.name) || '';
  const initial = (name || t.nameDefault).trim()[0].toUpperCase();

  const favs = st.favorites.map((id) => places.find((p) => p.id === id)).filter(Boolean);
  const reviews = st.reviews.map((r) => ({ ...r, place: places.find((p) => p.id === r.placeId) })).filter((r) => r.place);

  el.innerHTML = `
    ${header({ title: t.title })}
    <div class="page">
      ${authed ? `
      <section class="card profile-card">
        <div class="avatar" aria-hidden="true">${esc(initial)}</div>
        <form id="pf" class="stack" novalidate>
          <div class="field"><label class="label" for="pname">${esc(t.name)}</label><input class="input" id="pname" value="${esc(name)}" placeholder="${esc(t.nameDefault)}" autocomplete="name"></div>
          <div class="field"><label class="label" for="pcity">${esc(t.city)}</label><select class="input" id="pcity">${CITIES.map((c) => `<option value="${c}" ${st.city === c ? 'selected' : ''}>${esc(s.cities[c])}</option>`).join('')}</select></div>
          <p class="muted small">${icon(st.user.type === 'email' ? 'mail' : 'phone', { size: 16 })} ${esc(t.contact)}: ${esc(st.user.contact)}</p>
          <button class="btn btn--primary btn--block" type="submit">${esc(s.common.save)}</button>
        </form>
      </section>` : emptyState({ title: t.guest.title, text: t.guest.text, cta: t.guest.cta, action: 'data-nav="/signup"' })}

      <section class="stack"><h2 class="h2">${esc(t.appearance)}</h2>
        <div class="segmented" role="group" aria-label="${esc(t.themeLabel)}">
          ${['auto', 'light', 'dark'].map((k) => `<button type="button" data-theme="${k}" aria-pressed="${st.theme === k}">${k === 'light' ? icon('sun', { size: 18 }) : k === 'dark' ? icon('moon', { size: 18 }) : ''}${esc(t.theme[k])}</button>`).join('')}
        </div>
        <button class="btn btn--secondary btn--block" type="button" id="tour">${icon('compass', { size: 20 })}${esc(t.replayTour)}</button>
        <div class="field"><label class="label" for="lang">${esc(t.language)}</label><select class="input" id="lang">${LANGS.map((l) => `<option value="${l.code}" lang="${l.code}" ${l.code === s.lang ? 'selected' : ''}>${esc(l.name)}</option>`).join('')}</select></div>
      </section>

      <section class="stack"><h2 class="h2">${esc(t.notifs)}</h2>
        ${sw('n-ev', t.notifEvents, st.notifs.events)}${sw('n-rw', t.notifRewards, st.notifs.rewards)}</section>

      ${authed ? `
      <section class="stack"><h2 class="h2">${esc(t.favorites)}</h2>
        ${favs.length ? `<ul class="list-plain">${favs.map((p) => `<li><a class="mini-row" href="#/place/${p.id}"><span class="mini-row__art">${placePhoto(p.id)}</span><span><b>${esc(p.name)}</b><span class="muted small block">${esc(p.area)} · ${esc(s.cities[p.city])}</span></span>${icon('chevron-right', { size: 18 })}</a></li>`).join('')}</ul>` : `<p class="muted">${esc(t.favEmpty)}</p>`}</section>

      <section class="stack"><h2 class="h2">${esc(t.activity)}</h2>
        <h3 class="h3">${esc(t.actReviews)}</h3>${reviews.length ? `<ul class="list-plain">${reviews.map((r) => `<li class="card post"><b>${esc(r.place.name)}</b>${stars(r.rating)}<span class="sr-only">${esc(s.common.ratingOf(r.rating))}</span><p class="small">${esc(r.text)}</p><span class="muted small">${esc(fmtDate(r.date))}</span></li>`).join('')}</ul>` : `<p class="muted small">${esc(t.actNone)}</p>`}
        <h3 class="h3">${esc(t.actApplied)}</h3>${st.applied.length ? `<ul class="list-plain">${st.applied.map((a) => { const j = jobs.find((x) => x.id === a.jobId); return `<li class="card post"><a href="#/job/${j.id}"><b>${esc(j.title)}</b></a><span class="muted small block">${esc(j.company)}</span></li>`; }).join('')}</ul>` : `<p class="muted small">${esc(t.actNone)}</p>`}
        <h3 class="h3">${esc(t.actReco)}</h3>${st.referrals.length ? `<ul class="list-plain">${st.referrals.map((r) => `<li class="card post"><b>${esc(r.name)}</b><span class="muted small block">${esc(r.city)} · <span class="status ${r.status === 'pending' ? 'status--pending' : 'status--ok'}">${esc(r.status === 'pending' ? s.reco.status : s.my.status.approved)}</span></span></li>`).join('')}</ul>` : `<p class="muted small">${esc(t.actNone)}</p>`}</section>

      <section class="stack"><h2 class="h2">${esc(t.demoTools)}</h2>
        <button class="btn btn--secondary btn--block" type="button" id="bonus">${icon('slice', { size: 20 })}${esc(t.demoBonus(DEMO_BONUS))}</button>
        <button class="btn btn--secondary btn--block" type="button" id="reset">${icon('refresh', { size: 20 })}${esc(t.reset)}</button></section>

      <section class="danger-zone"><button class="btn btn--danger btn--block" type="button" id="logout">${icon('log-out', { size: 20 })}${esc(t.logout)}</button></section>` : `
      <section class="stack"><h2 class="h2">${esc(t.demoTools)}</h2><button class="btn btn--secondary btn--block" type="button" id="reset">${icon('refresh', { size: 20 })}${esc(t.reset)}</button></section>`}
      <p class="caption muted center">${esc(t.version)}</p>
    </div>`;

  const form = $('#pf', el);
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    patch((x) => { x.user.name = $('#pname', el).value.trim(); });
    setCity($('#pcity', el).value);
    toast(t.saved);
    render(el);
  });

  $$('[data-theme]', el).forEach((b) => b.addEventListener('click', () => {
    setTheme(b.dataset.theme); applyTheme(b.dataset.theme);
    $$('[data-theme]', el).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  }));
  [['n-ev', 'events'], ['n-rw', 'rewards']].forEach(([id, key]) => $('#' + id, el).addEventListener('click', (e) => {
    const on = !get().notifs[key];
    patch((x) => { x.notifs[key] = on; });
    e.currentTarget.setAttribute('aria-checked', String(on));
  }));

  $('#lang', el).addEventListener('change', (e) => setLang(e.target.value));
  $('#tour', el).addEventListener('click', () => { patch((x) => { x.tourSeen = false; }); navigate('/home'); });

  const bonus = $('#bonus', el);
  if (bonus) bonus.addEventListener('click', () => {
    const lu = demoBonus(DEMO_BONUS);
    toast(t.demoBonusDone(DEMO_BONUS));
    if (lu) setTimeout(() => openLevelUp(lu.to), 650);
  });

  $('#reset', el).addEventListener('click', () => openSheet({
    title: t.resetConfirmTitle,
    html: `<p class="muted">${esc(t.resetConfirmText)}</p><div class="stack"><button class="btn btn--danger btn--block" type="button" id="yes">${esc(t.reset)}</button><button class="btn btn--ghost btn--block" type="button" data-close>${esc(s.common.cancel)}</button></div>`,
    onMount: (sh, close) => $('#yes', sh).addEventListener('click', () => { close(); reset(); applyTheme('auto'); navigate('/welcome', { replace: true }); toast(t.resetOk, { type: 'info' }); }),
  }));

  const out = $('#logout', el);
  if (out) out.addEventListener('click', () => { signOut(); navigate('/welcome', { replace: true }); toast(t.logoutToast, { type: 'info' }); });
}
