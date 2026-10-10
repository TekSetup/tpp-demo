// Learn and listen: recipes (video), courses (lessons), podcast (audio). Completing an item earns points once.

import { s } from '../strings.js';
import { navigate } from '../router.js';
import { isAuthed, isCompleted, markCompleted, earn, earnedIn } from '../state.js';
import { POINTS, DEMO_PLAYER_SECONDS } from '../../data/config.js';
import { recipes, courses, podcast } from '../../data/content.js';
import { $, $$, esc, icon, header, photoImg, progressBar, openSheet, requireAuth, notifyEarn, toast } from '../ui.js';

const TABS = { recipes: 'recipe', courses: 'training', podcast: 'podcast' };

export function render(el, { query }) {
  const tab = TABS[query.tab] ? query.tab : 'recipes';
  const t = s.learn;
  const cat = TABS[tab];
  const cap = POINTS[cat].cap, got = Math.min(cap, earnedIn(cat));

  const doneMark = (id) => (isCompleted(id) ? `<span class="status status--ok">${icon('check', { size: 14 })}${esc(t.done)}</span>` : '');

  const recipesList = () => `<ul class="list-plain">${recipes.map((r) => `<li><button class="media-row" type="button" data-play="${r.id}">
      <span class="media-row__art">${photoImg(r.id)}<span class="media-row__play">${icon('play', { size: 20, fill: true })}</span></span>
      <span class="media-row__main"><b>${esc(r.title)}</b><span class="muted small">${esc(t.minutes(r.minutes))} · ${esc(r.level)}</span><span class="muted small clamp">${esc(r.desc)}</span>${doneMark(r.id)}</span></button></li>`).join('')}</ul>`;

  const coursesList = () => `<ul class="list-plain">${courses.map((c) => {
    const n = c.lessons.filter((l) => isCompleted(l.id)).length;
    return `<li class="card course"><div class="course__head"><div class="course__art">${photoImg(c.id)}</div><div><h3 class="h3">${esc(c.title)}</h3><p class="muted small">${esc(c.desc)}</p><p class="small">${esc(t.lessons(c.lessons.length))} · ${n}/${c.lessons.length} ${esc(t.done.toLowerCase())}</p></div></div>
      <button class="btn btn--text btn--sm" type="button" aria-expanded="false" aria-controls="ls-${c.id}" data-open="${c.id}">${esc(t.lessonsOpen)}${icon('chevron-down', { size: 18 })}</button>
      <ul class="lessons list-plain" id="ls-${c.id}" hidden>${c.lessons.map((l) => `<li><button class="media-row media-row--sm" type="button" data-play="${l.id}"><span class="media-row__play media-row__play--solid">${icon('play', { size: 16, fill: true })}</span><span class="media-row__main"><b>${esc(l.title)}</b><span class="muted small">${esc(t.minutes(l.min))}</span>${doneMark(l.id)}</span></button></li>`).join('')}</ul></li>`;
  }).join('')}</ul>`;

  const podcastList = () => `<div class="podcast-head">${icon('headphones', { size: 32 })}<div><h2 class="h2">${esc(podcast.name)}</h2><p class="small">${esc(t.podcastIntro)}</p></div></div>
    <ul class="list-plain">${podcast.episodes.map((e) => `<li><button class="media-row" type="button" data-play="${e.id}"><span class="media-row__play media-row__play--solid">${icon('play', { size: 18, fill: true })}</span>
      <span class="media-row__main"><b>${esc(e.title)}</b><span class="muted small">${esc(e.guest)} · ${esc(t.minutes(e.minutes))}</span>${doneMark(e.id)}</span></button></li>`).join('')}</ul>`;

  el.innerHTML = `
    ${header({ title: t.title })}
    <div class="page page--tight">
      <div class="tabs" role="tablist" aria-label="${esc(t.tabsLabel)}">
        ${Object.keys(TABS).map((k) => `<button class="tab" role="tab" id="tab-${k}" aria-selected="${k === tab}" aria-controls="panel" tabindex="${k === tab ? 0 : -1}" data-tab="${k}">${esc(t.tabs[k])}</button>`).join('')}
      </div>
      <div class="capline"><span class="small">${esc(t.capLine(s.points.cats[cat].short, got, cap))}</span>${progressBar(got / cap, { color: got >= cap ? 'accent' : 'secondary', label: s.points.cats[cat].name })}</div>
      <div id="panel" role="tabpanel" aria-labelledby="tab-${tab}" tabindex="0">${tab === 'recipes' ? recipesList() : tab === 'courses' ? coursesList() : podcastList()}</div>
    </div>`;

  const tabs = $$('[data-tab]', el);
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => navigate(`/learn?tab=${b.dataset.tab}`));
    b.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); tabs[(i + d + tabs.length) % tabs.length].click(); }
    });
  });

  $$('[data-open]', el).forEach((b) => b.addEventListener('click', () => {
    const list = $('#ls-' + b.dataset.open, el), open = list.hidden;
    list.hidden = !open;
    b.setAttribute('aria-expanded', String(open));
    b.firstChild.textContent = open ? t.lessonsClose : t.lessonsOpen;
  }));

  const catalog = {};
  recipes.forEach((r) => { catalog[r.id] = { item: r, kind: 'video', cat: 'recipe', photo: r.id }; });
  courses.forEach((c) => c.lessons.forEach((l) => { catalog[l.id] = { item: l, kind: 'video', cat: 'training', photo: c.id }; }));
  podcast.episodes.forEach((e) => { catalog[e.id] = { item: e, kind: 'audio', cat: 'podcast' }; });

  $$('[data-play]', el).forEach((b) => b.addEventListener('click', () => openPlayer(catalog[b.dataset.play], () => {
    const open = $$('[aria-expanded=true]', el).map((x) => x.dataset.open);
    render(el, { query });
    open.forEach((id) => { const x = $(`[data-open="${id}"]`, el); if (x) x.click(); });
  })));
}

