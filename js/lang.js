// Language switching: swaps the copy dictionary and the localized mock data IN PLACE, then notifies the app.
// Source language is Spanish (data/*.js and i18n/es.js). Other languages only override what differs.

import { s } from './strings.js';
import es from './i18n/es.js';
import en from './i18n/en.js';
import it from './i18n/it.js';
import fr from './i18n/fr.js';
import cEn from './i18n/content-en.js';
import cIt from './i18n/content-it.js';
import cFr from './i18n/content-fr.js';
import { places } from '../data/places.js';
import { jobs } from '../data/jobs.js';
import { recipes, courses, podcast } from '../data/content.js';
import { events, feed } from '../data/events.js';
import { rewards } from '../data/rewards.js';
import { patch } from './state.js';

// Endonyms: each language is always shown in its own language.
export const LANGS = [
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'en', name: 'English' },
];
const dicts = { es, en, it, fr };
const content = { en: cEn, it: cIt, fr: cFr };
const base = structuredClone({ places, jobs, recipes, courses, podcast, events, feed, rewards });
const listeners = [];

export const onLangChange = (fn) => listeners.push(fn);

function localize(code) {
  const o = content[code] || {};
  const each = (list, key, merge) => list.forEach((item, i) => {
    Object.assign(item, structuredClone(base[key][i]));
    const ov = o[key] && o[key][item.id];
    if (ov) merge(item, ov, base[key][i]);
  });
  each(places, 'places', (it, ov, b) => {
    if (ov.desc) it.desc = ov.desc;
    if (ov.reviews) it.reviews = b.reviews.map((r, j) => ({ ...r, text: ov.reviews[j] ?? r.text }));
  });
  each(jobs, 'jobs', (it, ov) => Object.assign(it, ov));
  each(recipes, 'recipes', (it, ov) => Object.assign(it, ov));
  each(courses, 'courses', (it, ov, b) => {
    if (ov.title) it.title = ov.title;
    if (ov.desc) it.desc = ov.desc;
    if (ov.lessons) it.lessons = b.lessons.map((l) => ({ ...l, title: ov.lessons[l.id] ?? l.title }));
  });
  each(events, 'events', (it, ov) => Object.assign(it, ov));
  each(feed, 'feed', (it, ov) => Object.assign(it, ov));
  each(rewards, 'rewards', (it, ov) => Object.assign(it, ov));
  podcast.tagline = base.podcast.tagline;
  podcast.episodes.forEach((e, i) => Object.assign(e, structuredClone(base.podcast.episodes[i])));
  if (o.podcast) {
    if (o.podcast.tagline) podcast.tagline = o.podcast.tagline;
    podcast.episodes.forEach((e) => { if (o.podcast.episodes[e.id]) Object.assign(e, o.podcast.episodes[e.id]); });
  }
}

export function setLang(code, { persist = true, notify = true } = {}) {
  if (!dicts[code]) code = 'es';
  Object.assign(s, dicts[code]);
  localize(code);
  document.documentElement.lang = code;
  if (persist) patch((st) => { st.lang = code; });
  if (notify) listeners.forEach((fn) => fn(code));
}
