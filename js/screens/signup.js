import { s } from '../strings.js';
import { navigate } from '../router.js';
import { flow } from '../state.js';
import { $, $$, esc, icon, header, field, fieldError } from '../ui.js';

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const isPhone = (v) => { const d = v.replace(/[\s+\-().]/g, ''); return /^\d{9,12}$/.test(d); };

export function render(el) {
  let type = flow.type || 'email';
  el.innerHTML = `
    ${header({ title: s.signup.title, back: '/welcome' })}
    <form class="page" id="form" novalidate>
      <p class="caption muted">${esc(s.signup.step)}</p>
      <p class="lead">${esc(s.signup.lead)}</p>
      <div class="segmented" role="group" aria-label="${esc(s.signup.method)}">
        <button type="button" data-type="email">${icon('mail', { size: 18 })}${esc(s.signup.email)}</button>
        <button type="button" data-type="phone">${icon('phone', { size: 18 })}${esc(s.signup.phone)}</button>
      </div>
      <div id="slot"></div>
      <button class="btn btn--primary btn--block" type="submit">${esc(s.signup.cta)}</button>
      <p class="caption muted center">${esc(s.signup.terms)}</p>
    </form>`;

  const slot = $('#slot', el);
  const form = $('#form', el);

  function paint() {
    const email = type === 'email';
    $$('[data-type]', el).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.type === type)));
    slot.innerHTML = field({
      id: 'contact', label: email ? s.signup.emailLabel : s.signup.phoneLabel, type: email ? 'email' : 'tel',
      ph: email ? s.signup.emailPh : s.signup.phonePh, help: s.signup.helper,
      attrs: `autocomplete="${email ? 'email' : 'tel'}" inputmode="${email ? 'email' : 'tel'}" required aria-required="true"`,
      value: flow.type === type ? flow.contact : '',
    });
    const input = $('#contact', el);
    input.addEventListener('blur', () => { if (input.value) check(); });
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') check(); });
  }
  function check() {
    const input = $('#contact', el);
    const ok = type === 'email' ? isEmail(input.value) : isPhone(input.value);
    fieldError(input, ok ? '' : (type === 'email' ? s.signup.errEmail : s.signup.errPhone));
    return ok;
  }

  $$('[data-type]', el).forEach((b) => b.addEventListener('click', () => { type = b.dataset.type; paint(); $('#contact', el).focus(); }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!check()) { $('#contact', el).focus(); return; }
    flow.type = type;
    flow.contact = $('#contact', el).value.trim();
    navigate('/verify');
  });
  paint();
}
