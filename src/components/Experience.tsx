import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from './Section';
import { experience } from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

/**
 * A self-drawing rail beside the contribution list: a thread that fills in
 * with the accent color as the reader scrolls past each contribution,
 * tipped by a glowing marker, with a numbered tick lighting up at each
 * contribution's position. Progress is written straight to the DOM from
 * ScrollTrigger's onUpdate (no React state), matching the direct-write
 * convention used elsewhere for per-frame animation values.
 *
 * Kept narrow (a fixed-width column, not a 12-col grid share) — the rail is
 * a thin line and two-digit numbers, not a second content column, so it
 * shouldn't claim a third of the row the way it did before.
 */
function ContributionRail({ articleRef, count }: { articleRef: React.RefObject<HTMLElement | null>; count: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const tickRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const numberRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const container = containerRef.current;
    const article = articleRef.current;
    const fill = fillRef.current;
    const node = nodeRef.current;
    if (!container || !article || !fill || !node) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let tickOffsets: number[] = [];
    const measure = () => {
      const items = Array.from(article.querySelectorAll<HTMLElement>('[data-contribution-item]'));
      const containerRect = container.getBoundingClientRect();
      tickOffsets = items.map((item) => {
        const r = item.getBoundingClientRect();
        return containerRect.height > 0 ? (r.top + r.height / 2 - containerRect.top) / containerRect.height : 0;
      });
      tickRefs.current.forEach((el, i) => {
        if (el) el.style.top = `${(tickOffsets[i] ?? 0) * 100}%`;
      });
      numberRefs.current.forEach((el, i) => {
        if (el) el.style.top = `${(tickOffsets[i] ?? 0) * 100}%`;
      });
    };
    measure();
    window.addEventListener('resize', measure);

    const applyProgress = (progress: number) => {
      fill.style.transform = `scaleY(${progress})`;
      node.style.top = `${progress * 100}%`;
      node.style.opacity = progress > 0.01 && progress < 0.999 ? '1' : '0';
      tickRefs.current.forEach((el, i) => {
        if (!el) return;
        const lit = progress >= (tickOffsets[i] ?? 1);
        el.style.backgroundColor = lit ? 'var(--accent)' : 'var(--bg)';
        el.style.borderColor = lit ? 'var(--accent)' : 'var(--line-soft)';
      });
      numberRefs.current.forEach((el, i) => {
        if (!el) return;
        const lit = progress >= (tickOffsets[i] ?? 1);
        el.style.color = lit ? 'var(--accent)' : 'var(--ink-3)';
      });
    };

    if (reduceMotion) {
      applyProgress(1);
      return () => window.removeEventListener('resize', measure);
    }

    gsap.set(fill, { transformOrigin: 'top' });
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 0.4,
      onUpdate: (self) => applyProgress(self.progress),
    });

    return () => {
      window.removeEventListener('resize', measure);
      trigger.kill();
    };
  }, [articleRef]);

  return (
    <div ref={containerRef} className="relative hidden w-9 flex-none self-stretch sm:block">
      <div className="bg-line-soft absolute top-0 left-0 h-full w-0.75 rounded-full" />
      <div
        ref={fillRef}
        className="absolute top-0 left-0 h-full w-0.75 scale-y-0 rounded-full"
        style={{
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 18px 3px var(--accent), 0 0 40px 6px color-mix(in oklch, var(--accent) 55%, transparent)',
        }}
      />
      <div
        ref={nodeRef}
        className="absolute left-[1.5px] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          backgroundColor: 'var(--accent-2)',
          boxShadow: '0 0 22px 6px var(--accent), 0 0 45px 12px color-mix(in oklch, var(--accent) 60%, transparent)',
        }}
      />
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            tickRefs.current[i] = el;
          }}
          className="border-line-soft bg-bg absolute left-[1.5px] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-300"
        />
      ))}
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            numberRefs.current[i] = el;
          }}
          className="mono absolute left-3.5 -translate-y-1/2 transition-colors duration-300"
        >
          {String(i + 1).padStart(2, '0')}
        </span>
      ))}
    </div>
  );
}

/**
 * One real role, given the room a real role deserves. A grid of identical cards
 * would make a single genuine internship look like padding.
 */
export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      {experience.map((job) => {
        return <ExperienceEntry key={job.company} job={job} />;
      })}
    </Section>
  );
}

function ExperienceEntry({ job }: { job: (typeof experience)[number] }) {
  const articleRef = useRef<HTMLElement>(null);

  return (
    <article ref={articleRef} className="border-line-soft border-t pt-8" data-reveal>
      <header>
        <h3 className="text-[1.4rem] font-semibold tracking-[-0.02em] sm:text-[1.6rem]">{job.role}</h3>
        <p className="text-ink-2 mt-1">{job.company}</p>
        <span className="mono mt-3 block">
          {job.period}
          {job.periodIsPlaceholder && (
            /* Honest placeholder: better a visible gap than an invented date. */
            <span className="text-ink-3 normal-case"> · dates to confirm</span>
          )}
        </span>
        <p className="text-ink-2 prose-col mt-5 leading-[1.75]">{job.summary}</p>
      </header>

      <div className="mt-10 flex gap-4 sm:gap-6">
        <ContributionRail articleRef={articleRef} count={job.contributions.length} />
        <div className="min-w-0 flex-1">
          <ul>
            {job.contributions.map((item) => (
              <li
                key={item.title}
                data-contribution-item
                className="border-line-soft border-t py-6 first:border-t-0 first:pt-0"
              >
                <h4 className="text-ink text-[1rem] font-medium">{item.title}</h4>
                <p className="text-ink-2 prose-col mt-2 text-[0.95rem] leading-[1.7]">{item.body}</p>
              </li>
            ))}
          </ul>

          <div className="border-line-soft mt-2 flex flex-wrap gap-2 border-t pt-6">
            {job.stack.map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
