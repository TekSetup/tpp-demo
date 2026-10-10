// Shared UI helpers: icons, logo, header, sheets, toasts, points feedback, auth gate.

import { s } from './strings.js';
import { ICONS } from './icons.js';
import { navigate } from './router.js';
import { isAuthed, levelRank } from './state.js';
import { pizzaArt, sliceArt } from './art.js';
import { places } from '../data/places.js';
import { jobs } from '../data/jobs.js';
import { recipes, courses, podcast } from '../data/content.js';
import { rewards } from '../data/rewards.js';
import { photoOf } from '../data/photos.js';

export { pizzaArt };

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function icon(name, { size = 24, label = '', cls = '', fill = false } = {}) {
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="icon ${fill ? 'icon--fill ' : ''}${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${ICONS[name] || ''}</svg>`;
}

// Official logo artwork: transparent PNG cut from the client's full-color logo (style.md section 2).
// One file for both themes; it has a white outline so it also reads on dark backgrounds.
export function logo(size = 36) {
  return `<img class="logo" src="assets/logo/logo-color.png" alt="Tutti per la Pizza" height="${size}" width="${Math.round(size * 1.152)}" decoding="async">`;
}

export function tierBadge(levelId, size = 44) {
  return `<span class="tier tier--${levelId}" style="--s:${size}px">${icon('slice', { size: Math.round(size * 0.55) })}</span>`;
}

export function stars(rating, size = 14) {
  const r = Math.round(rating);
  return `<span class="stars" aria-hidden="true">${[1, 2, 3, 4, 5].map((i) => icon('star', { size, fill: i <= r, cls: i <= r ? 'is-on' : 'is-off' })).join('')}</span>`;
}

export function ratingRow(rating, count) {
  return `<span class="rating" role="img" aria-label="${esc(s.common.ratingOf(rating))}${count != null ? `, ${esc(s.common.reviewsN(count))}` : ''}">${stars(rating)}<b>${rating.toLocaleString(s.locale, { minimumFractionDigits: 1 })}</b>${count != null ? `<span class="muted">(${count.toLocaleString(s.locale)})</span>` : ''}</span>`;
}

export const pointsPill = (n, { sign = true } = {}) => `<span class="pts-pill">${icon('slice', { size: 14 })}${sign && n > 0 ? '+' : ''}${n.toLocaleString(s.locale)}</span>`;

export function fmtDate(iso, opts = { day: 'numeric', month: 'short' }) {
  return new Date(iso).toLocaleDateString(s.locale, opts);
}
export const fmtDateLong = (iso) => fmtDate(iso, { weekday: 'long', day: 'numeric', month: 'long' });

export function header({ title, back, right = '' }) {
  return `<header class="appbar">${back ? `<button class="icon-btn" data-back="${esc(back)}" aria-label="${esc(s.common.back)}">${icon('chevron-left')}</button>` : ''}<h1 class="appbar__title">${esc(title)}</h1><div class="appbar__actions">${right}</div></header>`;
}

export function chip(label, { pressed = false, attrs = '' } = {}) {
  return `<button class="chip" type="button" aria-pressed="${pressed}" ${attrs}>${esc(label)}</button>`;
}

export function emptyState({ title, text, cta, action = '', art = true }) {
  return `<div class="empty">${art ? `<div class="empty__art">${pizzaSlice()}</div>` : ''}<h2 class="h2">${esc(title)}</h2><p class="muted">${esc(text)}</p>${cta ? `<button class="btn btn--primary" type="button" ${action}>${esc(cta)}</button>` : ''}</div>`;
}
const pizzaSlice = () => sliceArt(96);

// ---------- toasts ----------
export function toast(msg, { type = 'success' } = {}) {
  const box = $('#toasts');
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  const ic = { success: 'check-circle', info: 'info', error: 'x' }[type];
  t.innerHTML = `${icon(ic, { size: 20 })}<span>${esc(msg)}</span>`;
  box.appendChild(t);
  setTimeout(() => { t.classList.add('is-out'); setTimeout(() => t.remove(), 250); }, 3200);
}

