import { s } from '../strings.js';
import { navigate } from '../router.js';
import { get, setCity } from '../state.js';
import { CITIES } from '../../data/config.js';
import { $, $$, esc, icon, header, toast } from '../ui.js';

export function render(el) {
  let sel = get().city || 'madrid';
  el.innerHTML = `
    ${header({ title: s.city.title })}
    <form class="page" id="form">
      <p class="caption muted">${esc(s.city.step)}</p>
      <p class="lead">${esc(s.city.lead)}</p>
      <fieldset class="cities">
        <legend class="sr-only">${esc(s.city.title)}</legend>
        ${CITIES.map((c) => `<label class="city-card"><input type="radio" name="city" value="${c}" ${c === sel ? 'checked' : ''}>
          <span class="city-card__body">${icon('map-pin')}<span><b>${esc(s.cities[c])}</b><span class="muted small block">${esc(s.city.areas[c])}</span></span><span class="city-card__tick">${icon('check-circle')}</span></span></label>`).join('')}
      </fieldset>
      <button class="btn btn--secondary btn--block" type="button" id="geo">${icon('navigation', { size: 20 })}${esc(s.city.geo)}</button>
      <button class="btn btn--primary btn--block" type="submit">${esc(s.city.cta)}</button>
    </form>`;
  $$('input[name=city]', el).forEach((r) => r.addEventListener('change', () => { sel = r.value; }));
  $('#geo', el).addEventListener('click', () => {
    sel = 'madrid';
    $('input[value=madrid]', el).checked = true;
    toast(s.city.geoDone, { type: 'info' });
  });
  $('#form', el).addEventListener('submit', (e) => { e.preventDefault(); setCity(sel); navigate('/home'); });
}
