// Real photos for pizzerías (Discover). All CC0 / public domain, see assets/CREDITS.md.
// They are generic pizza photos used as stand-ins: they do NOT depict the fictitious venues.

export const primary = {
  1: 10,
  2: 53,
  3: 49,
  4: 1,
  5: 16,
  6: 7,
  7: 46,
  8: 42,
  9: 32,
  10: 43,
  11: 40,
  12: 48,
  13: 23
};

// Shared pool used to fill each venue's gallery (ovens, dough, tables, slices).
export const pool = [4, 5, 6, 17, 66, 18, 27, 21, 22, 24, 25, 30];

const file = (n) => `assets/photos/pizza-${n}.jpg`;

export const photoOf = (placeId) => file(primary[placeId]);

// Main photo first, then 5 from the pool, rotated per venue so galleries differ.
export function galleryOf(placeId) {
  const out = [file(primary[placeId])];
  for (let j = 0; out.length < 6; j++) out.push(file(pool[(placeId * 3 + j) % pool.length]));
  return out;
}

// Photos for recipes, courses, events, rewards and empty states (same CC0 set, by file number).
const byId = {
  'rec-1': 66, 'rec-2': 18, 'rec-3': 32, 'rec-4': 43, 'rec-5': 40,
  'cur-1': 66, 'cur-2': 5, 'cur-3': 27, 'cur-4': 18,
  'event-1': 22, 'event-2': 24, 'event-3': 21, 'event-4': 66, 'event-5': 25,
  'rw-1': 10, 'rw-2': 49, 'rw-3': 30, 'rw-4': 16, 'rw-5': 22, 'rw-6': 46,
  empty: 32,
};
export const photoById = (id) => file(byId[id]);
