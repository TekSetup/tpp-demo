// Boot: theme, routes, tab bar, global click handling and the simulated referral validation.

import { s } from './strings.js';
import { route, hooks, start, navigate, back, refresh, current } from './router.js';
import { get, settle, levelInfo } from './state.js';
import { $, $$, icon, toast, closeAll, applyTheme, openLevelUp, esc } from './ui.js';
import { maybeStartTour } from './tour.js';
import { setLang, onLangChange } from './lang.js';

import { render as welcome } from './screens/welcome.js';
import { render as signup } from './screens/signup.js';
import { render as verify } from './screens/verify.js';
import { render as city } from './screens/city.js';
import { render as home } from './screens/home.js';
import { render as place } from './screens/place.js';
import { render as recommend } from './screens/recommend.js';
import { render as myTpp } from './screens/my-tpp.js';
import { render as learn } from './screens/learn.js';
import { render as jobs, renderDetail as job } from './screens/jobs.js';
import { render as events, renderDetail as event } from './screens/events.js';
import { render as profile } from './screens/profile.js';

const TABS = [
  { id: 'discover', path: '/home', icon: 'compass' },
  { id: 'learn', path: '/learn', icon: 'book-open' },
  { id: 'jobs', path: '/jobs', icon: 'briefcase' },
  { id: 'mytpp', path: '/my-tpp', icon: 'award' },
  { id: 'profile', path: '/profile', icon: 'user' },
];

route('/welcome', welcome, { public: true });
route('/signup', signup, { public: true });
route('/verify', verify, { public: true });
route('/city', city, { public: true });
route('/home', home, { tab: 'discover' });
route('/place/:id', place, { tab: 'discover' });
route('/recommend', recommend, { tab: 'discover' });
route('/my-tpp', myTpp, { tab: 'mytpp' });
route('/learn', learn, { tab: 'learn' });
route('/jobs', jobs, { tab: 'jobs' });
route('/job/:id', job, { tab: 'jobs' });
route('/events', events, { tab: 'discover' });
route('/event/:id', event, { tab: 'discover' });
route('/profile', profile, { tab: 'profile' });

hooks.guard((meta, path) => {
  const st = get();
  if (meta.public) return st.user && path === '/welcome' ? '/home' : null;
  return st.user || st.guest ? null : '/welcome';
});
hooks.beforeLeave(() => closeAll());
hooks.afterRender((meta, path) => {
  const bar = $('#tabbar');
  bar.hidden = !meta.tab;
  $$('a', bar).forEach((a) => {
    const on = a.dataset.tab === meta.tab;
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  if (path === '/home') maybeStartTour();
});

function mountTabbar() {
  $('#tabbar').innerHTML = TABS.map((t) =>
    `<a href="#${t.path}" data-tab="${t.id}">${icon(t.icon)}<span>${esc(s.tabs[t.id])}</span></a>`).join('');
  $('#tabbar').setAttribute('aria-label', s.nav);
}

// One delegated handler for the data-attributes screens use for navigation.
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#/"]');
  if (link) { e.preventDefault(); navigate(link.getAttribute('href').slice(1)); return; }
  const b = e.target.closest('[data-back]');
  if (b) { back(b.dataset.back); return; }
  const n = e.target.closest('[data-nav]');
  if (n) navigate(n.dataset.nav);
});

$('#skip-link').addEventListener('click', (e) => { e.preventDefault(); $('#view').focus(); });

// Referrals are "validated" a few seconds after sending (simulated).
setInterval(() => {
  const before = levelInfo().current.id;
  const done = settle();
  if (!done.length) return;
  for (const e of done) {
    const r = get().referrals.find((x) => x.id === e.ref);
    toast(s.reco.approved(e.points, r ? r.name : ''));
  }
  const after = levelInfo().current.id;
  if (before !== after) setTimeout(() => openLevelUp(after), 650);
  if (['/my-tpp', '/profile'].includes(current().path)) refresh();
}, 1000);

function applyChrome() {
  mountTabbar();
  $('#skip-link').textContent = s.skip;
  $('.device-note').textContent = s.deviceNote;
}
onLangChange(() => { applyChrome(); refresh(); });

applyTheme(get().theme);
setLang(get().lang, { persist: false, notify: false });
applyChrome();
settle();
start($('#view'));
