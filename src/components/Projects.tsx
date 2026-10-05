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
              className="group/project relative w-full flex flex-col md:flex-row gap-8 rounded-3xl border border-[var(--card-accent)] bg-surface/20 p-6 md:p-10 transition-all duration-500 hover:-translate-y-2 shadow-[0_10px_40px_-10px_var(--card-shadow)] hover:shadow-[0_20px_80px_-5px_var(--card-shadow)] overflow-hidden z-10 hover:z-20"
              style={{ 
                '--reveal-delay': `${i * 100}ms`,
                '--card-accent': isVoice ? 'oklch(0.95 0 0)' : 'oklch(0.70 0.20 45)',
                '--card-shadow': isVoice ? 'rgba(255,255,255,0.2)' : 'rgba(255,122,0,0.3)'
              } as React.CSSProperties}
            >
              {/* Background Ambient Glow */}
              <div className="absolute inset-0 opacity-[0.15] group-hover/project:opacity-[0.4] transition-opacity duration-700 pointer-events-none" 
                   style={{ background: `radial-gradient(circle at 80% 50%, var(--card-accent), transparent 70%)` }} />
                   
              {/* Extra intense hover glow from top left */}
              <div className="absolute inset-0 opacity-0 group-hover/project:opacity-[0.15] transition-opacity duration-700 pointer-events-none mix-blend-screen" 
                   style={{ background: `radial-gradient(circle at 0% 0%, var(--card-accent), transparent 50%)` }} />
                   
              {/* Project Visual Area */}
              <div className="relative w-full md:w-5/12 aspect-[16/10] rounded-2xl border border-line-soft bg-bg-deep overflow-hidden flex items-center justify-center">
                 {isVoice ? (
                   <img src="/images/ai-voice.png" alt="AI Voice Assistant Interface" className="w-full h-full object-cover opacity-80 group-hover/project:scale-105 group-hover/project:opacity-100 transition-all duration-700 ease-out" />
                 ) : (
                   <img src="/images/seo-optimiz.png" alt="SEOOptimiz Dashboard" className="w-full h-full object-cover object-top opacity-100 group-hover/project:scale-105 transition-all duration-700 ease-out" />
                 )}
                 {/* Subtle vignette over the visual */}
                 <div className={`absolute inset-0 pointer-events-none ${isVoice ? 'shadow-[inset_0_0_40px_var(--color-bg-deep)]' : 'shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]'}`} />
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
