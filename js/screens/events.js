// Events and community: event list/detail with "I'm going" and a read-only community feed.

import { s } from '../strings.js';
import { navigate } from '../router.js';
import { isGoing, toggleGoing } from '../state.js';
import { events, feed } from '../../data/events.js';
import { places } from '../../data/places.js';
import { CITIES } from '../../data/config.js';
import { $, $$, esc, icon, header, stars, pizzaArt, toast, requireAuth, fmtDate, fmtDateLong } from '../ui.js';

let cityFilter = 'all';

export function render(el, { query }) {
  const t = s.events;
  const tab = query.tab === 'community' ? 'community' : 'events';

  const eventList = () => {
    const list = events.filter((e) => cityFilter === 'all' || e.city === cityFilter).sort((a, b) => a.date.localeCompare(b.date));
    return `<div class="field"><label class="label" for="ecity">${esc(s.jobs.city)}</label>
      <select class="input" id="ecity"><option value="all">${esc(t.all)}</option>${CITIES.map((c) => `<option value="${c}" ${cityFilter === c ? 'selected' : ''}>${esc(s.cities[c])}</option>`).join('')}</select></div>
      <ul class="list-plain">${list.map((e) => `<li><article class="card event"><div class="event__art">${pizzaArt(e.seed, '')}
        <span class="event__date"><b>${new Date(e.date).getDate()}</b>${esc(fmtDate(e.date, { month: 'short' }))}</span></div>
        <div class="event__body"><h3 class="h3"><a class="stretched" href="#/event/${e.id}">${esc(e.title)}</a></h3>
        <p class="muted small">${icon('map-pin', { size: 14 })} ${esc(e.venue)}, ${esc(s.cities[e.city])}</p>
        <p class="small">${isGoing(e.id) ? `<span class="status status--ok">${icon('check', { size: 14 })}${esc(t.youGo)}</span>` : esc(t.goingN(e.going))}</p></div></article></li>`).join('')}</ul>`;
  };

  const community = () => `<h2 class="h2">${esc(t.feedTitle)}</h2><ul class="list-plain">${feed.map((f) => {
    if (f.kind === 'review') {
      const p = places.find((x) => x.id === f.placeId);
      return `<li class="card post"><p class="small muted">${icon('message', { size: 14 })} ${esc(t.feedReview(f.user, p.name))} · ${esc(fmtDate(f.date))}</p>${stars(f.rating)}<span class="sr-only">${esc(s.common.ratingOf(f.rating))}</span><p>${esc(f.text)}</p><a class="small" href="#/place/${p.id}">${esc(p.name)}</a></li>`;
    }
    return `<li class="card post"><p class="small muted">${icon('sparkle', { size: 14 })} ${esc(t.feedReco(f.user, f.name, f.city))} · ${esc(fmtDate(f.date))}</p><p>${esc(f.text)}</p></li>`;
  }).join('')}</ul>`;

  el.innerHTML = `
    ${header({ title: t.title, back: '/home' })}
    <div class="page page--tight">
      <div class="tabs" role="tablist" aria-label="${esc(t.tabsLabel)}">
        ${['events', 'community'].map((k) => `<button class="tab" role="tab" id="tab-${k}" aria-selected="${k === tab}" aria-controls="panel" tabindex="${k === tab ? 0 : -1}" data-tab="${k}">${esc(t.tabs[k])}</button>`).join('')}
      </div>
      <div id="panel" role="tabpanel" aria-labelledby="tab-${tab}" tabindex="0">${tab === 'events' ? eventList() : community()}</div>
    </div>`;
  const tabs = $$('[data-tab]', el);
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => navigate(`/events?tab=${b.dataset.tab}`));
    b.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); tabs[(i + d + tabs.length) % tabs.length].click(); }
    });
  });
  const sel = $('#ecity', el);
  if (sel) sel.addEventListener('change', () => { cityFilter = sel.value; render(el, { query }); $('#ecity', el).focus(); });
}

export function renderDetail(el, { params }) {
  const e = events.find((x) => x.id === Number(params.id));
  if (!e) { navigate('/events', { replace: true }); return; }
  const t = s.events;
  const going = isGoing(e.id);
  el.innerHTML = `
    ${header({ title: e.title, back: '/events' })}
    <div class="page">
      <div class="event__hero">${pizzaArt(e.seed, '')}</div>
      <dl class="facts">
        <div><dt>${icon('calendar', { size: 18 })}${esc(t.when)}</dt><dd>${esc(fmtDateLong(e.date))} · ${esc(e.time)}</dd></div>
        <div><dt>${icon('map-pin', { size: 18 })}${esc(t.where)}</dt><dd>${esc(e.venue)}, ${esc(s.cities[e.city])}</dd></div>
        <div><dt>${icon('users', { size: 18 })}${esc(t.going)}</dt><dd>${esc(t.goingN(e.going + (going ? 1 : 0)))}</dd></div>
      </dl>
      <p>${esc(e.desc)}</p>
      <button class="btn ${going ? 'btn--secondary' : 'btn--primary'} btn--block" type="button" id="go" aria-pressed="${going}">${icon(going ? 'check' : 'plus', { size: 20 })}${esc(going ? t.youGo : t.notGoing)}</button>
    </div>`;
  $('#go', el).addEventListener('click', () => {
    if (!requireAuth()) return;
    const on = toggleGoing(e.id);
    toast(on ? t.goingToast : t.notGoingToast, { type: on ? 'success' : 'info' });
    renderDetail(el, { params });
    $('#go', el).focus();
  });
}
