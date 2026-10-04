import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
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
  const navigate = useNavigate();

  const handleProjectClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    
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
    topDoor.style.borderBottom = '3px solid #ff7a00';
    topDoor.style.boxShadow = '0 10px 100px rgba(255,122,0,0.8)';

    // Bottom Door
    const bottomDoor = document.createElement('div');
    bottomDoor.style.position = 'absolute';
    bottomDoor.style.bottom = '0';
    bottomDoor.style.left = '-5vw';
    bottomDoor.style.width = '110vw';
    bottomDoor.style.height = '50vh';
    bottomDoor.style.backgroundColor = '#050505';
    bottomDoor.style.transform = 'translateY(100%)';
    bottomDoor.style.borderTop = '3px solid #ff7a00';
    bottomDoor.style.boxShadow = '0 -10px 100px rgba(255,122,0,0.8)';

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
        flash.style.boxShadow = '0 0 80px 40px #ff7a00';
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
          spark.style.backgroundColor = '#ff7a00';
          spark.style.boxShadow = '0 0 10px 2px #ff7a00';
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

  return (
    <Section id="projects" title="Featured work">
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <a
            key={project.slug}
            href={`/work/${project.slug}`}
            onClick={(e) => handleProjectClick(e, project.slug)}
            className="group/project relative border-line-soft hover:border-accent-2 bg-bg-deep flex flex-col rounded-sm border-2 p-7 transition-all duration-200 sm:p-8 shadow-[8px_8px_0_var(--color-accent-2)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_var(--color-accent-2)] z-10 hover:z-20"
            data-reveal
            style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
          >
            {/* Floating Terminal that rises out on hover */}
            <div className="absolute -right-4 -top-8 opacity-0 group-hover/project:opacity-100 group-hover/project:-translate-y-3 transition-all duration-500 pointer-events-none hidden sm:flex flex-col gap-1 p-2.5 rounded-lg border border-accent-2/40 bg-surface/90 backdrop-blur-xl shadow-2xl shadow-accent-2/20 z-30 w-36">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full bg-danger/80"></div>
                <div className="w-2 h-2 rounded-full bg-accent-2/80"></div>
                <div className="w-2 h-2 rounded-full bg-accent/80"></div>
              </div>
              <p className="mono text-[0.55rem] text-accent-2 font-bold leading-tight">
                &gt; executing {project.slug}.sh<br/>
                &gt; rendering 3D env<br/>
                &gt; sys_status: ONLINE
              </p>
            </div>

            <div className="flex items-center gap-2.5 relative z-10">
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
          </a>
        ))}
      </div>
    </Section>
  );
}
