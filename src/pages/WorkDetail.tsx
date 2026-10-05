import type { ComponentType } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import HashLink from '../components/HashLink';
import CaseStudy from '../components/CaseStudy';
import SEOOptimizCaseStudy from '../components/SEOOptimizCaseStudy';
import { GitHubIcon, ArrowIcon } from '../components/Icons';
import { projects, type Project } from '../data/profile';
import { useReveal } from '../hooks/useReveal';
import StarsBackground from '../components/StarsBackground';

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
  const themeColor = project.slug === 'voice-ai-platform' ? 'oklch(0.95 0 0)' : 'oklch(0.70 0.20 45)';

  return (
    <article className="pt-32 pb-20 lg:pt-40 relative z-10" style={{ '--theme-color': themeColor } as React.CSSProperties}>
      
      {/* 1. Starry Space Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.3] mix-blend-screen z-[-2]">
        <StarsBackground />
      </div>

      {/* 2. Intense Fiery Ambient Glow behind the title */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none mix-blend-screen opacity-[0.25] animate-pulse z-[-1]"
        style={{ background: `radial-gradient(circle at 50% 20%, var(--theme-color), transparent 60%)` }}
      />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[800px] h-[400px] pointer-events-none mix-blend-screen opacity-[0.4] z-[-1]"
        style={{ background: `radial-gradient(ellipse at 50% 10%, var(--theme-color), transparent 70%)` }}
      />

      <div className="shell relative z-10">
        <HashLink hash="#projects" className="link-u text-ink-2 inline-flex items-center gap-2 text-[0.9rem]">
          <ArrowIcon className="rotate-180" />
          Back to work
        </HashLink>

        <div className="mt-8 group" data-reveal>
          <h1
            className="font-semibold tracking-[-0.028em] text-white transition-all duration-700 md:hover:-translate-y-2"
            style={{ 
              fontSize: 'clamp(2rem, 4.4vw, 3.25rem)',
              textShadow: '0 0 40px var(--theme-color), 0 0 80px var(--theme-color)' 
            }}
          >
            {project.title}
          </h1>
          <span className="mono mt-5 block uppercase tracking-widest text-[var(--theme-color)] text-xs shadow-black drop-shadow-md font-bold">{project.context}</span>
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
