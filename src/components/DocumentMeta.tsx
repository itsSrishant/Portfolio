import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { projects } from '../data/profile';
import { SITE_NAME, SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from '../lib/site';
import { personJsonLd, projectJsonLd } from '../lib/structuredData';

function setMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setJsonLd(id: string, data: Record<string, unknown> | null): void {
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }
  const script = (existing as HTMLScriptElement | null) ?? document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(script);
}

/**
 * Per-route <title>, meta description, Open Graph/Twitter text, canonical
 * link, and JSON-LD structured data.
 *
 * This is a client-rendered SPA with a single static index.html, so
 * without this every route — including each project's case-study page —
 * shows the exact same homepage metadata forever. Runs alongside
 * RouteEffects (same App-level pattern, kept as a separate component so
 * RouteEffects stays scoped to its own job of scroll behaviour).
 *
 * Honest limit, worth knowing: updating these tags via JS helps real
 * visitors' browser tabs and helps Google specifically (it executes JS
 * before indexing, on a delayed pass). It does NOT help crawlers that
 * never execute JavaScript at all — which is most link-preview bots
 * (LinkedIn, X, WhatsApp, Slack). Those will still show index.html's
 * static title/image for every route, never a per-project preview.
 * Closing that gap fully needs real prerendering or server rendering,
 * which this Vite SPA doesn't have — noted here rather than implied away.
 */
export default function DocumentMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const slug = pathname.startsWith('/work/') ? pathname.slice('/work/'.length) : null;
    const project = slug ? (projects.find((p) => p.slug === slug) ?? null) : null;

    const title = project ? `${project.title} — ${SITE_NAME}` : DEFAULT_TITLE;
    const description = project ? project.lede : DEFAULT_DESCRIPTION;
    const canonicalUrl = `${SITE_URL}${pathname}`;

    document.title = title;
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setCanonical(canonicalUrl);

    setJsonLd('ld-person', personJsonLd());
    setJsonLd('ld-project', project ? projectJsonLd(project, canonicalUrl) : null);
  }, [pathname]);

  return null;
}
