import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenisInstance } from '../lib/smoothScroll';

/**
 * Keeps scroll position sane across client-side route changes, which React
 * Router does nothing about on its own — the single biggest source of "the
 * site feels broken" bugs an SPA router introduces:
 *
 *  - On every real page change (not a same-page hash click), jump to the
 *    top instantly, in both native scroll and Lenis's own virtual
 *    position. Lenis has no idea the document just became a different
 *    height; left alone, it can land the reader mid-page on a shorter
 *    route than the one they left.
 *  - If the URL carries a hash (a nav link clicked from a different page),
 *    scroll to that element once the new page has painted, instead of
 *    just landing at the top and stranding the reader above it.
 *  - Refresh ScrollTrigger after the new route settles. Every scrubbed
 *    animation on it (the rails, the diagrams) was registered against the
 *    *previous* route's layout otherwise, which is the usual cause of a
 *    scroll-linked effect firing at the wrong scroll position right after
 *    an SPA navigation.
 */
export default function RouteEffects() {
  const { pathname, hash } = useLocation();
  const prevPathname = useRef(pathname);

  useLayoutEffect(() => {
    const navigatedPage = prevPathname.current !== pathname;
    prevPathname.current = pathname;
    const lenis = getLenisInstance();

    if (navigatedPage && !hash) {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }

    const raf = requestAnimationFrame(() => {
      if (hash) {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          if (lenis) lenis.scrollTo(el, { offset: 0 });
          else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}
