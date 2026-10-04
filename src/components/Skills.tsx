import Section from './Section';
import { skills } from '../data/profile';

/** A table, not a card grid. Six identical icon cards would say nothing extra. */
export default function Skills() {
  return (
    <Section id="skills" title="Technical skills">
      <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => {
          // Make the first item span 2 columns on desktop to break symmetry
          const isFeatured = i === 0;

          return (
            <div
              key={group.group}
              className={`group/skill relative bg-surface/20 p-8 md:p-10 rounded-[2rem] border border-line-soft hover:border-[var(--accent-2)] transition-all duration-500 overflow-hidden shadow-[inset_0_4px_20px_rgba(255,255,255,0.02)] hover:shadow-[0_20px_60px_-15px_var(--color-accent-2)] backdrop-blur-md ${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}`}
              data-reveal
              style={{ '--reveal-delay': `${i * 100}ms` } as React.CSSProperties}
            >
              {/* Animated Blueprint Background */}
              <div className="absolute inset-0 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-700 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-2)] animate-pulse shadow-[0_0_10px_var(--color-accent-2)]"></span>
                  <h3 className="text-ink text-[1.1rem] font-heading font-bold uppercase tracking-widest">{group.group}</h3>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <span 
                      key={item} 
                      className="relative px-4 py-2 bg-black/40 border border-white/10 rounded-full text-ink-2 font-medium text-[0.95rem] cursor-default transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-[var(--accent-2)] hover:text-bg-deep hover:shadow-[0_10px_30px_-5px_var(--color-accent-2)] hover:scale-105"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
