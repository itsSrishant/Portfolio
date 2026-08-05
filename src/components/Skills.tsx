import Section from './Section';
import { skills } from '../data/profile';

/** A table, not a card grid. Six identical icon cards would say nothing extra. */
export default function Skills() {
  return (
    <Section id="skills" title="Technical skills">
      <dl className="border-line-soft border-t">
        {skills.map((group, i) => (
          <div
            key={group.group}
            className="border-line-soft grid gap-x-16 gap-y-3 border-b py-6 lg:grid-cols-12"
            data-reveal
            style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}
          >
            <dt className="lg:col-span-3">
              <span className="text-ink text-[1.05rem] font-medium">{group.group}</span>
            </dt>
            <dd className="lg:col-span-9">
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
