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
