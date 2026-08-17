import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * A scroll-driven vertical process timeline — the "line scroll" pattern
 * from SEOOptimiz's marketing site, rebuilt for this codebase's own
 * conventions rather than ported wholesale.
 *
 * Two independent animations share one track:
 *  1. A three-layer glow (wide blurred halo, tighter halo, crisp core) is
 *     scaled in together via a single scrubbed ScrollTrigger, so the "lit"
 *     portion of the rail tracks scroll position exactly — this is what
 *     makes it read as a rope of light being drawn, not a progress bar.
 *  2. Each step has its own `toggleActions` ScrollTrigger that slides its
 *     card in from alternating sides and blooms its node — independent of
 *     the scrub, so steps still animate correctly if the reader jumps
 *     straight to one via a link instead of scrolling continuously.
 *
 * `gsap.context` scopes every selector-free `gsap.set`/`.to` call to
 * `trackRef` and gives one `ctx.revert()` for cleanup, rather than an
 * array of individually-killed tweens.
 */

export interface TimelineStep {
  number: string;
  title: string;
  body: string;
}

export default function ProcessTimeline({ steps }: { steps: TimelineStep[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const numeralRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const glowRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(cardRefs.current, { x: 0, opacity: 1 });
        gsap.set(numeralRefs.current, { opacity: 0.08, scale: 1 });
        gsap.set(glowRefs.current, { opacity: 1 });
        if (lineFillRef.current) gsap.set(lineFillRef.current, { scaleY: 1 });
        return;
      }

      if (lineFillRef.current && trackRef.current) {
        gsap.to(lineFillRef.current, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: trackRef.current,
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 0.6,
          },
        });
      }

      steps.forEach((_, i) => {
        const item = itemRefs.current[i];
        const card = cardRefs.current[i];
        const numeral = numeralRefs.current[i];
        const glow = glowRefs.current[i];
        if (!item || !card || !numeral || !glow) return;

        const fromLeft = i % 2 === 1;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 78%',
            end: 'top 42%',
            toggleActions: 'play none none reverse',
          },
        });
        tl.fromTo(
          card,
          { x: fromLeft ? -48 : 48, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          0,
        )
          .fromTo(numeral, { opacity: 0, scale: 0.82 }, { opacity: 0.08, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.05)
          .fromTo(glow, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1.25, duration: 0.45, ease: 'power2.out' }, 0)
          .to(glow, { scale: 1, duration: 0.3, ease: 'power2.inOut' }, 0.45);
      });
    }, trackRef);

    return () => ctx.revert();
  }, [steps]);

  return (
    // overflow-x-hidden is load-bearing, not decorative: each card starts
    // its entrance tween translated ±48px off its resting position, which
    // — despite being opacity:0 until it plays — still extends the page's
    // scrollable width on narrow viewports until the animation settles.
    // Clipping it here keeps that pre-reveal offset from ever being
    // reachable, without touching the transform values themselves.
    <div ref={trackRef} className="relative mt-10 overflow-x-hidden">
      {/* Dim rail, always present — the lit fill draws over it. */}
      <div className="bg-line-soft absolute top-0 bottom-0 left-4 w-0.75 rounded-full sm:left-1/2 sm:-translate-x-1/2" />

      <div
        ref={lineFillRef}
        className="absolute top-0 left-4 h-full w-0.75 origin-top sm:left-1/2 sm:-translate-x-1/2"
        style={{ transform: 'scaleY(0)' }}
      >
        <div className="absolute inset-0 rounded-full blur-xl" style={{ backgroundColor: 'var(--accent)', opacity: 0.5 }} />
        <div className="absolute inset-0 rounded-full blur-md" style={{ backgroundColor: 'var(--accent)', opacity: 0.7 }} />
        <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
      </div>

      <ol className="space-y-12 sm:space-y-16">
        {steps.map((step, i) => {
          const alignRight = i % 2 === 1;
          return (
            <li
              key={step.number}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="relative"
            >
              <span
                aria-hidden
                className="bg-line-soft absolute top-7 left-4 z-10 size-3 -translate-x-1/2 rounded-full sm:left-1/2"
              />
              <span
                ref={(el) => {
                  glowRefs.current[i] = el;
                }}
                aria-hidden
                className="absolute top-7 left-4 z-10 size-3 -translate-x-1/2 rounded-full opacity-0 sm:left-1/2"
                style={{
                  backgroundColor: 'var(--accent)',
                  boxShadow:
                    '0 0 16px 3px color-mix(in oklch, var(--accent) 90%, transparent), 0 0 40px 12px color-mix(in oklch, var(--accent) 55%, transparent)',
                }}
              />

              <div className="grid min-w-0 gap-4 pl-11 sm:grid-cols-2 sm:gap-12 sm:pl-0">
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`border-line-soft bg-bg-deep relative min-w-0 overflow-hidden rounded-2xl border p-6 sm:col-span-1 sm:p-7 ${
                    alignRight ? 'sm:col-start-2' : 'sm:text-right'
                  }`}
                >
                  <span
                    ref={(el) => {
                      numeralRefs.current[i] = el;
                    }}
                    aria-hidden
                    className="text-accent pointer-events-none absolute -top-3 right-3 font-bold opacity-0"
                    style={{ fontSize: '4.5rem', lineHeight: 1 }}
                  >
                    {step.number}
                  </span>
                  <span className="mono relative">Step {step.number}</span>
                  <h4 className="text-ink relative mt-3 text-[1.15rem] font-semibold">{step.title}</h4>
                  <p className="text-ink-2 relative mt-2 text-[0.9375rem] leading-[1.7]">{step.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
