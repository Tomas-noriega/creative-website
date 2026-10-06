/**
 * Every word on the page. A student relaunch concept for the Google
 * Wellfleet Women's 1/2 Zip — not affiliated with Google, and the footer
 * says so. Product facts come from the Google Merch Shop listing.
 */

/** public/ files live under the deploy base (GitHub Pages serves a subpath). */
const BASE = import.meta.env.BASE_URL;

export const brand = {
  name: 'Wellfleet',
  wordmark: 'WELLFLEET',
  tagline: ['The Google Wellfleet Women’s ½ Zip', 'office to ocean'],
  price: '$79',
  shopUrl: 'https://shop.merch.google/product/google-wellfleet-womens-1-2-zip-ggoegxxx2633',
};

export const nav = [
  {label: 'Details', href: '#details'},
  {label: 'A day in it', href: '#day'},
  {label: 'Your size', href: '#relaunch'},
];

export const hero = {
  image: `${BASE}media/halfzip.jpg`,
  title: ['Made for', 'the Cape morning'],
  body: 'A soft, structured half-zip for the woman whose day starts on the beach and ends on a video call — and back again.',
  handle: 'Pull the sheet',
  model: ['Google Wellfleet', 'Women’s ½ Zip'],
  slogan: ['Office to', 'ocean'],
  note: 'Premium spacer yarn, light insulation, UV protection and odor control. One layer, all day.',
};

export type Detail = {
  id: string;
  label: string;
  title: string;
  body: string;
  /** Hotspot position over the product photograph, as % of its box. */
  x: number;
  y: number;
  image: string;
};

export const details: {eyebrow: string; heading: string; items: Detail[]} = {
  eyebrow: 'Details',
  heading: 'Built for the wind off the bay.',
  items: [
    {id: 'collar', label: '01', title: 'Stand collar', body: 'Zip it up against a 50° sea breeze. Fold it open and it reads crisp on camera at 9 a.m.', x: 48, y: 13, image: `${BASE}media/collar.jpg`},
    {id: 'zip', label: '02', title: 'The half-zip', body: 'Vent it on the climb over the dunes, close it when the fog rolls in. No pulling a sweater over your hair.', x: 43.3, y: 49, image: `${BASE}media/zip.jpg`},
    {id: 'yarn', label: '03', title: 'Spacer yarn', body: 'A knit with air built into it: soft structure that holds its shape and light insulation that never feels bulky.', x: 54.7, y: 38, image: `${BASE}media/logo.jpg`},
    {id: 'cuff', label: '04', title: 'Ribbed cuffs', body: 'Push the sleeves up for the boardwalk, and they stay put. Pull them down when the sun drops.', x: 10, y: 78, image: `${BASE}media/cuff.jpg`},
  ],
};

/** A day in the half-zip — hours on a 24h clock. */
export const day = {
  eyebrow: 'A day in it',
  heading: 'One layer, sunrise to supper.',
  note: 'Illustrative day on Cape Cod.',
  start: 6,
  end: 22,
  items: [
    {at: 6.5, label: 'Sunrise walk, Newcomb Hollow Beach', benefit: 'Light insulation'},
    {at: 9, label: 'Team stand-up, camera on', benefit: 'Polished structure'},
    {at: 12.5, label: 'Lunch on the harbor deck', benefit: 'UV protection'},
    {at: 17.5, label: 'Bike ride along the rail trail', benefit: 'Odor control'},
    {at: 20, label: 'Oysters in town, collar up', benefit: 'Soft and warm'},
  ],
};

export const relaunch = {
  eyebrow: 'The relaunch',
  heading: ['Same half-zip,', 'finally in your size.'],
  steps: [
    {n: 'XS–2XL', label: 'the full women’s size run, back in stock', image: `${BASE}media/collar.jpg`},
    {n: '$0', label: 'shipping and returns — try it on at home', image: `${BASE}media/halfzip.jpg`},
  ],
};

export const shop = {
  eyebrow: 'Find your fit',
  heading: ['Your Cape morning', 'starts at $79.'],
  body: 'Tell us your usual size and how you like a layer to sit. We’ll tell you which Wellfleet to order.',
  sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  fits: ['Relaxed, over a tee', 'Trim, under a jacket'],
};
