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
    }, articleRef);

    return () => ctx.revert();
  }, []);

  return (
    <article ref={articleRef} className="border-line-soft border-t pt-10" data-reveal>
      <header className="group/dashboard bg-[var(--accent)] text-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_-15px_var(--color-accent)] overflow-hidden relative transition-all duration-500 hover:shadow-[0_0_80px_-15px_var(--color-accent),inset_0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.01]">
        
        {/* Shimmer Hover Background */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite_linear] opacity-0 group-hover/dashboard:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

        <div className="max-w-4xl relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <h3 className="text-[1.8rem] md:text-[2.2rem] font-heading font-bold tracking-tight leading-tight">{job.role}</h3>
            <p className="text-white/90 mt-2 text-[1.2rem] font-medium">{job.company}</p>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-[0.85rem] text-white mono shadow-inner self-start flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-white animate-[pulse_2s_ease-in-out_infinite]"></span>
            [LOG: {job.period.toUpperCase()}]
          </div>
        </div>

        <div className="relative z-10 mt-8 pt-8 border-t border-white/20">
          <p className="text-white/90 font-medium leading-[1.8] text-[1.1rem] max-w-4xl">{job.summary}</p>
        </div>
      </header>

      {/* The Rail container is isolated here so it doesn't stretch down to the tech stack */}
      <div className="mt-12 md:mt-20 relative w-full pb-4">
        <ContributionRail articleRef={articleRef} count={job.contributions.length} />
        
        <ul className="relative z-10 w-full py-2">
          {job.contributions.map((item, index) => {
            const isEven = index % 2 === 0;
            
            // Alternating extreme styling
            const bgColor = isEven ? 'bg-[var(--accent)] text-white' : 'bg-[var(--accent-2)] text-bg-deep';
            const shadowColor = isEven ? 'var(--color-accent)' : 'var(--color-accent-2)';
            const titleColor = isEven ? 'text-white' : 'text-bg-deep';
            const bodyColor = isEven ? 'text-white/90' : 'text-bg-deep/90';
            const dividerColor = isEven ? 'bg-white/30' : 'bg-bg-deep/20';

            return (
              <li
                key={item.title}
                data-contribution-item
                className={`contribution-card relative mb-12 md:mb-16 last:mb-0 w-full md:w-[calc(50%-3rem)] pl-12 md:pl-0 ${
                  isEven ? 'md:mr-auto md:pr-0 md:text-right' : 'md:ml-auto md:pl-0 md:text-left'
                }`}
              >
                <div className={`group/card relative ${bgColor} p-8 md:p-10 rounded-3xl border border-transparent shadow-[0_10px_30px_-10px_${shadowColor}] hover:border-white/50 hover:-translate-y-2 transition-all duration-500 overflow-hidden backdrop-blur-md`}
                     style={{ boxShadow: `0 10px 40px -10px ${shadowColor}` }}>
                  
                  {/* Dynamic Shimmering Scanline Layer */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite_linear] pointer-events-none z-0"></div>
                  
                  {/* Hover Massive Glow Overlay (Injected via style to use dynamic CSS variables) */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-0" 
                       style={{ boxShadow: `0 0 80px -10px ${shadowColor}, inset 0 0 30px rgba(255,255,255,0.3)` }}></div>

                  <h4 className={`${titleColor} text-[1.3rem] font-heading font-bold tracking-tight relative z-10`}>{item.title}</h4>
                  <div className={`h-px w-12 ${dividerColor} mt-4 mb-4 ${isEven ? 'md:ml-auto md:mr-0' : 'md:mr-auto md:ml-0'}`} />
                  <p className={`${bodyColor} text-[1.05rem] leading-[1.8] relative z-10`}>{item.body}</p>
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
