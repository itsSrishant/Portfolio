import { useState } from 'react';
import ArchitectureDiagram, { type NodeDef, type EdgeDef } from './ArchitectureDiagram';
import ProcessTimeline from './ProcessTimeline';
import Beat from './casestudy/Beat';
import type { Project } from '../data/profile';

/**
 * SEOOptimiz's case study — same shape and quality bar as the Voice AI
 * platform's (Beat, ArchitectureDiagram, ProcessTimeline all shared), but
 * bespoke content, matching the rest of this codebase's convention of one
 * hand-written component per real thing rather than a generic
 * "case study" abstraction driven by a big content blob.
 *
 * Every fact below is verifiable against the SEOOptimiz repository itself
 * (github.com/itsSrishant/SEOOptimiz) — the six pillars and their weights,
 * the deterministic (non-LLM) scoring approach, the shared useInView hook,
 * and the vitest/Playwright test suite are all real, not invented for this
 * page.
 */

const PROBLEMS = [
  {
    title: 'Too much data',
    text: 'Hundreds of metrics and warnings, with no clear way to tell what actually matters.',
  },
  {
    title: 'Too little context',
    text: 'A single score that says how a site performed, but not why.',
  },
  {
    title: 'Scattered insights',
    text: 'SEO, accessibility, security and conversion evaluated by separate tools, with no unified view.',
  },
  {
    title: 'Black-box scoring',
    text: "A score with no visibility into how it was calculated or which signals produced it.",
  },
];

const HOW_IT_WORKS_STEPS = [
  { number: '01', title: 'Enter your website', body: 'Paste any public URL. No account, no setup.' },
  {
    number: '02',
    title: 'SEOOptimiz analyzes 60+ signals',
    body: 'SEO, structure, accessibility, responsiveness, trust, and conversion — measured, not guessed.',
  },
  {
    number: '03',
    title: 'Get your score and prioritized fixes',
    body: 'A clear score, evidence for every issue, and what to fix first.',
  },
];

const CHALLENGES = [
  {
    title: 'Deterministic, not generative, scoring',
    challenge: "An AI-scored audit can't reliably reproduce the same score twice for the same site, or show its work.",
    approach:
      'Every pillar score comes from rule-based signal checks rather than a model judgment — the same URL analyzed twice returns the same result, and each score traces back to the signals behind it.',
    result: 'Consistent, explainable scores instead of a black box.',
  },
  {
    title: 'Signal breadth vs. readability',
    challenge: '60+ signals across six categories risk becoming an overwhelming wall of technical detail.',
    approach:
      'Signals roll up into six weighted pillars and one overall score, so detail is available without being the first thing a reader has to parse.',
    result: 'One score → six pillars → 60+ signals, in that order of visibility.',
  },
  {
    title: 'Scroll-triggered UI, without duplicated logic',
    challenge:
      'Several different moments on the page — count-ups, bar fills, sequential reveals — each need to know when they enter the viewport.',
    approach: 'One shared useInView hook, reused across every scroll-triggered animation instead of each component rolling its own IntersectionObserver.',
    result: 'Less duplicated observer logic, and one place to get the behavior right.',
  },
  {
    title: 'A scoring engine that could regress silently',
    challenge: 'A rule-based engine that quietly drifts is worse than one that is simply incomplete.',
    approach: 'A real test suite — vitest for units, Playwright end to end — backs the analysis engine, rather than manual verification alone.',
    result: "Confidence that a change to one signal doesn't silently break another.",
  },
];

