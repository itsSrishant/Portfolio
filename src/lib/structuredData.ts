import { profile, linksReady, type Project } from '../data/profile';
import { SITE_URL } from './site';

/** profile.ts's `as const` typing makes each nullable field's non-null
 *  branch a specific string literal, not `string` — narrower than what a
 *  `(v): v is string` predicate can assert. Generic over T instead, so it
 *  narrows correctly at each call site regardless of the literal type. */
function isPresent<T>(value: T | null): value is T {
  return value !== null;
}

/**
 * Person schema, site-wide. Built only from fields that already exist in
 * data/profile.ts — nothing invented here, matching that file's own
 * stated rule ("nothing here is invented"). `sameAs` only includes
 * github/linkedin once `linksReady` confirms they're real, filled-in
 * URLs, not the still-placeholder values profile.ts ships with until
 * they're set.
 */
export function personJsonLd(): Record<string, unknown> {
  const sameAs = [
    linksReady.github ? profile.github : null,
    linksReady.linkedin ? profile.linkedin : null,
  ].filter(isPresent);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: SITE_URL,
    jobTitle: profile.roles.join(' / '),
    email: profile.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.location,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/**
 * One CreativeWork block per project case-study page. CreativeWork, not
 * SoftwareApplication — one of these two projects has no public URL and
 * no installable form, so claiming "software application" schema for
 * both would overstate what's actually there. `sameAs` (not
 * `codeRepository`, which schema.org only defines on SoftwareSourceCode,
 * not CreativeWork, and not `discussionUrl`, which specifically means a
 * comments page — wrong for a live demo) is the correct, valid property
 * for "other real URLs that represent this same work elsewhere," and is
 * only included when the project actually has a repo/demo — both are
 * `null` for the internal PlatinumOne project.
 */
export function projectJsonLd(project: Project, pageUrl: string): Record<string, unknown> {
  const sameAs = [project.demo, project.repo].filter(isPresent);

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.lede,
    url: pageUrl,
    creator: {
      '@type': 'Person',
      name: profile.name,
      url: SITE_URL,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}
