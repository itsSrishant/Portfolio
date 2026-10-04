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
          <div ref={textRef} className="lg:col-span-7 flex flex-col gap-8">
            <div className="text-ink-2 prose-col leading-[1.8] text-[1.05rem]">
              <p dangerouslySetInnerHTML={{ __html: about.paragraphs[0] }} />
            </div>

            {/* Massive Blockquote Layout for the 2nd paragraph */}
            <div className="relative my-4 rounded-3xl bg-surface/20 border border-line-soft p-8 sm:p-10 shadow-[inset_0_4px_20px_rgba(255,255,255,0.02)] transition-all duration-500 hover:border-accent hover:shadow-[0_20px_50px_-15px_var(--color-accent)] group/quote">
              <span className="absolute -top-6 -left-2 text-[6rem] text-accent/20 font-heading leading-none pointer-events-none select-none transition-transform duration-500 group-hover/quote:-translate-y-2 group-hover/quote:text-accent/40">"</span>
              <p className="relative z-10 text-[1.4rem] sm:text-[1.7rem] font-heading font-semibold text-ink leading-[1.4] tracking-tight">
                {about.paragraphs[1]}
              </p>
            </div>

            <div className="text-ink-2 prose-col leading-[1.8] text-[1.05rem]">
              <p dangerouslySetInnerHTML={{ 
                __html: about.paragraphs[2]
                  .replace(/AI Voice Bot/g, '<span class="text-accent-2 font-bold group-hover:text-accent transition-colors">AI Voice Bot</span>')
                  .replace(/RAG/g, '<span class="text-accent-2 font-bold group-hover:text-accent transition-colors">RAG</span>')
                  .replace(/LLMs/g, '<span class="text-accent-2 font-bold group-hover:text-accent transition-colors">LLMs</span>') 
              }} />
            </div>
          </div>

          <aside ref={asideRef} className="lg:col-span-5 lg:pt-2">
            <dl className="text-[0.95rem] grid gap-5">
              
              {/* Solid White / Silver Box */}
              <div className="group/card relative bg-ink text-bg-deep p-6 sm:p-7 rounded-[20px] shadow-sm overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)]">
                <dt className="mono mb-2 text-bg-deep/70 text-[0.7rem] uppercase tracking-widest font-bold">Education</dt>
                <dd className="relative z-10">
                  <p className="font-heading text-xl font-bold tracking-tight mb-1">{education.degree}</p>
                  <p className="font-medium opacity-90">{education.institution}</p>
                  <div className="mt-4 pt-4 border-t border-bg-deep/10 text-[0.85rem] font-medium opacity-80 flex justify-between">
                    <span>{education.detail}</span>
                    <span>{education.period}</span>
                  </div>
                </dd>
              </div>
              
              {/* Solid Purple Box */}
              <div className="group/card relative bg-[var(--accent)] text-white p-6 sm:p-7 rounded-[20px] shadow-[0_10px_30px_-10px_var(--color-accent)] overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_50px_-15px_var(--color-accent)]">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite_linear] opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none"></div>
                <dt className="mono mb-2 text-white/70 text-[0.7rem] uppercase tracking-widest font-bold">Based in</dt>
                <dd className="font-heading text-2xl font-bold tracking-tight relative z-10">{profile.location}</dd>
              </div>

              {/* Solid Orange Box */}
              <div className="group/card relative bg-[var(--accent-2)] text-bg-deep p-6 sm:p-7 rounded-[20px] shadow-[0_10px_30px_-10px_var(--color-accent-2)] overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_50px_-15px_var(--color-accent-2)]">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite_linear] opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none"></div>
                <dt className="mono mb-3 text-bg-deep/70 text-[0.7rem] uppercase tracking-widest font-bold">Focus</dt>
                <dd className="font-semibold relative z-10 leading-relaxed text-[0.95rem]">
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