const TECH_GROUPS: Array<{ group: string; note: string; items: Array<{ name: string; node: string | null }> }> = [
  {
    group: 'Frontend',
    note: 'The marketing site and the report UI.',
    items: [
      { name: 'Next.js', node: null },
      { name: 'React', node: null },
      { name: 'TypeScript', node: null },
      { name: 'Tailwind CSS', node: null },
    ],
  },
  {
    group: 'Analysis engine',
    note: 'Fetching, parsing and scoring a site.',
    items: [
      { name: 'cheerio', node: 'parse' },
      { name: 'Deterministic scoring rules', node: 'scoring' },
    ],
  },
  {
    group: 'Motion',
    note: "The site's own scroll-driven interactions.",
    items: [
      { name: 'GSAP', node: null },
      { name: 'Lenis', node: null },
    ],
  },
  {
    group: 'Infrastructure',
    note: 'Deployment.',
    items: [{ name: 'Vercel', node: null }],
  },
];

const NODES: NodeDef[] = [
  { id: 'url', x: 14, y: 118, w: 92, h: 46, label: 'Website URL', sub: 'input' },
  { id: 'fetch', x: 128, y: 118, w: 104, h: 46, label: 'Page fetcher', sub: 'safe fetch' },
  { id: 'parse', x: 254, y: 118, w: 104, h: 46, label: 'HTML parser', sub: 'cheerio' },
  { id: 'scoring', x: 434, y: 110, w: 138, h: 62, label: 'Scoring engine', sub: 'deterministic', accent: true },
  { id: 'overall', x: 606, y: 118, w: 108, h: 46, label: 'Overall score', sub: 'weighted' },
  { id: 'seo-signals', x: 434, y: 18, w: 138, h: 44, label: 'SEO signals', sub: 'titles · headings · sitemap' },
  { id: 'other-signals', x: 434, y: 220, w: 138, h: 46, label: 'Other signals', sub: 'structure · trust · access · UX' },
  { id: 'report', x: 592, y: 220, w: 122, h: 46, label: 'Report', sub: 'PDF export' },
];

const EDGES: EdgeDef[] = [
  { id: 'e-url-fetch', from: 'url', to: 'fetch', d: 'M106 141H124', kind: 'main' },
  { id: 'e-fetch-parse', from: 'fetch', to: 'parse', d: 'M232 141H250', kind: 'main' },
  { id: 'e-parse-scoring', from: 'parse', to: 'scoring', d: 'M358 141H430', kind: 'main' },
  { id: 'e-scoring-overall', from: 'scoring', to: 'overall', d: 'M572 141H602', kind: 'main' },
  { id: 'e-seo-scoring', from: 'seo-signals', to: 'scoring', d: 'M503 62V104', kind: 'accent' },
  { id: 'e-other-scoring', from: 'other-signals', to: 'scoring', d: 'M503 220V178', kind: 'accent' },
  { id: 'e-overall-report', from: 'overall', to: 'report', d: 'M628 164V216', kind: 'dashed' },
];

const ARIA_LABEL =
  'System diagram. A website URL is fetched and parsed. SEO signals and a broader set of other signals — accessibility, structure, trust, responsiveness and conversion — are evaluated in parallel and fed into a deterministic scoring engine, which produces pillar scores and a weighted overall score. The result branches into an exportable report.';

const CAPTION = 'SEO 25 · RESPONSIVENESS 20 · ACCESSIBILITY 15 · STRUCTURE 15 · TRUST 15 · CONVERSION 10';

