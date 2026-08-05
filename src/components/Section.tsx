import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  /** Optional right-hand note. Used only where it carries real information. */
  meta?: string;
  children: ReactNode;
  className?: string;
  /** Ambient purple wash blooming from the top of the section. On by default. */
  glow?: boolean;
}

/**
 * Shared section chrome: a hairline, then the title.
 *
 * Deliberately no small tracked eyebrow above each heading — repeated on every
 * section that is scaffolding, not voice. The rule carries the separation and
 * the heading does the talking.
 */
export default function Section({ id, title, meta, children, className = '', glow = true }: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-20 sm:py-24 lg:py-32 ${className}`}
      style={
        glow
          ? {
              background:
                'radial-gradient(60% 50% at 50% 0%, color-mix(in oklch, var(--accent) 15%, transparent) 0%, transparent 70%)',
            }
          : undefined
      }
    >
      <div className="shell">
        <header className="mb-10 lg:mb-14" data-reveal>
          <div className="rule mb-7" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h2
              className="font-semibold tracking-[-0.028em]"
              style={{ fontSize: 'clamp(1.75rem, 3.4vw, 2.6rem)' }}
            >
              {title}
            </h2>
            {meta && <span className="mono">{meta}</span>}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}
