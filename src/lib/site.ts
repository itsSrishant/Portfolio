/**
 * Single source of truth for this site's own public identity — used to
 * build canonical links, the sitemap, robots.txt, and JSON-LD `url`
 * fields. Mirrors the same pattern SEOOptimiz's own `lib/site.ts` uses.
 *
 * TODO — replace SITE_URL below once this is actually deployed somewhere.
 * There's no automatic way to detect it here the way a Next.js app on
 * Vercel can (this is a plain Vite SPA, and both a Netlify `_redirects`
 * and a `vercel.json` exist in this repo, so the real host isn't even
 * settled yet). Whatever the real address ends up being — a platform
 * subdomain is fine to start with, it doesn't have to be a purchased
 * domain — update this one constant and canonical links, the sitemap,
 * robots.txt's Sitemap: line, and every JSON-LD `url` field all follow
 * automatically. Shipping the placeholder below as-is would repeat the
 * exact non-resolving-URL mistake found and fixed in SEOOptimiz itself.
 */
export const SITE_URL = 'https://srishant-kulkarni-portfolio.example';

export const SITE_NAME = 'Srishant Kulkarni';

// Kept identical to the static <title>/<meta description> already in
// index.html, so navigating from a project page back to "/" restores
// exactly what a fresh load already shows — not a second, drifting copy.
export const DEFAULT_TITLE = 'Srishant Kulkarni — AI & Software Engineer';
export const DEFAULT_DESCRIPTION =
  'Srishant Kulkarni — B.E. Artificial Intelligence & Data Science student and software engineer. I build AI-powered voice systems, web applications and backend services.';
