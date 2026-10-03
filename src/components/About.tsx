import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from './Section';
import { about, profile } from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { education } = profile;
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // gsap.context helps clean up animations when the component unmounts
    let ctx = gsap.context(() => {
      const paragraphs = textRef.current?.querySelectorAll('p');
      if (paragraphs && paragraphs.length > 0) {
        gsap.from(paragraphs, {
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
          },
          opacity: 0,
          y: 40,
          filter: 'blur(8px)',
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
        });
      }
      
      const asideItems = asideRef.current?.querySelectorAll('dl > div');
      if (asideItems && asideItems.length > 0) {
        gsap.from(asideItems, {
          scrollTrigger: {
            trigger: asideRef.current,
            start: 'top 85%',
          },
          opacity: 0,
          x: 40,
          filter: 'blur(8px)',
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative overflow-hidden">
      {/* Massive Parallax Watermark */}
      <div className="absolute right-[-5%] top-20 opacity-[0.03] text-[16vw] font-black mono pointer-events-none select-none tracking-tighter z-0">
        &lt;SYS/&gt;
      </div>

      <Section id="about" title="About" className="relative z-10">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <div ref={textRef} className="lg:col-span-7">
            {about.paragraphs.map((text, i) => {
              // Extremely simple keyword highlighting hack for the demo
              const highlightedText = text
                .replace(/AI Voice Bot/g, '<span class="text-accent-2 font-medium hover:text-accent transition-colors cursor-default">AI Voice Bot</span>')
                .replace(/RAG/g, '<span class="text-accent-2 font-medium hover:text-accent transition-colors cursor-default">RAG</span>')
                .replace(/LLMs/g, '<span class="text-accent-2 font-medium hover:text-accent transition-colors cursor-default">LLMs</span>');

              return (
                <p 
                  key={i} 
                  className={`text-ink-2 prose-col leading-[1.75] ${i > 0 ? 'mt-6' : ''}`}
                  dangerouslySetInnerHTML={{ __html: highlightedText }}
                />
              );
            })}
          </div>

          <aside ref={asideRef} className="lg:col-span-5 lg:pt-2">
            <dl className="text-[0.95rem] space-y-4">
              <div className="group/card relative bg-surface/30 p-5 rounded-xl border border-line-soft hover:border-accent-2/50 transition-colors shadow-sm overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,122,0,0.04)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite_linear] opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none"></div>
                <dt className="mono mb-1.5 text-accent-2/80 text-[0.7rem] uppercase tracking-wider">Education</dt>
                <dd className="relative z-10">
                  <p className="text-ink font-medium">{education.degree}</p>
                  <p className="text-ink-2 mt-0.5">{education.institution}</p>
                  <p className="text-ink-3 mt-1.5 text-[0.875rem]">
                    <strong className="text-ink font-semibold">{education.detail}</strong> ·{' '}
                    {education.period}
                  </p>
                </dd>
              </div>
              
              <div className="group/card relative bg-surface/30 p-5 rounded-xl border border-line-soft hover:border-accent-2/50 transition-colors shadow-sm overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,122,0,0.04)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite_linear] opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none"></div>
                <dt className="mono mb-1.5 text-accent-2/80 text-[0.7rem] uppercase tracking-wider">Based in</dt>
                <dd className="text-ink-2 relative z-10">{profile.location}</dd>
              </div>
              
              <div className="group/card relative bg-surface/30 p-5 rounded-xl border border-line-soft hover:border-accent-2/50 transition-colors shadow-sm overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,122,0,0.04)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite_linear] opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none"></div>
                <dt className="mono mb-1.5 text-accent-2/80 text-[0.7rem] uppercase tracking-wider">Focus</dt>
                <dd className="text-ink font-semibold relative z-10 leading-relaxed">
                  AI Engineering · LLM Applications · RAG · Backend Engineering · Full-Stack Development
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>
    </div>
  );
}
