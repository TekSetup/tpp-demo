// The ONE place to tune the points system. Every value marked PLACEHOLDER is
// awaiting client confirmation (see BRIEFING.md, section 11, questions 7 and 8).

export const POINTS = {
  review:   { cap: 100, per: 20 },                       // cap confirmed by client
  job:      { cap: 50,  per: 10 },                       // cap confirmed by client
  podcast:  { cap: 50,  per: 10 },                       // cap confirmed by client
  eating:   { cap: 100, per: 10, placeholder: true },    // PLACEHOLDER, confirm with client
  training: { cap: 100, per: 15, placeholder: true },    // PLACEHOLDER, confirm with client
  recipe:   { cap: 100, per: 10, placeholder: true },    // PLACEHOLDER, confirm with client
  referral: { cap: 100, per: 25, placeholder: true },    // PLACEHOLDER, confirm with client
};

// Levels are based on LIFETIME points earned, so spending points never lowers a level.
// PLACEHOLDER thresholds, confirm with client.
export const LEVELS = [
  { id: 'bronze', min: 0 },
  { id: 'silver', min: 150 },
  { id: 'gold',   min: 400 },
];

export const REFERRAL_APPROVAL_MS = 6000;   // simulated validation delay
export const DEMO_PLAYER_SECONDS = 8;       // mock audio/video plays at accelerated speed
export const DEMO_BONUS = 100;              // "demo tools" button in Profile
export const CITIES = ['madrid', 'barcelona', 'tenerife'];
