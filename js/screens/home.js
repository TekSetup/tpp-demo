// Discover: search, chips, filters, list/map toggle, events and referral banners.

import { s } from '../strings.js';
import { navigate } from '../router.js';
import { get, isFavorite, toggleFavorite, setCity, balance } from '../state.js';
import { places, styleIds } from '../../data/places.js';
import { CITIES } from '../../data/config.js';
import { $, $$, esc, icon, logo, chip, ratingRow, placePhoto, toast, openSheet, emptyState, requireAuth } from '../ui.js';

// Module-level so filters survive going into a pizzería and coming back.
const view = { mode: 'list', q: '', chips: new Set(), minRating: 0, maxKm: 0, sort: 'near', selected: null };

const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function filtered(city) {
  const q = norm(view.q.trim());
  let list = places.filter((p) => p.city === city);
  if (q) list = list.filter((p) => norm([p.name, p.area, p.address, ...p.styles.map((x) => s.styles[x])].join(' ')).includes(q));
  const styleSel = styleIds.filter((x) => view.chips.has(x));
  if (styleSel.length) list = list.filter((p) => styleSel.some((x) => p.styles.includes(x)));
  if (view.chips.has('open')) list = list.filter((p) => p.open);
  if (view.chips.has('new')) list = list.filter((p) => p.isNew);
  const minR = Math.max(view.minRating, view.chips.has('top') ? 4.5 : 0);
  if (minR) list = list.filter((p) => p.rating >= minR);
  if (view.maxKm) list = list.filter((p) => p.km <= view.maxKm);
  const byTop = view.sort === 'top' || view.chips.has('top');
  list.sort(byTop && !view.chips.has('near') ? (a, b) => b.rating - a.rating : (a, b) => a.km - b.km);
  return list;
}

export function placeCard(p) {
  const fav = isFavorite(p.id);
  return `<article class="card place-card">
    <div class="place-card__art">${placePhoto(p.id, { alt: s.place.photoMain(p.name) })}
      <button class="fav-btn" type="button" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${esc(fav ? s.home.favRemove : s.home.favAdd)}: ${esc(p.name)}">${icon('heart', { size: 22, fill: fav })}</button>
      ${p.isNew ? `<span class="badge-new">${esc(s.home.isNew)}</span>` : ''}
    </div>
    <div class="place-card__body">
      <h3 class="h3"><a class="stretched" href="#/place/${p.id}">${esc(p.name)}</a></h3>
      ${ratingRow(p.rating, p.reviewCount)}
      <p class="muted small">${esc(p.area)} · ${esc(s.common.km(p.km))} · ${esc(p.price)}</p>
      <div class="tags">${p.styles.map((x) => `<span class="tag">${esc(s.styles[x])}</span>`).join('')}<span class="status ${p.open ? 'status--ok' : 'status--off'}">${esc(p.open ? s.common.open : s.common.closed)}</span></div>
    </div></article>`;
}

function mapMarkup(list) {
  const pins = list.map((p) => `<button class="pin ${view.selected === p.id ? 'is-selected' : ''}" type="button" data-pin="${p.id}" style="left:${p.map.x}%;top:${p.map.y}%" aria-label="${esc(s.home.mapPin(p.name))}" aria-pressed="${view.selected === p.id}"><span class="pin__dot">${icon('slice', { size: 16 })}</span></button>`).join('');
  const sel = list.find((p) => p.id === view.selected);
  return `<div class="map" role="group" aria-label="${esc(s.home.mapLabel)}">
    <svg class="map__bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <rect width="100" height="100" class="map-land"/>
      <path class="map-water" d="M0 78 C20 72 30 90 55 84 S85 80 100 90 L100 100 L0 100Z"/>
      <rect class="map-park" x="8" y="12" width="22" height="16" rx="4"/><rect class="map-park" x="68" y="14" width="18" height="12" rx="4"/>
      <g class="map-road" fill="none" stroke-linecap="round"><path d="M0 40 L100 34" stroke-width="2.2"/><path d="M0 62 L100 56" stroke-width="1.6"/><path d="M30 0 L38 100" stroke-width="2"/><path d="M62 0 L58 100" stroke-width="1.6"/><path d="M0 20 L100 18" stroke-width="1"/><path d="M82 0 L88 100" stroke-width="1"/><path d="M12 0 L18 100" stroke-width="1"/><path d="M0 82 L100 74" stroke-width="1"/></g>
    </svg>${pins}
    ${sel ? `<a class="map__card card" href="#/place/${sel.id}"><div class="map__thumb">${placePhoto(sel.id)}</div><div><h3 class="h3">${esc(sel.name)}</h3>${ratingRow(sel.rating, sel.reviewCount)}<p class="muted small">${esc(sel.area)} · ${esc(s.common.km(sel.km))}</p></div>${icon('chevron-right')}</a>` : ''}
  </div>`;
}