function openPlayer({ item, kind, cat, photo }, onDone) {
  const t = s.learn;
  let pct = 0, timer = null, playing = false;
  const stage = kind === 'video'
    ? `<div class="player__stage">${photoImg(photo)}</div>`
    : `<div class="player__stage player__stage--audio" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => `<i style="--h:${20 + Math.abs(Math.sin(i * 1.7)) * 70}%"></i>`).join('')}</div>`;
  openSheet({
    title: item.title,
    html: `<div class="player">${stage}
      ${progressBar(0, { color: 'secondary', label: t.progressLabel })}
      <p class="small muted" id="pstate">${esc(t.ready)}</p>
      <div class="row row--center">
        <button class="play-btn" type="button" id="pp" aria-label="${esc(t.play)}">${icon('play', { size: 28, fill: true })}</button>
      </div>
      <button class="btn btn--text btn--block" type="button" id="skip">${esc(t.skip)}</button>
      <p class="caption muted center">${esc(t.mediaNote)}</p></div>`,
    onClose: () => clearInterval(timer),
    onMount: (sh, close) => {
      const fill = $('.progress__fill', sh), bar = $('.progress', sh), pp = $('#pp', sh), state = $('#pstate', sh);
      const setPlaying = (on) => {
        playing = on;
        pp.innerHTML = icon(on ? 'pause' : 'play', { size: 28, fill: true });
        pp.setAttribute('aria-label', on ? t.pause : t.play);
      };
      const paint = () => { fill.style.setProperty('--p', pct / 100); fill.style.animation = 'none'; bar.setAttribute('aria-valuenow', String(Math.round(pct))); };
      const finish = () => {
        clearInterval(timer); pct = 100; paint(); setPlaying(false);
        if (!isAuthed()) { state.textContent = t.completedMsg; requireAuth(); return; }
        if (isCompleted(item.id)) { state.textContent = t.alreadyDone; return; }
        state.textContent = t.completedMsg;
        markCompleted(item.id);
        notifyEarn(earn(cat, item.title, { item: ['content', item.id] }), cat);
        onDone();
      };
      const play = () => {
        if (pct >= 100) pct = 0;
        setPlaying(true); state.textContent = t.playing;
        timer = setInterval(() => { pct = Math.min(100, pct + 100 / (DEMO_PLAYER_SECONDS * 5)); paint(); if (pct >= 100) finish(); }, 200);
      };
      pp.addEventListener('click', () => { if (playing) { clearInterval(timer); setPlaying(false); state.textContent = t.ready; } else play(); });
      $('#skip', sh).addEventListener('click', finish);
    },
  });
}
