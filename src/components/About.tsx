import Section from './Section';
import { about, profile } from '../data/profile';

export default function About() {
  const { education } = profile;

  return (
    <Section id="about" title="About">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7" data-reveal>
          {about.paragraphs.map((text, i) => (
            <p key={i} className={`text-ink-2 prose-col leading-[1.75] ${i > 0 ? 'mt-6' : ''}`}>
              {text}
            </p>
          ))}
        </div>

        <aside
          className="lg:col-span-5 lg:pt-2"
          data-reveal
          style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
        >
          <dl className="text-[0.95rem]">
            <div className="border-line-soft border-t py-4">
              <dt className="mono mb-1.5">Education</dt>
              <dd>
                <p className="text-ink font-medium">{education.degree}</p>
                <p className="text-ink-2 mt-0.5">{education.institution}</p>
                <p className="text-ink-3 mt-1.5 text-[0.875rem]">
                  <strong className="text-ink font-semibold">{education.detail}</strong> ·{' '}
                  {education.period}
                </p>
              </dd>
            </div>
            <div className="border-line-soft border-t py-4">
              <dt className="mono mb-1.5">Based in</dt>
              <dd className="text-ink-2">{profile.location}</dd>
            </div>
            <div className="border-line-soft border-t border-b py-4">
              <dt className="mono mb-1.5">Focus</dt>
              <dd className="text-ink font-semibold">
                AI Engineering · LLM Applications · RAG · Backend Engineering · Full-Stack Development
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </Section>
  );
}
