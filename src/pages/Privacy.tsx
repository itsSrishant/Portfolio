import { Link } from 'react-router-dom';
import { profile } from '../data/profile';

/**
 * Minimal, honest privacy policy.
 *
 * The site genuinely collects no personal data and uses no tracking
 * cookies. This page formalises that fact for visitors and for auditors
 * that check for a privacy link.
 */
export default function Privacy() {
  const year = new Date().getFullYear();

  return (
    <article className="shell py-24 sm:py-32" aria-labelledby="privacy-heading">
      <div className="prose-col">
        <Link
          to="/"
          className="text-ink-3 hover:text-ink mb-10 inline-flex items-center gap-2 text-[0.9rem] transition-colors duration-200"
        >
          ← Back to portfolio
        </Link>

        <h1
          id="privacy-heading"
          className="mt-6 font-bold tracking-[-0.03em]"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.05 }}
        >
          Privacy Policy
        </h1>

        <p className="mono mt-3">Last updated: September 2026</p>

        <div className="border-line-soft mt-12 space-y-10">
          <section aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="mb-4 text-[1.2rem] font-semibold tracking-[-0.02em]">
              The short version
            </h2>
            <p className="text-ink-2 leading-[1.75]">
              This website does not collect, store, or share your personal data. There are no
              tracking cookies, no analytics scripts, and no third-party advertising. If you send
              an email to the address listed on this site, that email is received and read — that
              is the extent of data handling here.
            </p>
          </section>

          <section aria-labelledby="data-heading">
            <h2 id="data-heading" className="mb-4 text-[1.2rem] font-semibold tracking-[-0.02em]">
              Data collected
            </h2>
            <p className="text-ink-2 leading-[1.75]">
              <strong className="text-ink">None.</strong> This site does not use cookies, local
              storage for tracking, session recording, heat-mapping, or any third-party analytics
              service. The Google Fonts stylesheet is loaded from Google's CDN, which means Google's
              standard web server logs may record your IP address and the font resource requested —
              this is governed by{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer noopener"
                className="link-u"
              >
                Google's Privacy Policy
              </a>
              , not this site.
            </p>
          </section>

          <section aria-labelledby="hosting-heading">
            <h2 id="hosting-heading" className="mb-4 text-[1.2rem] font-semibold tracking-[-0.02em]">
              Hosting
            </h2>
            <p className="text-ink-2 leading-[1.75]">
              This site is hosted on{' '}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noreferrer noopener"
                className="link-u"
              >
                Vercel
              </a>
              . Vercel may collect standard server access logs (IP address, browser user-agent,
              pages visited) as part of their infrastructure operation. See Vercel's Privacy Policy
              for details.
            </p>
          </section>

          <section aria-labelledby="contact-priv-heading">
            <h2 id="contact-priv-heading" className="mb-4 text-[1.2rem] font-semibold tracking-[-0.02em]">
              Contact
            </h2>
            <p className="text-ink-2 leading-[1.75]">
              Questions about this policy can be directed to{' '}
              <a href={`mailto:${profile.email}`} className="link-u">
                {profile.email}
              </a>
              .
            </p>
          </section>
        </div>

        <p className="text-ink-3 mt-16 text-[0.8125rem]">
          &copy; {year} {profile.name}
        </p>
      </div>
    </article>
  );
}
