// Referral: recommend a pizzería that is not in TPP yet. Points arrive pending, then get "validated".

import { s } from '../strings.js';
import { navigate } from '../router.js';
import { get, addReferral, earn, patch } from '../state.js';
import { CITIES, POINTS } from '../../data/config.js';
import { $, esc, icon, header, field, fieldError, requireAuth, pointsPill, notifyEarn } from '../ui.js';

export function render(el) {
  const r = s.reco;
  el.innerHTML = `
    ${header({ title: r.title, back: '/home' })}
    <form class="page" id="form" novalidate>
      <p class="lead">${esc(r.lead)}</p>
      ${field({ id: 'rname', label: r.name, attrs: 'required aria-required="true" autocomplete="off"' })}
      <div class="field"><label class="label" for="rcity">${esc(r.city)}</label>
        <select class="input" id="rcity" aria-describedby="rcity-err">
          ${CITIES.map((c) => `<option value="${c}">${esc(s.cities[c])}</option>`).join('')}<option value="other">${esc(r.otherCity)}</option></select>
        <p class="error" id="rcity-err" role="alert" hidden></p></div>
      <div id="other" hidden>${field({ id: 'rother', label: r.otherCityLabel, attrs: 'autocomplete="off"' })}</div>
      ${field({ id: 'raddr', label: r.address, attrs: 'autocomplete="off"' })}
      ${field({ id: 'rwhy', label: r.why, tag: 'textarea', ph: r.whyPh, attrs: 'required aria-required="true"' })}
      <p class="muted small">${icon('slice', { size: 16 })} ${esc(r.pointsHint(POINTS.referral.per))}</p>
      <button class="btn btn--primary btn--block" type="submit">${esc(r.cta)}</button>
    </form>`;

  const name = $('#rname', el), why = $('#rwhy', el), other = $('#rother', el), sel = $('#rcity', el);
  const checkName = () => { const ok = name.value.trim().length >= 2; fieldError(name, ok ? '' : r.errName); return ok; };
  const checkWhy = () => { const ok = why.value.trim().length >= 10; fieldError(why, ok ? '' : r.errWhy); return ok; };
  const checkCity = () => { const ok = sel.value !== 'other' || other.value.trim().length >= 2; fieldError(other, ok ? '' : r.errCity); return ok; };
  name.addEventListener('blur', () => { if (name.value) checkName(); });
  why.addEventListener('blur', () => { if (why.value) checkWhy(); });
  sel.addEventListener('change', () => { $('#other', el).hidden = sel.value !== 'other'; if (sel.value === 'other') other.focus(); });

  $('#form', el).addEventListener('submit', (e) => {
    e.preventDefault();
    const a = checkName(), c = checkCity(), w = checkWhy();
    if (!(a && c && w)) { [name, other, why].find((i) => i.getAttribute('aria-invalid') === 'true')?.focus(); return; }
    if (!requireAuth()) return;
    const city = sel.value === 'other' ? other.value.trim() : s.cities[sel.value];
    const id = addReferral({ name: name.value.trim(), city, address: $('#raddr', el).value.trim(), why: why.value.trim() });
    const res = earn('referral', name.value.trim(), { pending: true, ref: id });
    if (res.capped) patch((st) => { const x = st.referrals.find((q) => q.id === id); if (x) x.status = 'approved'; });
    confirmation(el, res);
  });
}

function confirmation(el, res) {
  const r = s.reco;
  el.innerHTML = `
    ${header({ title: r.okTitle })}
    <div class="page center">
      <div class="done-badge">${icon('check-circle', { size: 56 })}</div>
      <p class="lead">${esc(res.capped ? r.okCapped : r.okPending(res.awarded))}</p>
      ${res.capped ? '' : `<p><span class="status status--pending">${esc(r.status)}</span> ${pointsPill(res.awarded)}</p>`}
      <div class="stack">
        <button class="btn btn--primary btn--block" type="button" id="act">${esc(r.viewActivity)}</button>
        <button class="btn btn--secondary btn--block" type="button" id="home">${esc(r.backHome)}</button>
      </div>
    </div>`;
  $('#act', el).addEventListener('click', () => navigate('/my-tpp?tab=history'));
  $('#home', el).addEventListener('click', () => navigate('/home'));
  const h1 = $('h1', el); h1.tabIndex = -1; h1.focus({ preventScroll: true });
}
