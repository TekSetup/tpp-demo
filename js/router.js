// Tiny hash router. Routes: '#/home', '#/place/3', '#/my-tpp?tab=rewards'.
// Screens are functions (el, ctx) => optional cleanup function. Deep links work on reload.

const routes = [];
const scrolls = new Map();
let cleanup = null;
let fromApp = false;     // true when the hash change was triggered by navigate()
let depth = 0;           // in-app navigations so far, used to decide between history.back() and a fallback
let guard = () => null;
let beforeLeave = () => {};
let afterRender = () => {};
let viewEl = null;

export function route(pattern, screen, meta = {}) {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
  routes.push({ re, keys, screen, meta });
}

export const hooks = {
  guard: (fn) => { guard = fn; },
  beforeLeave: (fn) => { beforeLeave = fn; },
  afterRender: (fn) => { afterRender = fn; },
};

export function parse(hash = location.hash) {
  const raw = hash.replace(/^#/, '') || '/';
  const [path, qs] = raw.split('?');
  return { path, query: Object.fromEntries(new URLSearchParams(qs || '')) };
}

export function navigate(to, { replace = false } = {}) {
  fromApp = true;
  const target = '#' + to;
  if (target === location.hash) { render(); return; }
  depth += 1;
  if (replace) location.replace(target); else location.hash = to;
}

export function back(fallback = '/home') {
  if (depth > 0) { depth -= 1; history.back(); } else navigate(fallback, { replace: true });
}

export const refresh = () => render({ keepScroll: true });
export const current = () => parse();

function render({ keepScroll = false } = {}) {
  const { path, query } = parse();
  let match = null, params = {};
  for (const r of routes) {
    const m = path.match(r.re);
    if (m) { match = r; r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); }); break; }
  }
  if (!match) { navigate('/home', { replace: true }); return; }
  const redirect = guard(match.meta, path);
  if (redirect && redirect !== path) { navigate(redirect, { replace: true }); return; }

  const key = viewEl.dataset.path;
  if (key) scrolls.set(key, viewEl.scrollTop);
  const samePath = key === path;
  beforeLeave(samePath);
  if (typeof cleanup === 'function') cleanup();
  cleanup = null;

  const restore = keepScroll ? viewEl.scrollTop : (!fromApp && scrolls.has(path) ? scrolls.get(path) : 0);
  fromApp = false;
  viewEl.dataset.path = path;
  viewEl.innerHTML = '';
  viewEl.classList.remove('view-enter');
  cleanup = match.screen(viewEl, { params, query, path }) || null;
  viewEl.scrollTop = restore;
  if (!keepScroll) {
    void viewEl.offsetWidth;                      // restart the enter animation
    viewEl.classList.add('view-enter');
    const h1 = viewEl.querySelector('h1');
    if (h1) { h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
  }
  afterRender(match.meta, path);
}

export function start(el) {
  viewEl = el;
  window.addEventListener('hashchange', () => render());
  if (!location.hash) location.replace('#/home');
  render();
}
