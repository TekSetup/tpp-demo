// Live copy object. Starts in Spanish and is updated IN PLACE by setLang() (js/lang.js),
// so every screen that reads `s.x.y` at render time shows the active language.
import es from './i18n/es.js';

export const s = { ...es };
