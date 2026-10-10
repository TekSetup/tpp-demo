import { s } from '../strings.js';
import { navigate } from '../router.js';
import { flow, signIn } from '../state.js';
import { $, esc, header, field, fieldError, toast } from '../ui.js';

export function render(el) {
  if (!flow.contact) { navigate('/signup', { replace: true }); return; }
  el.innerHTML = `
    ${header({ title: s.verify.title, back: '/signup' })}
    <form class="page" id="form" novalidate>
      <p class="caption muted">${esc(s.verify.step)}</p>
      <p class="lead">${esc(s.verify.lead(flow.contact))}</p>
      ${field({ id: 'code', label: s.verify.label, type: 'text', ph: '000000', help: s.verify.hint,
        cls: 'input--code', attrs: 'inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" required aria-required="true"' })}
      <button class="btn btn--primary btn--block" type="submit">${esc(s.verify.cta)}</button>
      <div class="row row--center">
        <button class="btn btn--text" type="button" id="resend">${esc(s.verify.resend)}</button>
        <button class="btn btn--text" type="button" id="change">${esc(s.verify.change)}</button>
      </div>
    </form>`;
  const input = $('#code', el);
  input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, '').slice(0, 6); if (input.getAttribute('aria-invalid') === 'true') fieldError(input, ''); });
  $('#resend', el).addEventListener('click', () => toast(s.verify.resent, { type: 'info' }));
  $('#change', el).addEventListener('click', () => navigate('/signup'));
  $('#form', el).addEventListener('submit', (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(input.value)) { fieldError(input, s.verify.err); input.focus(); return; }
    signIn({ type: flow.type, contact: flow.contact });
    navigate('/city');
  });
}
