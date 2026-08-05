import Section from './Section';
import CaseStudy from './CaseStudy';
import { projects } from '../data/profile';

/**
 * One project, presented as a case study rather than a tile.
 *
 * There is exactly one shipped project to show, so it gets the full width. A
 * three-column grid with two empty slots would advertise the gap.
 */
export default function Projects() {
  return (
    <Section id="projects" title="Featured work">
      {projects.map((project) => (
        <article key={project.title} className="border-line-soft border-t pt-8">
          <div data-reveal>
            <h3
              className="font-semibold tracking-[-0.028em]"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)' }}
            >
              {project.title}
            </h3>
            <span className="mono mt-3 block">{project.context}</span>
            <div className="mt-2 flex items-center gap-2.5">
              <span className="live-dot" aria-hidden />
              <span className="text-ink-3 text-[0.875rem]">{project.status}</span>
            </div>
          </div>

          <CaseStudy project={project} />
        </article>
      ))}
    </Section>
  );
}
