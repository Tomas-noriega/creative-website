/**
 * Every word on the page. Reel Lifts is Tomas Noriega's Marketing Venture
 * for MKTG 1101 (Fairfield University): an iOS app concept that analyzes
 * filmed top sets and meal photos to coach lifters toward a PR. Research
 * figures come from his venture workspace (CDC BRFSS 2023, App Store
 * reviews, an AI-simulated focus group).
 */

/** public/ files live under the deploy base (GitHub Pages serves a subpath). */
const BASE = import.meta.env.BASE_URL;

export const brand = {
  name: 'Reel Lifts',
  wordmark: 'REEL LIFTS',
  tagline: ['Your lifts analyzed,', 'nutrition optimized'],
  /** Big outlined lettering on the hero. */
  big: 'PR',
  cta: 'Join the waitlist',
  ctaShort: 'Join waitlist',
  ctaUrl: 'mailto:tomas.noriega@icloud.com?subject=Reel%20Lifts%20waitlist&body=Add%20me%20to%20the%20Reel%20Lifts%20waitlist.',
  founderUrl: 'https://tomas-noriega.github.io/',
};

export const nav = [
  {label: 'How it works', href: '#details'},
  {label: 'A training day', href: '#day'},
  {label: 'Why now', href: '#relaunch'},
];

export const hero = {
  image: `${BASE}media/icon.jpg`,
  imageAlt: 'The Reel Lifts app icon: two lifters filming themselves inside a yellow camera frame.',
  title: ['No guesswork.', 'Just PRs.'],
  body: 'Film your top set and snap your meals. Reel Lifts reads your bar path, depth and plate, then tells you exactly what to lift and eat next.',
  handle: 'Pull the cover',
  model: ['Reel Lifts', 'AI lift + meal coach'],
  slogan: ['Lifts analyzed,', 'nutrition optimized'],
  note: 'An iOS app for anyone chasing a personal record, in the gym or on the scale: beginners, gym regulars and powerlifters.',
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
  eyebrow: 'How it works',
  heading: 'Film it. Snap it. Hit it.',
  image: `${BASE}media/analysis.svg`,
  imageAlt: 'An illustrative Reel Lifts analysis: bar path, squat depth, a meal photo with macros and a plan toward a PR.',
  items: [
    {id: 'path', label: '01', title: 'Bar path', body: 'Film only your heaviest set. The AI traces the bar, measures drift and speed, and flags the rep where form started to slip.', x: 25, y: 25, image: `${BASE}media/path.svg`},
    {id: 'depth', label: '02', title: 'Depth check', body: 'Hip crease below the knee, or not? Every squat gets a clear call, so you stop guessing whether that rep counted.', x: 75, y: 25, image: `${BASE}media/depth.svg`},
    {id: 'meal', label: '03', title: 'Meal photo', body: 'Snap your plate for calories and macros, with a confidence score. Wrong guess? Fix it in one tap.', x: 25, y: 75, image: `${BASE}media/meal.svg`},
    {id: 'plan', label: '04', title: 'Your PR plan', body: 'Lifts and meals come together into step-by-step targets, and the app tells you why it changed the plan.', x: 75, y: 75, image: `${BASE}media/plan.svg`},
  ],
};

/** A training day with the app — hours on a 24h clock. */
export const day = {
  eyebrow: 'A training day',
  heading: 'Five check-ins, one PR plan.',
  note: 'Illustrative training day.',
  dialLabel: 'TRAINING DAY',
  start: 6,
  end: 22,
  items: [
    {at: 7.5, label: 'Breakfast photo: oats and eggs', benefit: 'Macros in seconds'},
    {at: 12.5, label: 'Lunch photo between classes', benefit: 'Calories on track'},
    {at: 17, label: 'Film your squat top set', benefit: 'Bar path + depth'},
    {at: 18.5, label: 'Review: the bar moved fast', benefit: 'Plan moves up'},
    {at: 20.5, label: 'Dinner photo, plan for tomorrow', benefit: 'Next step to your PR'},
  ],
};

export const relaunch = {
  eyebrow: 'Why now',
  heading: ['Lifting went mainstream.', 'Your coach should too.'],
  marquee: 'No guesswork · Just PRs · Reel Lifts · ',
  steps: [
    {n: '51%', label: 'of US adults aged 18–24 strength train at least twice a week (CDC, 2023)', image: `${BASE}media/icon.jpg`},
    {n: '41%', label: 'of all US adults do, up from 29% in 2011', image: `${BASE}media/analysis.svg`},
    {n: '$0', label: 'to start: free bar path analysis, with the price shown before sign-up', image: `${BASE}media/plan.svg`},
  ],
};

export const shop = {
  eyebrow: 'Find your plan',
  heading: ['Your next PR', 'starts here.'],
  body: 'Tell us where you are and what you’re chasing. We’ll show you how Reel Lifts would coach you.',
  levels: ['Beginner', 'Gym regular', 'Powerlifter'],
  goals: ['Hit a lifting PR', 'Reach a bodyweight goal'],
  /** plans[level][goal] */
  plans: [
    [
      {name: 'Learn', advice: 'Form checks on every top set, then a little more weight each week.'},
      {name: 'Learn', advice: 'Quick meal photos and a starter plan that builds a base while your weight moves at a steady pace.'},
    ],
    [
      {name: 'Build', advice: 'Weekly bar path and speed reviews tell you when to push your top set and when to hold.'},
      {name: 'Build', advice: 'Meal-photo macros tuned to training days, so your weight changes without losing strength.'},
    ],
    [
      {name: 'Peak', advice: 'Squat, bench and deadlift tracking with depth calls and a plan that peaks toward a new total.'},
      {name: 'Peak', advice: 'Hit your weight class: nutrition targets that protect your total while you cut or bulk.'},
    ],
  ],
  note: 'iOS · Free to start · Price shown up front',
};
