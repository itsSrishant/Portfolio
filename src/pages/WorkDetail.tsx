import type { ComponentType } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import HashLink from '../components/HashLink';
import CaseStudy from '../components/CaseStudy';
import SEOOptimizCaseStudy from '../components/SEOOptimizCaseStudy';
import { GitHubIcon, ArrowIcon } from '../components/Icons';
import { projects, type Project } from '../data/profile';
import { useReveal } from '../hooks/useReveal';

/** Which bespoke case-study component renders for a given project slug. */
const CASE_STUDIES: Record<string, ComponentType<{ project: Project }>> = {
  'voice-ai-platform': CaseStudy,
  seooptimiz: SEOOptimizCaseStudy,
};

/**
 * The deep-dive route for one project — everything Projects.tsx used to
 * render inline now lives here instead, reached from a compact card on
 * the homepage. Splitting it out keeps the homepage scroll from doubling
 * in length every time a project is added, and gives each case study a
 * real, linkable URL.
 */
export default function WorkDetail() {
  useReveal();
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <Navigate to="/" replace />;

  const CaseStudyComponent = CASE_STUDIES[project.slug];

  return (
    <article className="pt-32 pb-20 lg:pt-40">
      <div className="shell">
        <HashLink hash="#projects" className="link-u text-ink-2 inline-flex items-center gap-2 text-[0.9rem]">
          <ArrowIcon className="rotate-180" />
          Back to work
        </HashLink>

        <div className="mt-8" data-reveal>
          <h1
            className="font-semibold tracking-[-0.028em]"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 3.25rem)' }}
          >
            {project.title}
          </h1>
          <span className="mono mt-3 block">{project.context}</span>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="live-dot" aria-hidden />
            <span className="text-ink-3 text-[0.875rem]">{project.status}</span>
          </div>

          {(project.repo || project.demo) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noreferrer noopener" className="btn btn-primary">
                  Live demo
                  <ArrowIcon />
                </a>
              )}
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
                  <GitHubIcon />
                  Source
                </a>
              )}
            </div>
          )}
          {project.privateNote && (
            <p className="text-ink-3 mt-4 text-[0.8125rem] leading-relaxed">{project.privateNote}</p>
          )}
        </div>

        {CaseStudyComponent && <CaseStudyComponent project={project} />}
      </div>
    </article>
  );
}
