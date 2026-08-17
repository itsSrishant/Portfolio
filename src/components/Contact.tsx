import { GitHubIcon, LinkedInIcon, ArrowIcon, DocumentIcon } from './Icons';
import { profile, linksReady } from '../data/profile';

/** Oversized type, almost no chrome. The address is the interface. */
export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-12 sm:py-16 lg:py-20">
      <div className="shell">
        <div className="rule mb-8" />

        <div data-reveal>
          <h2
            className="font-semibold tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 4.25rem)', lineHeight: 1.02 }}
          >
            Open to internships
            <br />
            <span className="text-ink-3">and interesting problems.</span>
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
            className="link-u inline-flex items-baseline gap-3 font-medium tracking-[-0.02em]"
            style={{ fontSize: 'clamp(1.25rem, 3.4vw, 2rem)' }}
          >
            {profile.email}
            <ArrowIcon className="h-5 w-5 shrink-0 self-center" />
          </a>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener" className="btn btn-primary">
              <DocumentIcon />
              Resume
            </a>
            {linksReady.github && (
              <a href={profile.github} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
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
