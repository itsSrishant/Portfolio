import { Link } from 'react-router-dom';
import { GitHubIcon, LinkedInIcon } from './Icons';
import { profile, linksReady } from '../data/profile';

export default function Footer() {
  return (
    <footer role="contentinfo" className="border-line-soft border-t py-10">
      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Identity + contact */}
          <div className="flex flex-col gap-1.5">
            <p className="text-ink text-[0.875rem] font-medium">{profile.name}</p>
            <a
              href={`mailto:${profile.email}`}
              className="text-ink-3 hover:text-ink text-[0.8125rem] transition-colors duration-200"
            >
              {profile.email}
            </a>
            <p className="text-ink-3 text-[0.8125rem]">{profile.location}</p>
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-3">
            <p className="text-ink-3 text-[0.75rem] font-medium tracking-[0.08em] uppercase">Connect</p>
            <div className="flex items-center gap-2">
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
            </div>
            {linksReady.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink-3 hover:text-ink text-[0.8125rem] transition-colors duration-200"
                aria-label="GitHub profile"
              >
                github.com/itsSrishant
              </a>
            )}
            {linksReady.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink-3 hover:text-ink text-[0.8125rem] transition-colors duration-200"
                aria-label="LinkedIn profile"
              >
                linkedin.com/in/srishantkulkarni
              </a>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-line-soft mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <p className="text-ink-3 text-[0.8125rem]">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-ink-3 text-[0.8125rem]">
              This site does not collect personal data or use tracking cookies.
            </p>
            <Link
              to="/privacy"
              className="text-ink-3 hover:text-ink text-[0.8125rem] transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

