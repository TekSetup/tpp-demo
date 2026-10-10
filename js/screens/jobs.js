// Jobs board: filters, newsletter opt-in, detail and apply flow (one application per vacancy).

import { s } from '../strings.js';
import { navigate, back } from '../router.js';
import { get, patch, hasApplied, applyJob, earn } from '../state.js';
import { jobs, roles } from '../../data/jobs.js';
import { CITIES } from '../../data/config.js';
import { $, $$, esc, icon, header, chip, emptyState, toast, openSheet, requireAuth, notifyEarn, fmtDate, field, fieldError } from '../ui.js';

const f = { role: 'all', city: 'all' };

const jobCard = (j) => `<li><article class="card job"><div class="row row--between"><span class="tag">${esc(s.roles[j.role])}</span>${hasApplied(j.id) ? `<span class="status status--ok">${icon('check', { size: 14 })}${esc(s.jobs.applied)}</span>` : ''}</div>
  <h3 class="h3"><a class="stretched" href="#/job/${j.id}">${esc(j.title)}</a></h3>
  <p class="muted small">${esc(j.company)} · ${esc(s.cities[j.city])}</p>
  <p class="small">${icon('clock', { size: 14 })} ${esc(j.type)} · ${esc(j.salary)}</p></article></li>`;

export function render(el) {
  const t = s.jobs;
  el.innerHTML = `
    ${header({ title: t.title })}
    <div class="page page--tight">
      <p class="lead">${esc(t.lead)}</p>
      <div class="chips" role="group" aria-label="${esc(t.role)}">
        ${chip(t.allRoles, { pressed: f.role === 'all', attrs: 'data-role="all"' })}
        ${roles.map((r) => chip(s.roles[r], { pressed: f.role === r, attrs: `data-role="${r}"` })).join('')}
      </div>
      <div class="field"><label class="label" for="jcity">${esc(t.city)}</label>
        <select class="input" id="jcity"><option value="all">${esc(t.allCities)}</option>${CITIES.map((c) => `<option value="${c}" ${f.city === c ? 'selected' : ''}>${esc(s.cities[c])}</option>`).join('')}</select></div>
      <div class="card switch-row"><div><b id="nl-l">${esc(t.newsletter)}</b><p class="muted small" id="nl-h">${esc(t.newsletterHelp)}</p></div>
        <button class="switch" type="button" role="switch" id="nl" aria-checked="${get().newsletter}" aria-labelledby="nl-l" aria-describedby="nl-h"><span></span></button></div>
      <p class="muted small" id="count" aria-live="polite"></p>
      <div id="results"></div>
    </div>`;

  const results = $('#results', el);
  function paint() {
    const list = jobs.filter((j) => (f.role === 'all' || j.role === f.role) && (f.city === 'all' || j.city === f.city));
    $$('[data-role]', el).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.role === f.role)));
    $('#count', el).textContent = t.count(list.length);
    if (!list.length) {
      results.innerHTML = emptyState({ ...t.empty, action: 'data-reset' });
      $('[data-reset]', results).addEventListener('click', () => { f.role = 'all'; f.city = 'all'; $('#jcity', el).value = 'all'; paint(); });
      return;
    }
    results.innerHTML = `<ul class="list-plain">${list.map(jobCard).join('')}</ul>`;
  }
  $$('[data-role]', el).forEach((b) => b.addEventListener('click', () => { f.role = b.dataset.role; paint(); }));
  $('#jcity', el).addEventListener('change', (e) => { f.city = e.target.value; paint(); });
  $('#nl', el).addEventListener('click', (e) => {
    if (!requireAuth()) return;
    const on = !get().newsletter;
    patch((st) => { st.newsletter = on; });
    e.currentTarget.setAttribute('aria-checked', String(on));
    toast(on ? t.newsletterOn : t.newsletterOff, { type: on ? 'success' : 'info' });
  });
  paint();
}

export function renderDetail(el, { params }) {
  const j = jobs.find((x) => x.id === Number(params.id));
  if (!j) { navigate('/jobs', { replace: true }); return; }
  const t = s.jobs;
  const applied = hasApplied(j.id);
  el.innerHTML = `
    ${header({ title: j.title, back: '/jobs' })}
    <div class="page">
      <div><span class="tag">${esc(s.roles[j.role])}</span><p class="h3 mt">${esc(j.company)}</p><p class="muted small">${esc(s.cities[j.city])} · ${esc(t.posted(fmtDate(j.posted)))}</p></div>
      <dl class="facts"><div><dt>${icon('briefcase', { size: 18 })}${esc(t.type)}</dt><dd>${esc(j.type)}</dd></div><div><dt>${icon('award', { size: 18 })}${esc(t.salary)}</dt><dd>${esc(j.salary)}</dd></div></dl>
      <section><h2 class="h2">${esc(t.desc)}</h2><p>${esc(j.desc)}</p></section>
      <section><h2 class="h2">${esc(t.reqs)}</h2><ul class="perk-list">${j.reqs.map((r) => `<li>${icon('check', { size: 16 })}${esc(r)}</li>`).join('')}</ul></section>
      <button class="btn btn--primary btn--block" type="button" id="apply" ${applied ? 'disabled' : ''}>${esc(applied ? t.applied : t.apply)}</button>
    </div>`;
  $('#apply', el).addEventListener('click', () => { if (requireAuth()) openApply(j, el, { params }); });
}

function openApply(j, el, ctx) {
  const t = s.jobs, fm = t.form, user = get().user;
  let cv = false;
  openSheet({
    title: `${fm.title} · ${j.company}`,
    html: `<form id="af" class="stack" novalidate>
      ${field({ id: 'aname', label: fm.name, value: user.name || '', attrs: 'autocomplete="name" required aria-required="true"' })}
      ${field({ id: 'acontact', label: fm.contact, value: user.contact || '', attrs: 'autocomplete="email" required aria-required="true"' })}
      ${field({ id: 'amsg', label: fm.msg, tag: 'textarea' })}
      <button class="btn btn--secondary" type="button" id="cv" aria-pressed="false">${icon('upload', { size: 20 })}<span>${esc(fm.cv)}</span></button>
      <button class="btn btn--primary btn--block" type="submit">${esc(fm.cta)}</button></form>`,
    onMount: (sh, close) => {
      const name = $('#aname', sh), contact = $('#acontact', sh);
      $('#cv', sh).addEventListener('click', (e) => {
        cv = !cv; e.currentTarget.setAttribute('aria-pressed', String(cv));
        $('span', e.currentTarget).textContent = cv ? `${fm.cvAdded} · ${fm.cvRemove}` : fm.cv;
      });
      $('#af', sh).addEventListener('submit', (e) => {
        e.preventDefault();
        const a = name.value.trim().length >= 2, b = contact.value.trim().length >= 5;
        fieldError(name, a ? '' : fm.errName); fieldError(contact, b ? '' : fm.errContact);
        if (!a) { name.focus(); return; }
        if (!b) { contact.focus(); return; }
        applyJob(j.id, { name: name.value.trim(), contact: contact.value.trim(), msg: $('#amsg', sh).value.trim(), cv });
        const res = earn('job', j.title, { item: ['job', j.id] });
        close();
        renderDetail(el, ctx);
        notifyEarn(res, 'job', t.ok(j.company));
      });
    },
  });
}
