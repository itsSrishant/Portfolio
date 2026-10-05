import { useNavigate } from 'react-router-dom';
import { useExploration } from '../contexts/ExplorationContext';
import gsap from 'gsap';
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

  const handleProjectClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string, isVoice: boolean) => {
    e.preventDefault();

    const themeColor = isVoice ? '#ffffff' : '#ff7a00';
    const shadowColor = isVoice ? 'rgba(255,255,255,0.8)' : 'rgba(255,122,0,0.8)';

    // The "Screen Tear - Overdrive" Transition
    const overlayContainer = document.createElement('div');
    overlayContainer.style.position = 'fixed';
    overlayContainer.style.inset = '0';
    overlayContainer.style.zIndex = '99999';
    overlayContainer.style.pointerEvents = 'none';
    overlayContainer.style.overflow = 'hidden';

    // Top Door (Heavier, more brutalist)
    const topDoor = document.createElement('div');
    topDoor.style.position = 'absolute';
    topDoor.style.top = '0';
    topDoor.style.left = '-5vw';
    topDoor.style.width = '110vw';
    topDoor.style.height = '50vh';
    topDoor.style.backgroundColor = '#050505';
    topDoor.style.transform = 'translateY(-100%)';
    topDoor.style.borderBottom = `3px solid ${themeColor}`;
    topDoor.style.boxShadow = `0 10px 100px ${shadowColor}`;

    // Bottom Door
    const bottomDoor = document.createElement('div');
    bottomDoor.style.position = 'absolute';
    bottomDoor.style.bottom = '0';
    bottomDoor.style.left = '-5vw';
    bottomDoor.style.width = '110vw';
    bottomDoor.style.height = '50vh';
    bottomDoor.style.backgroundColor = '#050505';
    bottomDoor.style.transform = 'translateY(100%)';
    bottomDoor.style.borderTop = `3px solid ${themeColor}`;
    bottomDoor.style.boxShadow = `0 -10px 100px ${shadowColor}`;

    overlayContainer.appendChild(topDoor);
    overlayContainer.appendChild(bottomDoor);
    document.body.appendChild(overlayContainer);

    // 1. Slam the doors shut
    gsap.to([topDoor, bottomDoor], {
      y: '0%',
      duration: 0.4,
      ease: 'expo.in',
      onComplete: () => {
        // VIOLENT SHAKE ON IMPACT (shake the doors instead of body to prevent fixed position bugs)
        gsap.fromTo([topDoor, bottomDoor],
          { x: -15, y: 5 },
          { x: 0, y: 0, duration: 0.3, ease: 'elastic.out(1, 0.3)' }
        );

        // 2. Navigate while screen is completely black
        navigate(`/work/${slug}`);

        // 3. Flash a massive overloaded laser across the seam
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '50%';
        flash.style.left = '0';
        flash.style.width = '100vw';
        flash.style.height = '4px';
        flash.style.backgroundColor = '#fff';
        flash.style.boxShadow = `0 0 100px 50px ${themeColor}`;
        flash.style.transform = 'translateY(-50%) scaleX(0) scaleY(5)';
        overlayContainer.appendChild(flash);

        // Generate Sparks
        const sparks: HTMLDivElement[] = [];
        for(let i=0; i<30; i++) {
          const spark = document.createElement('div');
          spark.style.position = 'absolute';
          spark.style.top = '50%';
          spark.style.left = `${5 + Math.random() * 90}vw`; // spread across width
          spark.style.width = `${Math.random() * 20 + 10}px`;
          spark.style.height = '2px';
          spark.style.backgroundColor = themeColor;
          spark.style.boxShadow = `0 0 15px 3px ${themeColor}`;
          spark.style.transform = 'translate(-50%, -50%) scaleX(0)';
          overlayContainer.appendChild(spark);
          sparks.push(spark);
        }

        gsap.to(flash, {
          scaleX: 1,
          duration: 0.15,
          ease: 'power4.in',
          onComplete: () => {
            // Laser overload settling
            gsap.to(flash, { scaleY: 1, opacity: 0, duration: 0.4 });

            // Explode sparks outwards
            sparks.forEach(spark => {
              const vy = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 200 + 50);
              const vx = (Math.random() - 0.5) * 100;
              gsap.to(spark, {
                x: `+=${vx}`,
                y: `+=${vy}`,
                scaleX: 1,
                opacity: 0,
                duration: Math.random() * 0.4 + 0.2,
                ease: 'power2.out'
              });
            });

            // 4. Violently tear the doors open with a skew effect
            gsap.to(topDoor, {
              y: '-100%',
              skewY: 2,
              duration: 0.6,
              ease: 'expo.inOut',
              delay: 0.05
            });
            gsap.to(bottomDoor, {
              y: '100%',
              skewY: -2,
              duration: 0.6,
              ease: 'expo.inOut',
              delay: 0.05,
              onComplete: () => overlayContainer.remove()
            });
          }
        });
      }
    });
  };

  const { unlockMilestone } = useExploration();

  return (
    <Section id="projects" title="Featured work">
      <div className="flex flex-col gap-10">
        {projects.map((project, i) => {
          const isVoice = project.slug === 'voice-ai-platform';
          
          return (
            <a
              key={project.slug}
              href={`/work/${project.slug}`}
              onClick={(e) => handleProjectClick(e, project.slug, isVoice)}
              onMouseEnter={() => unlockMilestone('thermal_overload')}
              className="group/project relative w-full flex flex-col md:flex-row gap-8 rounded-3xl border border-[var(--card-accent)] bg-surface/20 p-6 md:p-10 transition-all duration-500 md:hover:-translate-y-2 shadow-[0_10px_40px_-10px_var(--card-shadow)] hover:shadow-[0_20px_80px_-5px_var(--card-shadow)] overflow-hidden z-10 hover:z-20"
              style={{ 
                '--reveal-delay': `${i * 100}ms`,
                '--card-accent': isVoice ? 'oklch(0.95 0 0)' : 'oklch(0.70 0.20 45)',
                '--card-shadow': isVoice ? 'rgba(255,255,255,0.2)' : 'rgba(255,122,0,0.3)'
              } as React.CSSProperties}
            >
              {/* Background Ambient Glow (Intensified) */}
              <div className="absolute inset-0 opacity-[0.25] group-hover/project:opacity-[0.7] transition-opacity duration-700 pointer-events-none mix-blend-screen" 
                   style={{ background: `radial-gradient(circle at 80% 50%, var(--card-accent), transparent 70%)` }} />
                   
              {/* Extra intense hovering fiery glow from top left */}
              <div className="absolute inset-0 opacity-0 group-hover/project:opacity-[0.5] transition-opacity duration-700 pointer-events-none mix-blend-screen animate-pulse" 
                   style={{ background: `radial-gradient(circle at 10% 20%, var(--card-accent), transparent 50%)` }} />
                   
              {/* Project Visual Area */}
              <div className="relative w-full md:w-5/12 aspect-[16/10] rounded-2xl border border-line-soft bg-bg-deep overflow-hidden flex items-center justify-center">
                 {isVoice ? (
                   <img src="/images/ai-voice.png" alt="AI Voice Assistant Interface" className="w-full h-full object-cover opacity-80 md:group-hover/project:scale-105 group-hover/project:opacity-100 transition-all duration-700 ease-out" />
                 ) : (
                   <img src="/images/seo-optimiz.png" alt="SEOOptimiz Dashboard" className="w-full h-full object-cover object-top opacity-100 md:group-hover/project:scale-105 transition-all duration-700 ease-out" />
                 )}
                 {/* Subtle vignette over the visual */}
                 <div className={`absolute inset-0 pointer-events-none ${isVoice ? 'shadow-[inset_0_0_40px_var(--color-bg-deep)]' : 'shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]'}`} />
              </div>

              {/* Project Content Area */}
              <div className="flex flex-col flex-1 justify-center relative z-20 transition-transform duration-500 md:group-hover/project:scale-[1.02] md:group-hover/project:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--card-accent)', boxShadow: '0 0 15px var(--card-accent)' }} aria-hidden />
                  <span className="mono text-[0.65rem] text-ink-3 tracking-[0.2em] uppercase">{project.context}</span>
                </div>
                
                <h3 
                  className="text-ink text-3xl font-heading font-semibold tracking-tight mb-4 group-hover/project:text-[var(--card-accent)] transition-all duration-500"
                  style={{ textShadow: '0 0 0 transparent' }}
                >
                  <span className="md:group-hover/project:drop-shadow-[0_0_25px_var(--card-accent)] transition-all duration-500 inline-block">{project.title}</span>
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

                <div className="mt-auto flex items-center gap-2 text-[var(--card-accent)] text-sm font-medium tracking-wide md:group-hover/project:drop-shadow-[0_0_15px_var(--card-accent)] transition-all duration-500 md:group-hover/project:translate-x-1">
                  View case study
                  <ArrowIcon className="transition-transform duration-300 md:group-hover/project:translate-x-2 drop-shadow-[0_0_10px_var(--card-accent)]" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </Section>
  );
}
