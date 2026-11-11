/**
 * Every word on the page. Reel Lifts is Tomas Noriega's iPhone lifting app:
 * it films your sets, tracks the movement and coaches you from what you
 * actually lift. Everything here describes the real app.
 *
 * The class version of this site (MKTG 1101 Mission 3) is kept on the
 * `mktg-1101-mission-3` branch.
 */

/** public/ files live under the deploy base (GitHub Pages serves a subpath). */
const BASE = import.meta.env.BASE_URL;

/**
 * The link to the iOS app. Leave appStoreUrl empty until Reel Lifts is on the
 * App Store; every download button on the site then switches over by itself.
 * For Safari's App Store banner, set VITE_APP_STORE_ID when building (see
 * vite.config.ts).
 */
export const app = {
  appStoreUrl: '',
  platform: 'iPhone · iOS 17 and later',
};

const live = app.appStoreUrl !== '';

export const brand = {
  name: 'Reel Lifts',
  wordmark: 'REEL LIFTS',
  tagline: ['Film your sets.', 'Get coached from them.'],
  /** Big outlined lettering on the hero. */
  big: 'PR',
  cta: live ? 'Download on the App Store' : 'Get it at launch',
  ctaShort: live ? 'Download' : 'Get notified',
  ctaUrl: live
    ? app.appStoreUrl
    : 'mailto:tomas.noriega@icloud.com?subject=Reel%20Lifts%20launch&body=Let%20me%20know%20when%20Reel%20Lifts%20is%20on%20the%20App%20Store.',
  founderUrl: 'https://tomas-noriega.github.io/',
};

export const nav = [
  {label: 'Video analysis', href: '#details'},
  {label: 'A training day', href: '#day'},
  {label: 'Progress', href: '#relaunch'},
  {label: 'The app', href: '#app'},
];

export const hero = {
  image: `${BASE}media/icon.jpg`,
  imageAlt: 'The Reel Lifts app icon: two lifters filming themselves inside a yellow camera frame.',
  title: ['No guesswork.', 'Just PRs.'],
  body: 'Film a set on your iPhone. Reel Lifts follows the bar or your body, counts your reps, measures bar path and speed, and coaches you from what you actually lifted.',
  handle: 'Pull the cover',
  model: ['Reel Lifts', 'A coach in your camera'],
  slogan: ['Film the set,', 'lift what it tells you'],
  note: `An iPhone lifting app for beginners, gym regulars and powerlifters. ${app.platform}.`,
};

export type Detail = {
  id: string;
  label: string;
  title: string;
  body: string;
  /** Hotspot position over the analysis board, as % of its box. */
  x: number;
  y: number;
  image: string;
};

export const details: {eyebrow: string; heading: string; image: string; imageAlt: string; items: Detail[]} = {
  eyebrow: 'Record a reel',
  heading: 'Film a set. Get the breakdown.',
  image: `${BASE}media/analysis.svg`,
  imageAlt: 'An illustrative Reel Lifts video analysis: plate and body tracking, rep count with bar speed, reps in reserve, and form tips.',
  items: [
    {id: 'track', label: '01', title: 'Finds the bar', body: 'On a barbell lift the app finds the plate and locks on. For dumbbells, cables and machines it follows your body instead.', x: 25, y: 25, image: `${BASE}media/track.svg`},
    {id: 'speed', label: '02', title: 'Reps, path, speed', body: 'Every rep gets counted, with the bar path and how fast each rep moved. iPhones with LiDAR measure real distances too.', x: 75, y: 25, image: `${BASE}media/speed.svg`},
    {id: 'rir', label: '03', title: 'Reps in reserve', body: 'As your reps slow down, the app estimates how many you had left and flags the ones that turned into grinds.', x: 25, y: 75, image: `${BASE}media/rir.svg`},
    {id: 'form', label: '04', title: 'Form tips', body: 'Partial reps, lowering too fast and swinging your body all get called out, each with a short tip on what to change.', x: 75, y: 75, image: `${BASE}media/form.svg`},
  ],
};

