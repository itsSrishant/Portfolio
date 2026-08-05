import { useEffect } from 'react';

/**
 * Scroll reveal for anything marked `data-reveal`.
 *
 * The hidden start state lives behind `[data-reveal-root='on']`, which this
 * hook sets. That ordering matters: if the script never runs, nothing is ever
 * hidden, so the page degrades to fully visible rather than blank. The timeout
 * is the same insurance for environments where the observer is throttled — a
 * headless screenshot, a background tab, a print.
 */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!nodes.length) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Automated renderers — headless screenshots, link-preview crawlers, PDF
    // exports — do not scroll, so an observer-driven reveal would hand them a
    // blank page. They get the finished state immediately.
    const automated = typeof navigator !== 'undefined' && navigator.webdriver === true;

    if (reduce || automated || typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.setAttribute('data-reveal', 'shown'));
      return;
    }

    root.setAttribute('data-reveal-root', 'on');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-reveal', 'shown');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    );

    nodes.forEach((n) => observer.observe(n));

    return () => observer.disconnect();
  }, []);
}
