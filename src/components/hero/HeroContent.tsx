import { forwardRef } from 'react';
import ProfileReveal from '../ProfileReveal';
import { GitHubIcon, LinkedInIcon, MailIcon, ArrowIcon } from '../Icons';
import { profile, linksReady } from '../../data/profile';

/**
 * The hero, in normal document flow the whole time — CinematicIntro's
 * full-screen overlay sits on top of it (not this component hiding itself),
 * so there's nothing here for a no-JS, reduced-motion, or headless render
 * to get stuck behind: this content is always fully present and visible,
 * just physically covered until the overlay above it fades away.
 */
const HeroContent = forwardRef<HTMLDivElement>(function HeroContent(_props, ref) {
  return (
    <section id="top" className="relative flex min-h-svh items-center pt-28 pb-16 lg:pt-32 lg:pb-24">
      <div ref={ref} className="shell relative z-10 w-full">
        <div className="grid items-center gap-x-16 gap-y-10 lg:grid-cols-12">
          <div className="order-1 lg:col-span-7 lg:self-end">
            <p className="text-ink-3 text-[0.95rem]">Hi, I&rsquo;m</p>
            <h1
              className="mt-2 font-bold tracking-[-0.03em]"
              style={{ fontSize: 'clamp(3rem, 9vw, 5.6rem)', lineHeight: 0.94 }}
            >
              <span className="block">{profile.firstName}</span>
              <span className="text-ink-2 block">{profile.lastName}</span>
            </h1>
            <div className="mt-6 flex flex-col gap-y-1.5 sm:flex-row sm:items-center sm:gap-x-3 sm:gap-y-0">
              {profile.roles.map((role, i) => (
                <span key={role} className="flex items-center gap-3">
                  {i > 0 && <span className="bg-line hidden h-3 w-px sm:block" aria-hidden />}
                  <span className="mono">{role}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="order-2 mx-auto w-full max-w-[24rem] lg:col-span-5 lg:row-span-2 lg:mx-0 lg:max-w-none lg:self-center">
            <ProfileReveal />
          </div>

          <div className="order-3 lg:col-span-7 lg:self-start">
            <p className="text-ink-2 prose-col text-[1.0625rem] leading-relaxed sm:text-[1.15rem]">
              {profile.tagline} Currently studying{' '}
              <span className="text-ink">Artificial Intelligence &amp; Data Science</span> at VESIT,
              Mumbai — and turning what I learn into production-ready software.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#projects" className="btn btn-ghost">
                View My Work
                <ArrowIcon />
              </a>
              <a href="#contact" className="btn btn-ghost">
                Get In Touch
              </a>

              <div className="ml-1 flex items-center gap-1">
                {linksReady.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="icon-link"
                    aria-label="Srishant Kulkarni on GitHub"
                  >
                    <GitHubIcon />
                  </a>
                )}
                {linksReady.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="icon-link"
                    aria-label="Srishant Kulkarni on LinkedIn"
                  >
                    <LinkedInIcon />
                  </a>
                )}
                <a
                  href={`mailto:${profile.email}`}
                  className="icon-link"
                  aria-label={`Email Srishant Kulkarni at ${profile.email}`}
                >
                  <MailIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroContent;
