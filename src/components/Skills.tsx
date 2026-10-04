import Section from './Section';
import { skills } from '../data/profile';

/** A table, not a card grid. Six identical icon cards would say nothing extra. */
export default function Skills() {
  return (
    <Section id="skills" title="Technical skills">
      <div className="mt-8 flex flex-col gap-4">
        {skills.map((group, i) => (
          <div
            key={group.group}
            className="group/skill relative bg-surface/20 p-6 rounded-xl border border-line-soft hover:border-accent-2/30 hover:shadow-[0_0_30px_rgba(255,122,0,0.05)] transition-all duration-500 grid gap-x-16 gap-y-3 lg:grid-cols-12 overflow-hidden"
            data-reveal
            style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}
          >
            {/* Blueprint Hover Pattern */}
            <div className="absolute inset-0 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-700 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] z-0"></div>

            <dt className="lg:col-span-3 relative z-10 flex items-start gap-3 pt-1">
              <span className="text-accent-2 font-mono text-[0.8rem] opacity-70 mt-0.5">&gt;_</span>
              <span className="text-ink text-[1.05rem] font-medium tracking-tight uppercase text-sm tracking-widest">{group.group}</span>
            </dt>
            <dd className="lg:col-span-9 relative z-10">
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="tag hover:border-accent-2/50 hover:text-accent-2 transition-colors cursor-default bg-surface/50 backdrop-blur-sm">
                    {item}
                  </span>
                ))}
              </div>
            </dd>
          </div>
        ))}
      </div>
    </Section>
  );
}
