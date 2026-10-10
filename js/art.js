// Generated pizza illustrations used in place of photos (no external images, no licensing).
// Deterministic per seed, so the same pizzería always shows the same picture.

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TABLES = ['#F1D3AE', '#E8C79B', '#D6E2C4', '#F2CFC4', '#E7DAC0', '#C9DDD3'];

export function pizzaArt(seed = 1, label = 'Ilustración de una pizza') {
  const r = rng(seed * 7919);
  const bg = TABLES[seed % TABLES.length];
  const kind = seed % 4; // 0 margherita, 1 pepperoni, 2 veggie, 3 white
  const cx = 160 + (r() - 0.5) * 24, cy = 92 + (r() - 0.5) * 10;
  const sauce = kind === 3 ? '#F5E3B8' : '#C8372D';
  let out = `<svg class="art" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">`;
  out += `<rect width="320" height="180" fill="${bg}"/>`;
  out += `<rect y="132" width="320" height="48" fill="rgba(80,40,20,.07)"/>`;
  out += `<circle cx="${cx + 5}" cy="${cy + 6}" r="76" fill="rgba(80,40,20,.14)"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="74" fill="#D99A4E" stroke="#B97831" stroke-width="3"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="62" fill="${sauce}"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="58" fill="#F6D98F"/>`;
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2, d = r() * 48;
    out += `<ellipse cx="${(cx + Math.cos(a) * d).toFixed(1)}" cy="${(cy + Math.sin(a) * d).toFixed(1)}" rx="${10 + r() * 8}" ry="${6 + r() * 6}" fill="#FBE9B0" opacity=".8"/>`;
  }
  const spot = (n, draw) => { for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = 8 + r() * 42; draw(cx + Math.cos(a) * d, cy + Math.sin(a) * d, a); } };
  if (kind === 1) spot(9, (x, y) => (out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="#B3261E"/><circle cx="${(x - 2).toFixed(1)}" cy="${(y - 2).toFixed(1)}" r="2" fill="#D4574D"/>`));
  if (kind === 0 || kind === 3) spot(6, (x, y, a) => (out += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="9" ry="4.5" fill="#2F8A45" transform="rotate(${(a * 57).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`));
  if (kind === 2) {
    spot(6, (x, y) => (out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="none" stroke="#2B1D16" stroke-width="3"/>`));
    spot(5, (x, y) => (out += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="8" ry="5" fill="#E9D8BD"/>`));
    spot(4, (x, y) => (out += `<rect x="${(x - 4).toFixed(1)}" y="${(y - 4).toFixed(1)}" width="8" height="8" rx="2" fill="#D6402F"/>`));
  }
  return out + '</svg>';
}

export function sliceArt(size = 120) {
  return `<svg class="art-slice" width="${size}" height="${size}" viewBox="0 0 120 120" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 108 18 24a96 96 0 0 1 84 0z" fill="#D99A4E" stroke="#B97831" stroke-width="3" stroke-linejoin="round"/>
    <path d="M60 94 28 30a82 82 0 0 1 64 0z" fill="#F6D98F"/>
    <circle cx="50" cy="44" r="7" fill="#B3261E"/><circle cx="72" cy="52" r="7" fill="#B3261E"/><circle cx="58" cy="70" r="6" fill="#B3261E"/>
  </svg>`;
}
