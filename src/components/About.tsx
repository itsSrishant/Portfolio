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
    <div ref={sectionRef}>
      <Section id="about" title="About">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <div ref={textRef} className="lg:col-span-7">
            {about.paragraphs.map((text, i) => (
              <p key={i} className={`text-ink-2 prose-col leading-[1.75] ${i > 0 ? 'mt-6' : ''}`}>
                {text}
              </p>
            ))}
          </div>

          <aside ref={asideRef} className="lg:col-span-5 lg:pt-2">
            <dl className="text-[0.95rem]">
              <div className="border-line-soft border-t py-4">
                <dt className="mono mb-1.5">Education</dt>
                <dd>
                  <p className="text-ink font-medium">{education.degree}</p>
                  <p className="text-ink-2 mt-0.5">{education.institution}</p>
                  <p className="text-ink-3 mt-1.5 text-[0.875rem]">
                    <strong className="text-ink font-semibold">{education.detail}</strong> ·{' '}
                    {education.period}
                  </p>
                </dd>
              </div>
              <div className="border-line-soft border-t py-4">
                <dt className="mono mb-1.5">Based in</dt>
                <dd className="text-ink-2">{profile.location}</dd>
              </div>
              <div className="border-line-soft border-t border-b py-4">
                <dt className="mono mb-1.5">Focus</dt>
                <dd className="text-ink font-semibold">
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
