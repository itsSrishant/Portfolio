import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from './Section';
import { experience } from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

/**
 * A sleek, centered timeline rail that fills in as the reader scrolls.
 * On desktop (md+), items alternate left and right. On mobile, they stay right.
 */
function ContributionRail({ articleRef, count }: { articleRef: React.RefObject<HTMLElement | null>; count: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const tickRefs = useRef<Array<HTMLSpanElement | null>>([]);

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
        const title = item.querySelector('h4');
        const target = title || item; // Align with title if possible, else whole item
        const r = target.getBoundingClientRect();
        // Pointing exactly at the center of the heading text vertically
        return containerRect.height > 0 ? (r.top + r.height / 2 - containerRect.top) / containerRect.height : 0;
      });
      tickRefs.current.forEach((el, i) => {
        if (el) el.style.top = `${(tickOffsets[i] ?? 0) * 100}%`;
      });
    };
    measure();
    // Re-measure when images load or layout shifts
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
        el.style.boxShadow = lit ? '0 0 10px 2px color-mix(in oklch, var(--accent) 40%, transparent)' : 'none';
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
    <div ref={containerRef} className="absolute top-0 bottom-0 left-[1.1rem] md:left-1/2 w-[2px] md:-translate-x-1/2 z-0">
      <div className="bg-line-soft/60 absolute top-0 left-0 h-full w-full rounded-full" />
      <div
        ref={fillRef}
        className="absolute top-0 left-0 h-full w-full scale-y-0 rounded-full"
        style={{
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 18px 2px var(--accent)',
        }}
      />
      <div
        ref={nodeRef}
        className="absolute left-[1px] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          backgroundColor: 'var(--accent-2)',
          boxShadow: '0 0 16px 4px var(--accent)',
        }}
      />
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            tickRefs.current[i] = el;
          }}
          className="border-line-soft bg-bg absolute left-[1px] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] transition-all duration-300"
        />
      ))}
    </div>
  );
}

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

  useEffect(() => {
    if (!articleRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.contribution-card') as HTMLElement[];
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          }
        );
      });
    }, articleRef);

    return () => ctx.revert();
  }, []);

  return (
    <article ref={articleRef} className="border-line-soft border-t pt-10" data-reveal>
      <header className="bg-surface/30 p-8 md:p-10 rounded-[2rem] border border-line-soft shadow-sm">
        <div className="max-w-3xl">
          <h3 className="text-[1.4rem] font-semibold tracking-[-0.02em] sm:text-[1.6rem]">{job.role}</h3>
          <p className="text-ink-2 mt-1 text-[1.1rem]">{job.company}</p>
          <span className="mono mt-4 block">
            {job.period}
            {job.periodIsPlaceholder && (
              <span className="text-ink-3 normal-case"> · dates to confirm</span>
            )}
          </span>
          <p className="text-ink-2 prose-col mt-6 leading-[1.75] text-[1.05rem]">{job.summary}</p>
        </div>
      </header>

      {/* The Rail container is isolated here so it doesn't stretch down to the tech stack */}
      <div className="mt-12 md:mt-20 relative w-full pb-4">
        <ContributionRail articleRef={articleRef} count={job.contributions.length} />
        
        <ul className="relative z-10 w-full py-2">
          {job.contributions.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <li
                key={item.title}
                data-contribution-item
                className={`contribution-card relative mb-12 md:mb-16 last:mb-0 w-full md:w-[calc(50%-3rem)] pl-12 md:pl-0 ${
                  isEven ? 'md:mr-auto md:pr-0 md:text-right' : 'md:ml-auto md:pl-0 md:text-left'
                }`}
              >
                <div className="group relative bg-surface/30 p-6 md:p-8 rounded-2xl border border-line-soft shadow-sm hover:bg-surface/50 transition-colors duration-300">
                  <h4 className="text-ink text-[1.15rem] font-medium tracking-[-0.01em]">{item.title}</h4>
                  <p className="text-ink-2 mt-3 text-[0.95rem] leading-[1.7]">{item.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Tech Stack is outside the relative timeline container */}
      <div className="border-line-soft mt-8 flex flex-wrap gap-2 border-t pt-8">
        {job.stack.map((tech) => (
          <span key={tech} className="tag">
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}