/** A training day with the app, hours on a 24h clock. */
export const day = {
  eyebrow: 'A training day',
  heading: 'One day with Reel Lifts.',
  note: 'Illustrative training day.',
  dialLabel: 'TRAINING DAY',
  start: 6,
  end: 22,
  items: [
    {at: 7.5, label: 'Check this week’s plan', benefit: 'Today: lower body'},
    {at: 12.5, label: 'Read the squat guide', benefit: 'Step-by-step cues'},
    {at: 17, label: 'Record a reel of your top set', benefit: 'Reps, path, speed'},
    {at: 17.25, label: 'Review: about 2 reps left', benefit: 'Weight moves up'},
    {at: 19, label: 'Log the session', benefit: 'Streak kept'},
  ],
};

export const relaunch = {
  eyebrow: 'Logging and progress',
  heading: ['Log every set.', 'Watch the numbers climb.'],
  marquee: 'No guesswork · Just PRs · Reel Lifts · ',
  steps: [
    {n: 'Trends', label: 'A dashboard, lift charts and your strength trend over time', image: `${BASE}media/progress.svg`},
    {n: 'Streaks', label: 'Streaks and milestones that mark each new best', image: `${BASE}media/streak.svg`},
    {n: 'Private', label: 'Optional measurements and progress photos that stay on your phone', image: `${BASE}media/photos.svg`},
  ],
};

/** The rest of the app, plus what it runs on. */
export const appInfo = {
  eyebrow: 'The app',
  heading: ['Everything else', 'you get.'],
  features: [
    {title: 'Exercise guides', body: 'Step-by-step guides for each exercise, so you know the setup before you film it.'},
    {title: 'Calculators', body: 'Quick lifting math in the app when you need a number between sets.'},
    {title: 'PR feed', body: 'Post a PR and get reactions. The feed runs on your phone for now and goes live with the App Store release.'},
    {title: 'Your look', body: 'A dark theme in six app colors, with background art that changes as you level up.'},
  ],
  stackHeading: 'Built natively for iPhone',
  stack: [
    {k: 'Interface', v: 'Swift and SwiftUI for iOS 17+, with Swift Charts for graphs'},
    {k: 'Your data', v: 'SwiftData, stored on your phone'},
    {k: 'Coaching engine', v: 'LiftLensCore, a Swift package with over 200 automated tests'},
    {k: 'Video', v: 'AVFoundation for recording and playback'},
    {k: 'Tracking', v: 'Apple Vision for body pose, ARKit for LiDAR depth'},
    {k: 'Plate detection', v: 'A Core ML model trained in Create ML, with a custom circle finder and patch tracker'},
  ],
};

export const shop = {
  eyebrow: 'Coaching by goal',
  heading: ['Pick a goal.', 'Get a week.'],
  body: 'Choose what you’re training for and how you like to split your week. Reel Lifts builds the plan in periodized blocks with deloads and tapers, and moves your weights up when you beat them.',
  goalLabel: 'Your goal',
  splitLabel: 'Your split',
  goals: [
    {name: 'Hit a PR', advice: 'Set a 1-rep max or a weight for reps on any exercise, and the plan builds toward it with a taper before you test.'},
    {name: 'Get stronger', advice: 'Your main lifts climb block by block, with deloads planned in so you recover.'},
    {name: 'Tone up', advice: 'Steady training volume, with the weights going up each time you beat them.'},
    {name: 'Lose fat, keep muscle', advice: 'Training heavy enough to hold on to your strength while you lose weight.'},
    {name: 'Grow my glutes', advice: 'Extra glute work spread across the week. This goal appears on women’s profiles.'},
  ],
  splits: [
    {name: 'Full body', week: 'Every session trains the whole body.'},
    {name: 'Upper/lower', week: 'Days alternate between upper body and lower body.'},
    {name: 'Push/pull/legs', week: 'Push, pull and leg days rotate through the week.'},
    {name: 'Arnold', week: 'Chest and back, then shoulders and arms, then legs.'},
    {name: 'Powerlifting', week: 'Built around the squat, bench press and deadlift.'},
  ],
  image: `${BASE}media/week.svg`,
  imageAlt: 'An illustrative Reel Lifts week on an upper/lower split, with sets, reps and weights for each day.',
  note: 'Several goals can share one week.',
};