export function render(el) {
  const st = get();
  let city = st.city;

  el.innerHTML = `
    <header class="home-head">
      <span class="home-head__logo">${logo(44)}</span>
      <button class="city-btn" type="button" id="city" aria-haspopup="dialog">${icon('map-pin', { size: 18 })}<span id="city-name"></span>${icon('chevron-down', { size: 18 })}</button>
      ${st.user ? `<a class="pts-link" href="#/my-tpp" aria-label="${esc(s.tabs.mytpp)}: ${esc(s.common.pts(balance()))}">${icon('slice', { size: 16 })}<b>${balance().toLocaleString(s.locale)}</b></a>` : ''}
    </header>
    <div class="page page--tight">
      <div class="searchbar">
        ${icon('search', { size: 20 })}
        <input class="searchbar__input" id="q" type="search" placeholder="${esc(s.home.search)}" aria-label="${esc(s.home.search)}" value="${esc(view.q)}" autocomplete="off">
        <button class="icon-btn" type="button" id="filters" aria-label="${esc(s.home.filters)}" aria-haspopup="dialog">${icon('sliders')}<span class="dot" id="filters-dot" hidden></span></button>
      </div>
      <div class="chips" role="group" aria-label="${esc(s.home.filters)}">
        ${['near', 'top', 'open', 'new'].map((k) => chip(s.home.chips[k], { pressed: view.chips.has(k), attrs: `data-chip="${k}"` })).join('')}
        ${styleIds.map((k) => chip(s.styles[k], { pressed: view.chips.has(k), attrs: `data-chip="${k}"` })).join('')}
      </div>
      <div class="row row--between">
        <p class="muted small" id="count" aria-live="polite"></p>
        <div class="segmented segmented--sm" role="group" aria-label="${esc(s.home.view)}">
          <button type="button" data-mode="list">${icon('list', { size: 18 })}${esc(s.home.list)}</button>
          <button type="button" data-mode="map">${icon('map', { size: 18 })}${esc(s.home.map)}</button>
        </div>
      </div>
      <div id="results"></div>
      <div class="promos">
        <a class="promo promo--events" href="#/events">${icon('calendar', { size: 28 })}<div><h3 class="h3">${esc(s.home.events.title)}</h3><p class="small">${esc(s.home.events.text)}</p></div>${icon('chevron-right')}</a>
        <a class="promo promo--reco" href="#/recommend">${icon('sparkle', { size: 28 })}<div><h3 class="h3">${esc(s.home.reco.title)}</h3><p class="small">${esc(s.home.reco.text)}</p></div>${icon('chevron-right')}</a>
      </div>
    </div>`;

  const results = $('#results', el);

  function paint() {
    const list = filtered(city);
    $('#city-name', el).textContent = s.cities[city];
    $('#count', el).textContent = s.home.results(list.length, s.cities[city]);
    $$('[data-mode]', el).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === view.mode)));
    $$('[data-chip]', el).forEach((b) => b.setAttribute('aria-pressed', String(view.chips.has(b.dataset.chip))));
    $('#filters-dot', el).hidden = !(view.minRating || view.maxKm || view.sort !== 'near');
    if (!list.length) {
      results.innerHTML = emptyState({ ...s.home.empty, action: 'data-reco' });
      $('[data-reco]', results).addEventListener('click', () => navigate('/recommend'));
      return;
    }
    if (view.mode === 'map') {
      if (!list.some((p) => p.id === view.selected)) view.selected = list[0].id;
      results.innerHTML = mapMarkup(list);
      $$('[data-pin]', results).forEach((b) => b.addEventListener('click', () => { view.selected = Number(b.dataset.pin); paint(); }));
    } else {
      results.innerHTML = `<div class="list">${list.map(placeCard).join('')}</div>`;
      $$('[data-fav]', results).forEach((b) => b.addEventListener('click', () => onFav(b)));
    }
  }

  function onFav(b) {
    if (!requireAuth()) return;
    const id = Number(b.dataset.fav);
    const on = toggleFavorite(id);
    toast(on ? s.home.favSaved : s.home.favRemoved, { type: on ? 'success' : 'info' });
    paint();
  }

  $('#q', el).addEventListener('input', (e) => { view.q = e.target.value; paint(); });
  $$('[data-chip]', el).forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.chip;
    if (view.chips.has(k)) view.chips.delete(k); else view.chips.add(k);
    paint();
  }));
  $$('[data-mode]', el).forEach((b) => b.addEventListener('click', () => { view.mode = b.dataset.mode; paint(); }));

  $('#city', el).addEventListener('click', () => openSheet({
    title: s.home.citySheet,
    html: `<div class="stack">${CITIES.map((c) => `<button class="row-btn ${c === city ? 'is-on' : ''}" type="button" data-c="${c}" aria-pressed="${c === city}">${icon('map-pin')}<span>${esc(s.cities[c])}</span>${c === city ? icon('check') : ''}</button>`).join('')}</div>`,
    onMount: (sh, close) => $$('[data-c]', sh).forEach((b) => b.addEventListener('click', () => { city = b.dataset.c; setCity(city); view.selected = null; close(); paint(); })),
  }));

  $('#filters', el).addEventListener('click', () => {
    const f = s.home.filterSheet;
    const opt = (name, legend, items, cur) => `<fieldset class="optset"><legend class="label">${esc(legend)}</legend><div class="chips chips--wrap">${items.map(([v, l]) => `<label class="chip chip--radio"><input type="radio" name="${name}" value="${v}" ${String(cur) === String(v) ? 'checked' : ''}><span>${esc(l)}</span></label>`).join('')}</div></fieldset>`;
    openSheet({
      title: f.title,
      html: `<form id="ff" class="stack">
        ${opt('rating', f.rating, [[0, f.r0], [4, f.r4], [4.5, f.r45]], view.minRating)}
        ${opt('km', f.distance, [[0, s.common.any], [1, f.d1], [3, f.d3], [5, f.d5]], view.maxKm)}
        ${opt('sort', f.sort, [['near', f.sortNear], ['top', f.sortTop]], view.sort)}
        <button class="btn btn--primary btn--block" type="submit">${esc(f.apply)}</button>
        <button class="btn btn--text btn--block" type="button" id="reset">${esc(f.reset)}</button></form>`,
      onMount: (sh, close) => {
        $('#ff', sh).addEventListener('submit', (e) => {
          e.preventDefault();
          const d = new FormData(e.target);
          view.minRating = Number(d.get('rating')); view.maxKm = Number(d.get('km')); view.sort = d.get('sort');
          close(); paint();
        });
        $('#reset', sh).addEventListener('click', () => { view.minRating = 0; view.maxKm = 0; view.sort = 'near'; view.chips.clear(); view.q = ''; $('#q', el).value = ''; close(); paint(); });
      },
    });
  });

  paint();
}
