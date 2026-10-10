// First-run guided tour: spotlight + coach card over the real UI. Shown once on the home screen,
// replayable from Profile. "Seen" is stored in state, so "Restablecer datos de la demo" brings it back.

import { s } from './strings.js';
import { get, patch } from './state.js';
import { $, $$, esc, icon } from './ui.js';

let active = false;
export const isTourActive = () => active;

const tab = (id) => () => $(`#tabbar a[data-tab="${id}"]`);
const STEPS = [
  { key: 'intro' },
  { key: 'search', el: () => $('.searchbar') },
  { key: 'view', el: () => $('.segmented--sm') },
  { key: 'points', el: () => $('.pts-link') },
  { key: 'learn', el: tab('learn') },
  { key: 'jobs', el: tab('jobs') },
  { key: 'mytpp', el: tab('mytpp') },
  { key: 'profile', el: tab('profile') },
  { key: 'outro' },
];

export function maybeStartTour() {
  if (active || get().tourSeen) return;
  setTimeout(() => { if (!active && !get().tourSeen && location.hash.startsWith('#/home')) startTour(); }, 450);
}

export function startTour() {
  if (active) return;
  active = true;
  const t = s.tour;
  const steps = STEPS.filter((st) => !st.el || st.el());
  let i = 0;
  const opener = document.activeElement;

  const root = document.createElement('div');
  root.className = 'tour';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'tour-t');
  root.setAttribute('aria-describedby', 'tour-d');
  root.innerHTML = `<div class="tour__spot" aria-hidden="true"></div>
    <div class="tour__card">
      <p class="caption muted" id="tour-n"></p>
      <h2 class="h2" id="tour-t"></h2>
      <p id="tour-d"></p>
      <div class="tour__dots" aria-hidden="true">${steps.map(() => '<i></i>').join('')}</div>
      <div class="row row--between">
        <button class="btn btn--text btn--sm" type="button" data-skip>${esc(t.skip)}</button>
        <div class="row"><button class="btn btn--secondary btn--sm" type="button" data-prev>${esc(t.prev)}</button><button class="btn btn--primary btn--sm" type="button" data-next></button></div>
      </div></div>`;
  $('#overlay').appendChild(root);
  const view = $('#view'), bar = $('#tabbar');
  view.inert = true; bar.inert = true;

  const spot = $('.tour__spot', root), card = $('.tour__card', root);
  const next = $('[data-next]', root), prev = $('[data-prev]', root);

  function place() {
    const step = steps[i], target = step.el && step.el();
    const f = $('#frame').getBoundingClientRect();
    if (target) {
      const r = target.getBoundingClientRect(), pad = 6;
      Object.assign(spot.style, { left: `${r.left - f.left - pad}px`, top: `${r.top - f.top - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
      const below = f.height - (r.bottom - f.top);
      card.style.transform = '';
      if (below >= card.offsetHeight + 28) { card.style.top = `${r.bottom - f.top + 14}px`; card.style.bottom = 'auto'; }
      else { card.style.bottom = `${f.bottom - r.top + 14}px`; card.style.top = 'auto'; }
    } else {
      Object.assign(spot.style, { left: '50%', top: '50%', width: '0px', height: '0px' });
      card.style.top = '50%'; card.style.bottom = 'auto'; card.style.transform = 'translateY(-50%)';
    }
  }

  function show() {
    const step = steps[i], copy = t.steps[step.key], last = i === steps.length - 1;
    $('#tour-n', root).textContent = t.progress(i + 1, steps.length);
    $('#tour-t', root).textContent = copy.title;
    $('#tour-d', root).textContent = copy.text;
    next.textContent = last ? t.done : t.next;
    prev.hidden = i === 0;
    $$('.tour__dots i', root).forEach((d, k) => d.classList.toggle('is-on', k <= i));
    const target = step.el && step.el();
    if (target && !target.closest('#tabbar')) { view.inert = false; target.scrollIntoView({ block: 'nearest' }); view.inert = true; }
    place();
    next.focus({ preventScroll: true });
  }

  function end() {
    if (!active) return;
    active = false;
    window.removeEventListener('resize', place);
    document.removeEventListener('keydown', onKey);
    root.remove();
    view.inert = false; bar.inert = false;
    patch((st) => { st.tourSeen = true; });
    if (opener && opener.isConnected && opener.focus) opener.focus({ preventScroll: true }); else view.focus();
  }

  function go(d) { const n = i + d; if (n < 0) return; if (n >= steps.length) { end(); return; } i = n; show(); }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); end(); }
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'Tab') {
      const f = $$('button:not([hidden])', card);
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  }
  next.addEventListener('click', () => go(1));
  prev.addEventListener('click', () => go(-1));
  $('[data-skip]', root).addEventListener('click', end);
  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', place);
  show();
}
