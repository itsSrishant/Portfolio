import { Link } from 'react-router-dom';
import Section from './Section';
import { ArrowIcon } from './Icons';
import { projects } from '../data/profile';

/**
 * Compact teaser cards, not the full case study — the deep-dive content
 * (architecture diagram, engineering challenges, tech breakdown) lives at
 * its own /work/:slug route now. Two projects side by side here, each a
 * couple of paragraphs and a stack preview, keeps the homepage scroll from
 * growing every time a project is added; the actual depth is one click
 * away rather than inline.
 */
export default function Projects() {
  return (
    <Section id="projects" title="Featured work">
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            to={`/work/${project.slug}`}
            className="group border-line-soft hover:border-accent/50 hover:bg-surface flex flex-col rounded-2xl border p-7 transition-colors duration-300 sm:p-8"
            data-reveal
            style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
          >
            <div className="flex items-center gap-2.5">
              <span className="live-dot" aria-hidden />
              <span className="text-ink-3 text-[0.8125rem]">{project.status}</span>
            </div>

            <h3 className="text-ink mt-4 text-[1.4rem] font-semibold tracking-[-0.02em]">{project.title}</h3>
            <span className="mono mt-2">{project.context}</span>
            <p className="text-ink-2 prose-col mt-4 text-[0.9375rem] leading-[1.65]">{project.lede}</p>

            <div className="mt-6 flex flex-1 items-end">
              <div className="flex flex-wrap gap-2">
                {project.stack.slice(0, 5).map((tech) => (
                  <span key={tech} className="tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <span className="text-accent-2 border-line-soft mt-6 inline-flex items-center gap-2 border-t pt-5 text-[0.9rem] font-medium">
              View case study
              <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
