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
          backgroundImage: 'linear-gradient(to bottom, var(--color-accent), var(--color-accent-2))',
          boxShadow: '0 0 20px 2px var(--color-accent-2)',
        }}
      />
      <div
        ref={nodeRef}
        className="absolute left-[1px] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          backgroundColor: '#fff',
          boxShadow: '0 0 20px 6px var(--color-accent-2)',
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

      const traces = gsap.utils.toArray('.trace-fill') as HTMLElement[];
      traces.forEach((trace) => {
        gsap.fromTo(
          trace,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: trace.closest('.contribution-card'),
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
      <header className="group/dashboard bg-bg-deep rounded-sm border-2 border-line-soft shadow-[8px_8px_0_var(--color-accent-2)] overflow-hidden relative transition-all duration-300 hover:border-accent-2 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_var(--color-accent-2)]">
        {/* Dashboard Top Bar */}
        <div className="bg-surface/50 border-b border-line-soft px-6 py-3 flex items-center gap-2 relative z-20">
          <div className="w-2.5 h-2.5 rounded-full bg-danger"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-accent-2"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
          <span className="mono text-[0.65rem] text-ink-3 ml-2 uppercase tracking-wider">sys_process: {job.company.replace(/\s+/g, '_').toLowerCase()}</span>
        </div>
        
        {/* Blueprint Grid Hover Background */}
        <div className="absolute inset-0 opacity-0 group-hover/dashboard:opacity-100 transition-opacity duration-700 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>

        <div className="max-w-3xl p-8 md:p-10 relative z-10">
          <h3 className="text-[1.4rem] font-semibold tracking-[-0.02em] sm:text-[1.6rem]">{job.role}</h3>
          <p className="text-ink-2 mt-1 text-[1.1rem]">{job.company}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-surface/50 border border-line-soft rounded-full px-3 py-1 text-[0.75rem] text-ink-2 mono shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-2 animate-[pulse_2s_ease-in-out_infinite]"></span>
            [LOG: {job.period.toUpperCase()}]
            {job.periodIsPlaceholder && (
              <span className="text-ink-3 normal-case ml-1">· dates to confirm</span>
            )}
          </div>
          <p className="text-ink-2 prose-col mt-6 leading-[1.75] text-[1.05rem] relative z-10">{job.summary}</p>
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
                {/* Glowing Circuit Trace */}
                <div className={`absolute top-1/2 -translate-y-1/2 h-[2px] bg-line-soft/40 z-0
                  left-[1.1rem] w-[1.9rem] 
                  md:w-[3rem] ${isEven ? 'md:left-auto md:-right-[3rem]' : 'md:left-[-3rem] md:right-auto'}
                `}>
                  <div className={`trace-fill h-full w-full bg-[var(--accent-2)] shadow-[0_0_10px_var(--color-accent-2)] ${isEven ? 'origin-left md:origin-right' : 'origin-left'}`} />
                </div>

                <div className="group/card relative bg-bg-deep p-6 md:p-8 rounded-sm border-2 border-line-soft shadow-[4px_4px_0_var(--color-accent-2)] hover:border-accent-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--color-accent-2)] transition-all duration-300 overflow-hidden">
                  
                  {/* Distinct Background Animations based on Index */}
                  {index === 0 && (
                    <>
                      {/* Live Audio Wave */}
                      <div className="absolute bottom-0 left-0 w-full h-12 flex items-end justify-between px-2 md:px-8 opacity-10 group-hover/card:opacity-50 transition-opacity duration-300 pointer-events-none">
                        {Array.from({length: 16}).map((_, i) => (
                          <div key={i} className="w-1.5 md:w-2 bg-[var(--accent-2)] rounded-t-sm origin-bottom animate-[waveform_1s_ease-in-out_infinite_alternate]" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 80 + 20}%` }} />
                        ))}
                      </div>
                    </>
                  )}

                  {index === 1 && (
                    <>
                      {/* Data Retrieval Scanner */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-20"></div>
                      <div className="absolute top-0 bottom-0 left-0 w-[5%] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover/card:opacity-[0.15] group-hover/card:animate-[scanline_2.5s_linear_infinite] pointer-events-none z-0" />
                    </>
                  )}

                  {index === 2 && (
                    <>
                      {/* Server Cluster Pulse */}
                      <div className="absolute top-6 right-6 flex gap-1.5 pointer-events-none z-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-2)] opacity-30 group-hover/card:animate-[pulse_1s_ease-in-out_infinite]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-2)] opacity-30 group-hover/card:animate-[pulse_1s_ease-in-out_infinite] delay-150" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-2)] opacity-30 group-hover/card:animate-[pulse_1s_ease-in-out_infinite] delay-300" />
                      </div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-accent-2)_0%,transparent_0%)] opacity-0 group-hover/card:bg-[radial-gradient(circle_at_top_right,rgba(255,122,0,0.1)_0%,transparent_100%)] transition-all duration-700 pointer-events-none z-0" />
                    </>
                  )}

                  <h4 className="text-ink text-[1.15rem] font-medium tracking-[-0.01em] relative z-10">{item.title}</h4>
                  <p className="text-ink-2 mt-3 text-[0.95rem] leading-[1.7] relative z-10">{item.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

    </article>
  );
}
