import { GitHubIcon, LinkedInIcon, ArrowIcon, DocumentIcon } from './Icons';
import { profile, linksReady } from '../data/profile';
import { useEffect, useRef } from 'react';
import { useExploration } from '../contexts/ExplorationContext';

/** Oversized type, almost no chrome. The address is the interface. */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { unlockMilestone } = useExploration();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          unlockMilestone('system_boot');
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [unlockMilestone]);

  return (
    <section ref={sectionRef} id="contact" className="relative scroll-mt-24 py-10 sm:py-16 lg:py-20 overflow-hidden border-t border-line-soft bg-surface/10">
      {/* Massive ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] max-w-[1200px] max-h-[1200px] bg-[radial-gradient(circle,rgba(255,122,0,0.06)_0%,rgba(155,48,255,0.04)_40%,transparent_70%)] pointer-events-none z-0"></div>

      <div className="shell relative z-10">
        <div className="rule mb-12 bg-gradient-to-r from-accent to-accent-2 opacity-50" />

        <div data-reveal>
          <h2
            className="group/headline relative inline-block font-semibold tracking-[-0.03em] cursor-default"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 4.25rem)', lineHeight: 1.02 }}
          >
            <span className="block transition-all duration-500 group-hover/headline:text-transparent group-hover/headline:bg-clip-text group-hover/headline:bg-gradient-to-r group-hover/headline:from-[#ff7a00] group-hover/headline:to-[#cc0000]">
              Open to internships
              <br />
              <span className="text-ink-3 transition-colors duration-500 group-hover/headline:text-transparent">and interesting problems.</span>
            </span>
            <span className="absolute -bottom-2 left-0 w-0 h-[4px] bg-gradient-to-r from-[#ff7a00] to-[#cc0000] group-hover/headline:w-full transition-all duration-500 ease-out rounded-full pointer-events-none"></span>
          </h2>

          <p className="text-ink-2 prose-col mt-7 text-[1.05rem] leading-[1.75]">
            If you are building something with AI, voice, or a backend that has to hold up under
            real use — I would like to hear about it. The fastest way to reach me is email.
          </p>
        </div>

        <div
          className="mt-12"
          data-reveal
          style={{ '--reveal-delay': '100ms' } as React.CSSProperties}
        >
          <a
            href={`mailto:${profile.email}`}
            className="group/email inline-flex items-baseline gap-4 font-medium tracking-[-0.02em] text-ink hover:text-accent-2 transition-colors"
            style={{ fontSize: 'clamp(1.25rem, 3.4vw, 2.5rem)' }}
          >
            <span className="relative">
              {profile.email}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-accent-2 group-hover/email:w-full transition-all duration-500 ease-out"></span>
            </span>
            <ArrowIcon className="h-6 w-6 shrink-0 self-center text-accent-2 group-hover/email:translate-x-2 group-hover/email:-translate-y-2 transition-transform duration-500" />
          </a>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener" className="btn bg-surface border border-accent-2/50 text-accent-2 hover:bg-accent-2 hover:text-bg transition-colors shadow-[0_0_20px_rgba(255,122,0,0.1)] rounded-full px-6 py-3" id="cta-resume">
              <DocumentIcon />
              Resume
            </a>
            {linksReady.github && (
              <a href={profile.github} target="_blank" rel="noreferrer noopener" className="btn btn-ghost" onClick={() => unlockMilestone('source_code')}>
                <GitHubIcon />
                GitHub
              </a>
            )}
            {linksReady.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
                <LinkedInIcon />
                LinkedIn
              </a>
            )}
          </div>
        </div>

        <div
          className="border-line-soft mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t pt-8"
          data-reveal
        >
          <span className="text-ink-3 text-[0.95rem]">{profile.location}</span>
        </div>
      </div>
    </section>
  );
}
