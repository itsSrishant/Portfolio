import { useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let activeLenis: Lenis | null = null;

/**
 * The one Lenis instance the page ever creates, for components that need to
 * pause/resume it directly (CinematicIntro locks scroll during its autoplay
 * by calling `.stop()`/`.start()` here) rather than fighting it with their
 * own scroll-prevention logic. Null under reduced motion or before the
 * provider has mounted — callers must treat that as "nothing to do."
 */
export function getLenisInstance(): Lenis | null {
  return activeLenis;
}

/**
 * Single source of truth for scroll ticking: gsap.ticker drives Lenis, and
 * Lenis's own scroll event drives ScrollTrigger.update. Two independent rAF
 * loops fighting over the same scroll position is what causes the jitter
 * Lenis+ScrollTrigger integrations are notorious for — this keeps there
 * being exactly one.
 *
 * Under reduced motion, Lenis is never created at all: the page falls back
 * to native scroll, and every component that builds a scrub timeline on top
 * of ScrollTrigger checks the same media query and skips straight to its
 * settled end-state instead (see CinematicIntro).
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    activeLenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      activeLenis = null;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
