import { s } from '../strings.js';
import { navigate } from '../router.js';
import { continueAsGuest } from '../state.js';
import { $, $$, esc, icon, logo } from '../ui.js';
import { LANGS, setLang } from '../lang.js';

export function render(el) {
  el.innerHTML = `
    <section class="welcome">
      <div class="langbar" role="group" aria-label="Idioma / Language / Lingua / Langue">
        ${LANGS.map((l) => `<button type="button" data-lang="${l.code}" lang="${l.code}" aria-pressed="${l.code === s.lang}" aria-label="${esc(l.name)}">${l.code.toUpperCase()}</button>`).join('')}
      </div>
      <div class="welcome__hero">
        <div class="welcome__logo">${logo(120)}</div>
        <h1 class="welcome__title">${esc(s.welcome.title)}</h1>
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
  $$('[data-lang]', el).forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  $('#start', el).addEventListener('click', () => navigate('/signup'));
  $('#have', el).addEventListener('click', () => navigate('/signup'));
  $('#guest', el).addEventListener('click', () => { continueAsGuest(); navigate('/home'); });
}
