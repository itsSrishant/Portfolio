import { useNavigate } from 'react-router-dom';
import Section from './Section';
import { ArrowIcon } from './Icons';
import { projects } from '../data/profile';

/**
 * Redesigned Projects Section:
 * Replaced the brutalist grid with expansive, highly detailed horizontal cards.
 * Each project now owns its own bespoke theme (Silver for Voice AI, Cyberpunk Orange for SEOOptimiz).
 * Copy is heavily reduced to punchy one-liners to focus on actual content.
 */
export default function Projects() {
  const navigate = useNavigate();

  const handleProjectClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    navigate(`/work/${slug}`);
  };

  return (
    <Section id="projects" title="Featured work">
      <div className="flex flex-col gap-10">
        {projects.map((project, i) => {
          const isVoice = project.slug === 'voice-ai-platform';
          
          return (
            <a
              key={project.slug}
              href={`/work/${project.slug}`}
              onClick={(e) => handleProjectClick(e, project.slug)}
              className="group/project relative w-full flex flex-col md:flex-row gap-8 rounded-3xl border border-line-soft bg-surface/20 p-6 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:border-[var(--card-accent)] hover:shadow-[0_20px_60px_-15px_var(--card-shadow)] overflow-hidden z-10 hover:z-20"
              style={{ 
                '--reveal-delay': `${i * 100}ms`,
                '--card-accent': isVoice ? 'oklch(0.95 0 0)' : 'oklch(0.70 0.20 45)',
                '--card-shadow': isVoice ? 'rgba(255,255,255,0.05)' : 'rgba(255,122,0,0.1)'
              } as React.CSSProperties}
            >
              {/* Background Ambient Glow */}
              <div className="absolute inset-0 opacity-0 group-hover/project:opacity-20 transition-opacity duration-700 pointer-events-none" 
                   style={{ background: `radial-gradient(circle at 80% 50%, var(--card-accent), transparent 60%)` }} />
                   
              {/* Project Visual Area */}
              <div className="relative w-full md:w-5/12 aspect-[16/10] rounded-2xl border border-line-soft bg-bg-deep overflow-hidden flex items-center justify-center">
                 {isVoice ? (
                   // Silver/White Audio Waveform mockup
                   <div className="flex gap-1.5 items-center opacity-70 group-hover/project:scale-110 transition-transform duration-700">
                     {Array.from({length: 16}).map((_, j) => (
                       <div key={j} className="w-1.5 rounded-full bg-[var(--card-accent)]" style={{ height: `${20 + Math.random()*60}%`, animation: `pulse 1.5s infinite ${j*0.1}s alternate` }} />
                     ))}
                   </div>
                 ) : (
                   // Cyberpunk Analytics mockup
                   <div className="flex flex-col gap-4 w-full h-full p-8 opacity-70 group-hover/project:scale-110 transition-transform duration-700">
                     <div className="w-full h-24 border border-[var(--card-accent)]/30 rounded-lg bg-[linear-gradient(45deg,rgba(255,122,0,0.03)_25%,transparent_25%,transparent_50%,rgba(255,122,0,0.03)_50%,rgba(255,122,0,0.03)_75%,transparent_75%,transparent)] bg-[length:12px_12px]" />
                     <div className="grid grid-cols-2 gap-4">
                       <div className="h-16 rounded-lg border border-[var(--card-accent)]/20 bg-surface/50 relative overflow-hidden">
                         <div className="absolute bottom-0 left-0 h-1/2 w-3/4 bg-[var(--card-accent)]/20" />
                       </div>
                       <div className="h-16 rounded-lg border border-[var(--card-accent)]/20 bg-surface/50 relative overflow-hidden">
                         <div className="absolute bottom-0 left-0 h-3/4 w-1/2 bg-[var(--card-accent)]/20" />
                       </div>
                     </div>
                   </div>
                 )}
                 {/* Subtle vignette over the visual */}
                 <div className="absolute inset-0 shadow-[inset_0_0_40px_var(--color-bg-deep)]" />
              </div>

              {/* Project Content Area */}
              <div className="flex flex-col flex-1 justify-center relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--card-accent)', boxShadow: '0 0 10px var(--card-accent)' }} aria-hidden />
                  <span className="mono text-[0.65rem] text-ink-3 tracking-[0.2em] uppercase">{project.context}</span>
                </div>
                
                <h3 className="text-ink text-3xl font-heading font-semibold tracking-tight mb-4 group-hover/project:text-[var(--card-accent)] transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-ink-2 text-base leading-relaxed mb-8 max-w-xl">
                  {isVoice 
                    ? "A low-latency, deterministic voice assistant grounded entirely in client documents via RAG. Real-time speech processing with zero 'AI hallucinations'."
                    : "A high-performance analysis engine evaluating 60+ deterministic signals across SEO, accessibility, and trust without relying on LLM guesswork."}
                </p>

                <div className="flex flex-wrap gap-2 mb-10">
                  {project.stack.slice(0, 5).map((tech) => (
                    <span key={tech} className="mono text-[0.7rem] px-3 py-1 rounded border border-line-soft bg-surface/30 text-ink-2">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-2 text-[var(--card-accent)] text-sm font-medium tracking-wide">
                  View case study
                  <ArrowIcon className="transition-transform duration-300 group-hover/project:translate-x-2" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </Section>
  );
}