// ---------- sheets and modals ----------
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const setInert = (on) => ['#view', '#tabbar'].forEach((q) => { const el = $(q); if (el) el.inert = on; });
const open = [];

export function openSheet({ title, html, variant = 'sheet', onMount, onClose, dismissible = true }) {
  const overlay = $('#overlay');
  const opener = document.activeElement;
  const id = 'dlg-' + Math.random().toString(36).slice(2, 7);
  const wrap = document.createElement('div');
  wrap.className = `overlay overlay--${variant}`;
  wrap.innerHTML = `<div class="${variant === 'center' ? 'modal' : 'sheet'}" role="dialog" aria-modal="true" aria-labelledby="${id}" tabindex="-1">
    ${variant === 'sheet' ? '<div class="sheet__handle" aria-hidden="true"></div>' : ''}
    <div class="sheet__head"><h2 id="${id}" class="sheet__title">${esc(title)}</h2>${dismissible ? `<button class="icon-btn" type="button" data-close aria-label="${esc(s.common.close)}">${icon('x')}</button>` : ''}</div>
    <div class="sheet__body">${html}</div></div>`;
  overlay.appendChild(wrap);
  setInert(true);
  const panel = wrap.firstElementChild;

  const api = { el: panel, close };
  function close() {
    if (!wrap.isConnected) return;
    wrap.remove();
    open.splice(open.indexOf(api), 1);
    document.removeEventListener('keydown', onKey);
    if (!open.length) setInert(false);
    if (onClose) onClose();
    if (opener && opener.isConnected && opener.focus) opener.focus({ preventScroll: true });
  }
  function onKey(e) {
    if (open[open.length - 1] !== api) return;
    if (e.key === 'Escape' && dismissible) { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const f = $$(FOCUSABLE, panel);
    if (!f.length) { e.preventDefault(); return; }
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  wrap.addEventListener('click', (e) => { if (e.target === wrap && dismissible) close(); });
  $$('[data-close]', panel).forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', onKey);
  open.push(api);
  if (onMount) onMount(panel, close);
  const target = $$(FOCUSABLE, $('.sheet__body', panel))[0] || panel;
  requestAnimationFrame(() => target.focus({ preventScroll: true }));
  return api;
}

export function closeAll() { [...open].reverse().forEach((a) => a.close()); }

// ---------- auth gate ----------
export function requireAuth() {
  if (isAuthed()) return true;
  openSheet({
    title: s.auth.title,
    html: `<p class="muted">${esc(s.auth.text)}</p><div class="stack"><button class="btn btn--primary btn--block" type="button" data-go>${esc(s.auth.cta)}</button><button class="btn btn--ghost btn--block" type="button" data-close>${esc(s.auth.later)}</button></div>`,
    onMount: (el, close) => $('[data-go]', el).addEventListener('click', () => { close(); navigate('/signup'); }),
  });
  return false;
}

// ---------- points feedback ----------
export function notifyEarn(res, cat, message = '') {
  const c = s.points.cats[cat];
  if (res.capped) { if (message) toast(message); toast(s.points.capped(c.short), { type: 'info' }); return; }
  toast(message || s.points.earned(res.awarded, c.ledger));
  if (res.levelUp) setTimeout(() => openLevelUp(res.levelUp.to), 650);
}

export function openLevelUp(levelId) {
  const name = s.levels[levelId].name;
  openSheet({
    title: s.my.levelUpTitle(name), variant: 'center',
    html: `<div class="levelup"><div class="confetti" aria-hidden="true"></div>${tierBadge(levelId, 88)}<p class="muted">${esc(s.my.levelUpText)}</p><button class="btn btn--primary btn--block" type="button" data-go>${esc(s.my.levelUpCta)}</button></div>`,
    onMount: (el, close) => {
      if (!reducedMotion()) {
        const box = $('.confetti', el);
        const colors = ['var(--color-accent)', 'var(--color-secondary)', 'var(--color-primary)'];
        for (let i = 0; i < 28; i++) {
          const p = document.createElement('i');
          const a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 90;
          p.style.cssText = `--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 20}px;--r:${Math.random() * 360}deg;background:${colors[i % 3]};animation-delay:${Math.random() * 120}ms`;
          box.appendChild(p);
        }
      }
      $('[data-go]', el).addEventListener('click', () => { close(); navigate('/my-tpp?tab=rewards'); });
    },
  });
}

// Count a number up/down inside an element (respects reduced motion).
export function tick(el, to, from = 0, ms = 600) {
  const fmt = (n) => Math.round(n).toLocaleString(s.locale);
  if (reducedMotion() || from === to) { el.textContent = fmt(to); return; }
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - k, 3)));
    if (k < 1 && el.isConnected) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export const rankAtLeast = (have, need) => levelRank(have) >= levelRank(need);