export default function SEOOptimizCaseStudy({ project }: { project: Project }) {
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  return (
    <div className="mt-10">
      {/* 01 — Overview */}
      <Beat index={1} title="Overview">
        <p className="text-ink prose-col mt-5 text-[1.1rem] leading-[1.7]">{project.lede}</p>
        <p className="text-ink-2 prose-col mt-4 leading-[1.75]">{project.body}</p>
      </Beat>

      {/* 02 — The problem */}
      <Beat index={2} title="The problem">
        <p className="text-ink-2 prose-col mt-5 leading-[1.75]">
          Traditional website audits tend to land at one of two extremes — overwhelming detail with no clear
          priority, or a single score with no explanation behind it.
        </p>
        <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {PROBLEMS.map((p) => (
            <div key={p.title}>
              <h4 className="text-ink text-[1rem] font-medium">{p.title}</h4>
              <p className="text-ink-2 mt-2 text-[0.9375rem] leading-[1.7]">{p.text}</p>
            </div>
          ))}
        </div>
      </Beat>

      {/* 03 — The solution */}
      <Beat index={3} title="The solution">
        <p className="text-ink-2 prose-col mt-5 leading-[1.75]">
          SEOOptimiz connects the overall score to the evidence behind it. Six weighted pillars, each backed by
          concrete deterministic signals, so a website's score is a structured view of strengths and weaknesses —
          not a number with nothing underneath it.
        </p>
      </Beat>

      {/* 04 — How it works / architecture */}
      <Beat index={4} title="How it works">
        <p className="text-ink-2 prose-col mt-5 leading-[1.75]">
          Data collection, signal evaluation and scoring are kept as separate stages, which is what makes it
          possible to add new signals without rewriting the scoring system. A URL is fetched, parsed, and evaluated
          across SEO and five other signal categories in parallel before the weighted score is produced.
        </p>
        <ProcessTimeline steps={HOW_IT_WORKS_STEPS} />
        <div className="border-line-soft bg-bg-deep mt-12 overflow-x-auto rounded-[14px] border p-6 sm:p-8">
          <ArchitectureDiagram
            className="m-0 min-w-155"
            nodes={NODES}
            edges={EDGES}
            ariaLabel={ARIA_LABEL}
            caption={CAPTION}
            externalHighlight={highlightedNode}
          />
        </div>
      </Beat>

      {/* 05 — Engineering challenges */}
      <Beat index={5} title="Engineering challenges">
        <div className="mt-4">
          {CHALLENGES.map((c) => (
            <div key={c.title} className="border-line-soft border-t py-6 first:border-t-0">
              <h4 className="text-ink text-[1rem] font-medium">{c.title}</h4>
              <div className="mt-4 grid gap-5 sm:grid-cols-3">
                <div>
                  <span className="mono mb-1.5 block">Challenge</span>
                  <p className="text-ink-2 text-[0.9rem] leading-[1.7]">{c.challenge}</p>
                </div>
                <div>
                  <span className="mono mb-1.5 block">Approach</span>
                  <p className="text-ink-2 text-[0.9rem] leading-[1.7]">{c.approach}</p>
                </div>
                <div>
                  <span className="mono mb-1.5 block">Result</span>
                  <p className="text-ink-2 text-[0.9rem] leading-[1.7]">{c.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Beat>

      {/* 06 — Technology */}
      <Beat index={6} title="Technology used">
        <p className="text-ink-2 prose-col mt-5 leading-[1.75]">
          Hovering a piece of the stack that maps onto the architecture above lights that node up.
        </p>
        <div className="mt-6 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {TECH_GROUPS.map((g) => (
            <div key={g.group} className="border-line-soft border-t pt-5">
              <h4 className="text-ink text-[0.95rem] font-medium">{g.group}</h4>
              <p className="text-ink-3 mt-1 text-[0.8125rem]">{g.note}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((t) => (
                  <li key={t.name}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlightedNode(t.node)}
                      onMouseLeave={() => setHighlightedNode(null)}
                      onFocus={() => setHighlightedNode(t.node)}
                      onBlur={() => setHighlightedNode(null)}
                      className="tag cursor-pointer transition-all duration-300 ease-out hover:scale-[1.06]"
                      style={
                        t.node && t.node === highlightedNode
                          ? {
                              borderColor: 'var(--accent)',
                              color: 'var(--accent-2)',
                              backgroundColor: 'color-mix(in oklch, var(--accent) 16%, var(--surface))',
                              boxShadow: '0 0 0 1px color-mix(in oklch, var(--accent) 35%, transparent), 0 0 18px 2px color-mix(in oklch, var(--accent) 35%, transparent)',
                            }
                          : undefined
                      }
                    >
                      {t.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Beat>
    </div>
  );
}
