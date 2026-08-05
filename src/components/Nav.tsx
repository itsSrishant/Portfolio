import { useEffect, useState } from 'react';
import { GitHubIcon, LinkedInIcon } from './Icons';
import { navItems, profile, linksReady } from '../data/profile';

/**
 * Fully hidden through the cinematic intro — not just transparent — so it
 * never competes with the character sequence. It fades in only once
 * CinematicIntro (Hero.tsx) has flagged the hero content as revealed, via
 * the data-hero-revealed attribute it sets on <html>.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setScrolled(document.documentElement.dataset.heroRevealed === 'true');
    sync();
    // A scroll listener alone isn't enough any more: CinematicIntro now
    // flips data-hero-revealed at the end of a *locked* autoplay, a moment
    // when no scroll event fires at all (scroll was disabled the whole
    // time it was playing). The MutationObserver catches that attribute
    // change directly; the scroll listener stays as a harmless backstop.
    window.addEventListener('scroll', sync, { passive: true });
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-hero-revealed'] });
    return () => {
      window.removeEventListener('scroll', sync);
      observer.disconnect();
    };
  }, []);

  // A menu that stays open behind a navigation is a trap; close it on escape
  // and lock the page behind it while it is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <a
        href="#about"
        className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-40"
      >
        Skip to content
      </a>

      <header
        className="fixed inset-x-0 top-0 transition-[opacity,background-color,border-color,backdrop-filter] duration-500"
        style={{
          zIndex: 'var(--z-nav)',
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? 'auto' : 'none',
          backgroundColor: scrolled ? 'color-mix(in oklch, var(--color-bg) 72%, transparent)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--color-line-soft)' : 'transparent'}`,
        }}
      >
        <nav className="shell flex h-[68px] items-center justify-between" aria-label="Primary">
          <a
            href="#top"
            className="group inline-flex items-baseline gap-2.5"
            aria-label={`${profile.name} — back to top`}
          >
            <span className="text-[1.05rem] font-bold tracking-[-0.02em]">{profile.initials}</span>
            <span className="text-ink-3 hidden text-[0.9rem] sm:inline">{profile.name}</span>
          </a>

          <div className="flex items-center gap-1">
            <ul className="mr-3 hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-ink-2 hover:text-ink hover:bg-surface inline-flex h-9 items-center rounded-[7px] px-3 text-[0.9rem] transition-colors duration-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden items-center gap-0.5 sm:flex">
              {linksReady.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="icon-link"
                  aria-label="GitHub"
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
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              )}
              <a href="#contact" className="btn btn-ghost ml-2 h-9!">
                Contact me
              </a>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="icon-link md:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden className="h-[18px] w-[18px]">
                <path d="M3.5 7.5h17M3.5 16.5h17" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu ------------------------------------------------ */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="bg-bg fixed inset-0 md:hidden"
        style={{ zIndex: 'var(--z-overlay)' }}
      >
        <div className="shell flex h-[68px] items-center justify-between">
          <span className="text-[1.05rem] font-bold tracking-[-0.02em]">{profile.initials}</span>
          <button type="button" onClick={() => setOpen(false)} className="icon-link" aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden className="h-[18px] w-[18px]">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="shell mt-6" aria-label="Mobile">
          <ul>
            {navItems.map((item) => (
              <li key={item.href} className="border-line-soft border-b">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-5 text-[1.75rem] font-medium tracking-[-0.02em]"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="border-line-soft border-b">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block py-5 text-[1.75rem] font-medium tracking-[-0.02em]"
              >
                Contact
              </a>
            </li>
          </ul>

          <div className="mt-8 flex items-center gap-1">
            {linksReady.github && (
              <a href={profile.github} target="_blank" rel="noreferrer noopener" className="icon-link" aria-label="GitHub">
                <GitHubIcon />
              </a>
            )}
            {linksReady.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer noopener" className="icon-link" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