// Inline validation helpers shared by forms.
export function fieldError(input, msg) {
  const box = document.getElementById(input.id + '-err');
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  if (box) { box.textContent = msg || ''; box.hidden = !msg; }
}
export function field({ id, label, type = 'text', ph = '', help = '', attrs = '', value = '', tag = 'input', cls = '' }) {
  const helpId = help ? `${id}-help` : '';
  const ctl = tag === 'textarea'
    ? `<textarea class="input ${cls}" id="${id}" rows="4" placeholder="${esc(ph)}" aria-describedby="${helpId} ${id}-err" ${attrs}>${esc(value)}</textarea>`
    : `<input class="input ${cls}" id="${id}" type="${type}" placeholder="${esc(ph)}" value="${esc(value)}" aria-describedby="${helpId} ${id}-err" ${attrs}>`;
  return `<div class="field"><label class="label" for="${id}">${esc(label)}</label>${ctl}${help ? `<p class="help" id="${helpId}">${esc(help)}</p>` : ''}<p class="error" id="${id}-err" role="alert" hidden></p></div>`;
}

// Theme: 'auto' follows the OS (no attribute), otherwise force light or dark.
export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') root.dataset.theme = theme; else delete root.dataset.theme;
}

export function progressBar(pct, { color = 'secondary', label = '' } = {}) {
  const p = Math.min(1, Math.max(0, pct));
  return `<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(p * 100)}" aria-label="${esc(label)}"><span class="progress__fill progress__fill--${color}" style="--p:${p}"></span></div>`;
}

// Builds the ledger line in the ACTIVE language from what was stored (cat + item reference).
export function ledgerLabel(e) {
  if (e.cat === 'demo') return s.points.demo;
  if (e.cat === 'reward') { const r = rewards.find((x) => x.id === e.rewardId); return r ? `${r.title} · ${r.partner}` : ''; }
  const head = s.points.cats[e.cat] ? s.points.cats[e.cat].ledger : '';
  let name = e.detail || '';
  if (e.item) {
    const [type, id] = e.item;
    if (type === 'place') name = (places.find((p) => p.id === id) || {}).name || name;
    else if (type === 'job') name = (jobs.find((j) => j.id === id) || {}).title || name;
    else if (type === 'content') {
      const hit = recipes.find((x) => x.id === id) || podcast.episodes.find((x) => x.id === id) || courses.flatMap((c) => c.lessons).find((x) => x.id === id);
      if (hit) name = hit.title;
    }
  }
  return e.label && !e.detail ? e.label : (name ? `${head} · ${name}` : head);
}

// Real (CC0) photo for a pizzería. `src` defaults to the venue's main photo; `alt` empty marks it decorative.
export function placePhoto(placeId, { src = photoOf(placeId), alt = '', eager = false } = {}) {
  return `<img class="photo" src="${esc(src)}" alt="${esc(alt)}" ${eager ? '' : 'loading="lazy"'} decoding="async">`;
}
