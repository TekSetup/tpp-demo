import { s } from '../strings.js';
import { navigate } from '../router.js';
import { continueAsGuest } from '../state.js';
import { $, $$, esc, icon, logo } from '../ui.js';
import { LANGS, setLang } from '../lang.js';
import { flag } from '../flags.js';

export function render(el) {
  el.innerHTML = `
    <section class="welcome">
      <div class="langmenu">
        <button type="button" class="langmenu__btn" id="lang-btn" aria-haspopup="menu" aria-expanded="false" aria-controls="lang-list" aria-label="${esc(s.welcome.languages)}: ${esc(LANGS.find((l) => l.code === s.lang).name)}">
          <span class="lang__flag">${flag(s.lang)}</span><span class="langmenu__code">${s.lang}</span>${icon('chevron-down', { size: 16, cls: 'langmenu__chev' })}
        </button>
        <ul class="langmenu__list" id="lang-list" role="menu" aria-label="${esc(s.welcome.languages)}" hidden>
          ${LANGS.map((l) => `<li role="none"><button type="button" role="menuitemradio" class="langmenu__item" data-lang="${l.code}" lang="${l.code}" aria-checked="${l.code === s.lang}"><span class="lang__flag">${flag(l.code)}</span><span>${esc(l.name)}</span>${l.code === s.lang ? icon('check', { size: 18 }) : ''}</button></li>`).join('')}
        </ul>
      </div>
      <div class="welcome__hero">
        <div class="welcome__logo">${logo(168)}</div>
        <h1 class="welcome__title">${s.welcome.title.map((t) => `<span>${esc(t)}</span>`).join(' ')}</h1>
        <p class="welcome__sub">${esc(s.welcome.sub)}</p>
      </div>
      <ul class="perks">
        ${s.welcome.perks.map((p) => `<li class="perk"><span class="perk__icon">${icon(p.icon)}</span><div><h2 class="h3">${esc(p.title)}</h2><p class="muted small">${esc(p.text)}</p></div></li>`).join('')}
      </ul>
      <div class="stack welcome__actions">
        <button class="btn btn--primary btn--block" type="button" id="start">${esc(s.welcome.start)}</button>
        <button class="btn btn--secondary btn--block" type="button" id="guest">${esc(s.welcome.guest)}</button>
        <button class="btn btn--text btn--block" type="button" id="have">${esc(s.welcome.have)}</button>
      </div>
    </section>`;
  const btn = $('#lang-btn', el), list = $('#lang-list', el);
  const items = () => $$('.langmenu__item', list);
  const close = (refocus = false) => { list.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (refocus) btn.focus(); };
  const open = () => { list.hidden = false; btn.setAttribute('aria-expanded', 'true'); (items().find((i) => i.getAttribute('aria-checked') === 'true') || items()[0]).focus(); };
  btn.addEventListener('click', () => (list.hidden ? open() : close()));
  btn.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); open(); } });
  items().forEach((i) => i.addEventListener('click', () => { setLang(i.dataset.lang); const nb = document.getElementById('lang-btn'); if (nb) nb.focus(); }));
  list.addEventListener('keydown', (e) => {
    const all = items(), at = all.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); all[(at + 1) % all.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); all[(at - 1 + all.length) % all.length].focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'Tab') close();
  });
  const outside = (e) => { if (!list.hidden && !e.target.closest('.langmenu')) close(); };
  document.addEventListener('click', outside);
  $('#start', el).addEventListener('click', () => navigate('/signup'));
  $('#have', el).addEventListener('click', () => navigate('/signup'));
  $('#guest', el).addEventListener('click', () => { continueAsGuest(); navigate('/home'); });
  return () => document.removeEventListener('click', outside);
}
