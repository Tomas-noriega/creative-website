import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, type Plugin} from 'vite';

/**
 * Once Reel Lifts is on the App Store, build with VITE_APP_STORE_ID=<numeric id>
 * (a repository variable in the deploy workflow) and Safari on iPhone shows
 * the "Open in App Store" banner at the top of the site.
 */
function appStoreBanner(): Plugin {
  const id = process.env.VITE_APP_STORE_ID;
  return {
    name: 'app-store-banner',
    transformIndexHtml: () => (id ? [{tag: 'meta', attrs: {name: 'apple-itunes-app', content: `app-id=${id}`}, injectTo: 'head'}] : []),
  };
}

export default defineConfig({
  // Served as a GitHub Pages project site: https://tomas-noriega.github.io/creative-website/
  base: '/creative-website/',
  plugins: [react(), tailwindcss(), appStoreBanner()],
  build: {
    // Frame sequence and loop video live in public/ and are served as-is.
    target: 'es2020',
  },
});
