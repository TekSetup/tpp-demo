# TPP Mockup (Phase 1)

Interactive, front-end only mockup of the Tutti per la Pizza consumer app. Plain HTML, CSS and JavaScript (ES modules). No build step, no npm dependencies, no real backend. The product brief and style guide live in the private project repository.

## Run it

ES modules do not load from `file://`, so serve the folder with any static server:

```bash
python3 mockup/dev-server.py
```

Run that from the repository root (in the public demo repo the app is the repo root, so just `python3 dev-server.py`) and open <http://localhost:5173>. On desktop the app appears inside a phone frame. Below 500 px wide it goes full screen.

`dev-server.py` disables caching so edits show up on reload. Any static server works, but plain `python3 -m http.server` lets browsers cache modules, so you may need a hard reload (Cmd+Shift+R).

## Structure

```
index.html            shell: phone frame, tab bar, overlay and toast containers
css/
  tokens.css          ALL colors, type, spacing, radius, motion (light + dark)
  base.css            reset, typography helpers, phone frame
  components.css      buttons, inputs, chips, cards, tabs, sheets, toasts, tab bar
  screens.css         screen-specific styles
js/
  app.js              boot, routes, tab bar, referral validation timer
  router.js           hash router (#/home, #/place/3, #/my-tpp?tab=rewards)
  state.js            state, localStorage, and ALL points rules (caps, levels, ledger)
  ui.js               icons, logo, sheets, toasts, forms helpers, points feedback
  strings.js          live copy object, updated in place when the language changes
  lang.js             setLang(): swaps dictionary + localized mock data (es, it, en, fr)
  tour.js             first-run guided tour (spotlight + coach card)
  i18n/               es.js, en.js, it.js, fr.js (UI copy) and content-*.js (translated mock data)
  icons.js, art.js    inline SVG icons, generated pizza illustrations
  screens/            one file per screen
data/
  config.js           THE place to tune caps, point values, level thresholds
  places.js jobs.js content.js events.js rewards.js   mock data
assets/
  logo/ (optimised logo files, favicon), CREDITS.md
```

## Where to change things

| I want to change | Edit |
|---|---|
| Points per action, caps, level thresholds | `data/config.js` |
| Colors, fonts, spacing, dark theme | `css/tokens.css` |
| Any text shown to users | `js/i18n/<lang>.js` (keep all four files with the same keys) |
| Translated mock data (jobs, content, events...) | `js/i18n/content-<lang>.js`, keyed by item id. Spanish source stays in `data/*.js` |
| Guided tour steps | `STEPS` in `js/tour.js` and `tour` in the i18n files |
| Pizzerías, jobs, events, rewards, content | `data/*.js` |
| Points logic (earn, spend, cap handling) | `js/state.js` |

## Behavior notes

- **Persistence:** session, favorites, reviews, ledger, applications and settings live in `localStorage` (key `tpp-mockup-v1`). Profile, then "Restablecer datos de la demo" wipes it.
- **Demo helpers:** Profile has "+100 puntos de prueba" to reach levels quickly. Audio and video players run in 8 seconds and have a "skip to end" button. A recommended pizzería is "validated" about 6 seconds after sending.
- **Levels** use lifetime points earned, so redeeming rewards never lowers a level.
- **Caps** are lifetime per category. Pending (unvalidated) referral points count against the cap.
- **Placeholders:** values marked `PLACEHOLDER` in `data/config.js` and the logo are awaiting client confirmation (see the private project brief).
- **No external images or keys:** pizzería "photos" are generated SVG illustrations and the map is a schematic SVG. The only network request is Google Fonts (Fraunces, Inter).

## Deploy

Static site, no build. `vercel.json` sets cache and no-index headers. With the Vercel CLI, from this folder: `vercel` for a preview, `vercel --prod` for production. Output directory is the folder itself.
