import { forwardRef, useEffect, useRef } from 'react';
import ProfileReveal from '../ProfileReveal';
import { GitHubIcon, LinkedInIcon, MailIcon, ArrowIcon } from '../Icons';
import { profile, linksReady } from '../../data/profile';
import StarsBackground from '../StarsBackground';

/**
 * The hero, in normal document flow the whole time — CinematicIntro's
 * full-screen overlay sits on top of it (not this component hiding itself),
 * so there's nothing here for a no-JS, reduced-motion, or headless render
 * to get stuck behind: this content is always fully present and visible,
 * just physically covered until the overlay above it fades away.
 */
const HeroContent = forwardRef<HTMLDivElement>(function HeroContent(_props, ref) {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        const rect = spotlightRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spotlightRef.current.style.setProperty('--x', `${x}px`);
        spotlightRef.current.style.setProperty('--y', `${y}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="top" className="relative flex min-h-svh items-center pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b-2 border-line-soft">
      {/* 3D Grid Floor */}
      <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-[linear-gradient(rgba(255,122,0,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,122,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(600px)_rotateX(75deg)] z-0 pointer-events-none opacity-50 origin-bottom">
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-bg-deep" />
      </div>

      {/* Interactive X-Ray Spotlight Layer */}
      <div 
        ref={spotlightRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-100 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle 500px at var(--x, 50%) var(--y, 50%), rgba(255, 122, 0, 0.08), transparent 70%)`,
        }}
      >
        <div 
          className="absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            WebkitMaskImage: `radial-gradient(circle 350px at var(--x, 50%) var(--y, 50%), black, transparent)`,
            maskImage: `radial-gradient(circle 350px at var(--x, 50%) var(--y, 50%), black, transparent)`
          }}
        />
      </div>

      <StarsBackground />
      <div ref={ref} className="shell relative z-10 w-full">
        <div className="grid items-center gap-x-16 gap-y-10 lg:grid-cols-12">
          <div className="order-1 lg:col-span-7 lg:self-end">
            <p className="text-ink-3 text-[0.95rem]">Hi, I&rsquo;m</p>
            <h1
              className="mt-2 font-black tracking-[-0.04em]"
              style={{ fontSize: 'clamp(3rem, 9vw, 6.2rem)', lineHeight: 0.92 }}
              aria-label={`${profile.name} — AI & Software Engineer building intelligent systems`}
            >
              <span className="block text-ink" aria-hidden>{profile.firstName}</span>
              <span className="block text-accent-2" aria-hidden>
                {profile.lastName}
              </span>
            </h1>
            <div className="mt-6 flex flex-col gap-y-1.5 sm:flex-row sm:items-center sm:gap-x-3 sm:gap-y-0" aria-label={profile.roles.join(' and ')}>
              {profile.roles.map((role, i) => (
                <span key={role} className="flex items-center gap-3">
                  {i > 0 && <span className="bg-line hidden h-3 w-px sm:block" aria-hidden />}
                  <span className="mono">{role}</span>
                </span>
              ))}
            </div>
          </div>


          <div className="order-2 relative mx-auto w-full max-w-[24rem] lg:col-span-5 lg:row-span-2 lg:mx-0 lg:max-w-none lg:self-center">
            <ProfileReveal />
            
            {/* Floating UI Elements (2.5D Depth) - Colors now mix orange and purple */}
            <div className="absolute -left-12 top-24 hidden lg:flex flex-col gap-1.5 p-3 rounded-xl border border-line-soft/30 backdrop-blur-md bg-surface/40 shadow-2xl animate-[float_6s_ease-in-out_infinite]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-danger/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-accent-2/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-accent/80"></div>
              </div>
              <p className="mono text-[0.65rem] text-ink-3">~ status</p>
              <p className="mono text-xs text-accent-2 font-semibold">BUILDING_SYSTEMS</p>
            </div>

            <div className="absolute -right-8 bottom-16 hidden lg:flex items-center gap-3 p-3 rounded-full border border-line-soft/30 backdrop-blur-md bg-surface/40 shadow-2xl animate-[float_8s_ease-in-out_infinite_reverse]">
               <span className="flex h-3 w-3 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-2 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-2"></span>
               </span>
               <span className="mono text-xs">SYSTEM_ONLINE</span>
            </div>
          </div>

          <div className="order-3 lg:col-span-7 lg:self-start">
            <p className="text-ink-2 prose-col text-[1.0625rem] leading-relaxed sm:text-[1.15rem]">
              {profile.tagline} Currently studying{' '}
              <span className="text-ink">Artificial Intelligence &amp; Data Science</span> at VESIT,
              Mumbai — and turning what I learn into production-ready software.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#projects" className="btn btn-primary" id="cta-view-work">
                View My Work
                <ArrowIcon />
              </a>
              <a href="#contact" className="btn btn-ghost" id="cta-contact">
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

      {/* Cyberpunk CRT Scanlines Overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-25 mix-blend-overlay"></div>
    </section>
  );
});

export default HeroContent;
