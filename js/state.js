// App state, localStorage persistence and ALL points rules (caps, levels, ledger).
// Screens never compute points themselves; they call earn(), spend() and read the helpers below.

import { POINTS, LEVELS, REFERRAL_APPROVAL_MS } from '../data/config.js';

const KEY = 'tpp-mockup-v1';

const fresh = () => ({
  user: null, guest: false, city: 'madrid',
  favorites: [], reviews: [], applied: [], completed: [], going: [], checkins: [],
  referrals: [], ledger: [], redeemed: [],
  tourSeen: false, lang: 'es', theme: 'auto', newsletter: false, notifs: { events: true, rewards: true },
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...fresh(), ...JSON.parse(raw) } : fresh();
  } catch { return fresh(); }
}

let st = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* storage unavailable: demo still works in memory */ }
}

export const get = () => st;
export function patch(fn) { fn(st); save(); }
export function reset() { st = fresh(); try { localStorage.removeItem(KEY); } catch { /* ignore */ } }

// Signup flow data that must not persist (contact being verified).
export const flow = { type: 'email', contact: '' };

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ---------- session ----------
export const isAuthed = () => !!st.user;
export function signIn({ type, contact }) { patch((s) => { s.user = { type, contact, name: '', createdAt: Date.now() }; s.guest = false; }); }
export function continueAsGuest() { patch((s) => { s.guest = true; }); }
export function signOut() { patch((s) => { s.user = null; s.guest = false; }); }

// ---------- points ----------
const approvedEarns = () => st.ledger.filter((e) => e.points > 0 && e.status === 'approved');

export const balance = () => st.ledger.filter((e) => e.status === 'approved').reduce((n, e) => n + e.points, 0);
export const lifetime = () => approvedEarns().reduce((n, e) => n + e.points, 0);
// Pending entries also count against the cap, so a user cannot over-submit while waiting.
export const earnedIn = (cat) => st.ledger.filter((e) => e.cat === cat && e.points > 0).reduce((n, e) => n + e.points, 0);
export const remainingIn = (cat) => Math.max(0, POINTS[cat].cap - earnedIn(cat));

export function levelFor(points) {
  let cur = LEVELS[0];
  for (const l of LEVELS) if (points >= l.min) cur = l;
  return cur;
}
export function levelInfo() {
  const pts = lifetime();
  const current = levelFor(pts);
  const next = LEVELS[LEVELS.findIndex((l) => l.id === current.id) + 1] || null;
  const pct = next ? (pts - current.min) / (next.min - current.min) : 1;
  return { current, next, pts, remaining: next ? next.min - pts : 0, pct: Math.min(1, Math.max(0, pct)) };
}
export const levelRank = (id) => LEVELS.findIndex((l) => l.id === id);

/**
 * Award points for an activity. Respects the per-category cap.
 * opts.pending: entry waits for validation (referrals); opts.ref links it to a referral id.
 * Returns { awarded, capped, levelUp: {from,to}|null, entry|null }.
 */
export function earn(cat, detail, opts = {}) {
  const rule = POINTS[cat];
  const awarded = Math.min(rule.per, remainingIn(cat));
  if (awarded <= 0) return { awarded: 0, capped: true, levelUp: null, entry: null };
  const before = levelInfo().current.id;
  const entry = { id: uid(), ts: Date.now(), cat, detail, points: awarded, status: opts.pending ? 'pending' : 'approved' };
  if (opts.item) entry.item = opts.item;
  if (opts.pending) entry.approveAt = Date.now() + REFERRAL_APPROVAL_MS;
  if (opts.ref) entry.ref = opts.ref;
  patch((s) => { s.ledger.unshift(entry); });
  const after = levelInfo().current.id;
  return { awarded, capped: false, levelUp: before !== after ? { from: before, to: after } : null, entry };
}

export function demoBonus(points) {
  const before = levelInfo().current.id;
  patch((s) => { s.ledger.unshift({ id: uid(), ts: Date.now(), cat: 'demo', points, status: 'approved' }); });
  const after = levelInfo().current.id;
  return before !== after ? { from: before, to: after } : null;
}

export function spend(reward) {
  if (balance() < reward.cost) return null;
  const code = 'TPP-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
  patch((s) => {
    s.ledger.unshift({ id: uid(), ts: Date.now(), cat: 'reward', rewardId: reward.id, points: -reward.cost, status: 'approved' });
    s.redeemed.unshift({ id: uid(), rewardId: reward.id, code, ts: Date.now() });
  });
  return code;
}

/** Approve pending referrals whose delay has passed. Returns the entries newly approved. */
export function settle() {
  const now = Date.now();
  const done = [];
  patch((s) => {
    for (const e of s.ledger) if (e.status === 'pending' && e.approveAt <= now) { e.status = 'approved'; delete e.approveAt; done.push({ ...e }); }
    for (const r of s.referrals) if (r.status === 'pending' && done.some((e) => e.ref === r.id)) r.status = 'approved';
  });
  return done;
}

// ---------- social actions ----------
export const isFavorite = (id) => st.favorites.includes(id);
export function toggleFavorite(id) {
  patch((s) => { s.favorites = s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id]; });
  return isFavorite(id);
}

export const reviewsFor = (placeId) => st.reviews.filter((r) => r.placeId === placeId);
export function addReview(placeId, { rating, text, photo }) {
  patch((s) => { s.reviews.unshift({ id: uid(), placeId, rating, text, photo: !!photo, date: new Date().toISOString().slice(0, 10) }); });
}

export const hasCheckedIn = (placeId) => st.checkins.includes(placeId);
export function checkIn(placeId) { patch((s) => { if (!s.checkins.includes(placeId)) s.checkins.push(placeId); }); }

export const hasApplied = (jobId) => st.applied.some((a) => a.jobId === jobId);
export function applyJob(jobId, data) { patch((s) => { s.applied.unshift({ jobId, ts: Date.now(), ...data }); }); }

export const isCompleted = (id) => st.completed.includes(id);
export function markCompleted(id) { patch((s) => { if (!s.completed.includes(id)) s.completed.push(id); }); }

export const isGoing = (id) => st.going.includes(id);
export function toggleGoing(id) {
  patch((s) => { s.going = s.going.includes(id) ? s.going.filter((x) => x !== id) : [...s.going, id]; });
  return isGoing(id);
}

export function addReferral(data) {
  const id = uid();
  patch((s) => { s.referrals.unshift({ id, ts: Date.now(), status: 'pending', ...data }); });
  return id;
}

export const setTheme = (t) => patch((s) => { s.theme = t; });
export const setCity = (c) => patch((s) => { s.city = c; });
