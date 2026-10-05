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
    <div 
      className="mt-10"
      style={{
        '--color-line': 'color-mix(in oklch, var(--accent) 30%, #050505)',
        '--color-line-soft': 'color-mix(in oklch, var(--accent) 15%, #050505)'
      } as React.CSSProperties}
    >
      {/* 00 — Bento Grid Gallery */}
      <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px] z-10">
        
        {/* Main Dashboard - Spans 2 cols, 2 rows */}
        <div className="md:col-span-2 md:row-span-2 group relative rounded-sm border-2 border-line-soft bg-bg-deep overflow-hidden transition-all duration-300 hover:border-accent shadow-[4px_4px_0_var(--color-line-soft)] hover:shadow-[8px_8px_0_var(--color-accent)] hover:-translate-y-1 hover:-translate-x-1">
           <img src="/images/seo-optimiz/1.png" alt="SEOOptimiz Dashboard" className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-105" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
           <div className="hidden absolute inset-0 flex flex-col items-center justify-center border border-dashed border-accent/30 bg-[linear-gradient(45deg,rgba(158,59,255,0.03)_25%,transparent_25%,transparent_50%,rgba(158,59,255,0.03)_50%,rgba(158,59,255,0.03)_75%,transparent_75%,transparent)] bg-[length:24px_24px] p-6 text-center">
             <span className="mono text-accent mb-2 text-sm animate-pulse">[ MAIN DASHBOARD ]</span>
             <p className="text-ink-3 text-xs">Add <code className="text-accent bg-surface px-1 py-0.5 rounded">public/images/seo-optimiz/1.png</code></p>
           </div>
           {/* Overlay Gradient */}
           <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"></div>
           <div className="absolute bottom-6 left-6 flex flex-col gap-1 pointer-events-none">
             <span className="mono text-[10px] tracking-[0.1em] text-accent font-medium">01 // OVERVIEW</span>
             <span className="text-ink text-sm font-medium drop-shadow-md">Unified Analysis Dashboard</span>
           </div>
        </div>

        {/* Feature Close-up 1 - 1 col, 1 row */}
        <div className="relative group rounded-sm border-2 border-line-soft bg-bg-deep overflow-hidden transition-all duration-300 hover:border-accent-2 shadow-[4px_4px_0_var(--color-line-soft)] hover:shadow-[8px_8px_0_var(--color-accent-2)] hover:-translate-y-1 hover:-translate-x-1">
           <img src="/images/seo-optimiz/2.png" alt="SEOOptimiz Scoring Dial" className="absolute inset-0 w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
           <div className="hidden absolute inset-0 flex flex-col items-center justify-center border border-dashed border-accent-2/30 bg-[linear-gradient(45deg,rgba(255,122,0,0.03)_25%,transparent_25%,transparent_50%,rgba(255,122,0,0.03)_50%,rgba(255,122,0,0.03)_75%,transparent_75%,transparent)] bg-[length:24px_24px] p-4 text-center">
             <span className="mono text-accent-2 mb-1 text-xs">[ SCORING DIAL ]</span>
             <p className="text-ink-3 text-[10px]">Add <code className="text-accent-2 bg-surface px-1 py-0.5 rounded">public/images/seo-optimiz/2.png</code></p>
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"></div>
           <div className="absolute bottom-4 left-4 flex flex-col gap-0.5 pointer-events-none">
             <span className="mono text-[9px] tracking-[0.1em] text-accent-2 font-medium">02 // PILLARS</span>
             <span className="text-ink text-xs font-medium">Deterministic Scoring</span>
           </div>
        </div>

        {/* Feature Close-up 2 - 1 col, 1 row */}
        <div className="relative group rounded-sm border-2 border-line-soft bg-bg-deep overflow-hidden transition-all duration-300 hover:border-danger shadow-[4px_4px_0_var(--color-line-soft)] hover:shadow-[8px_8px_0_var(--color-danger)] hover:-translate-y-1 hover:-translate-x-1">
           <img src="/images/seo-optimiz/3.png" alt="SEOOptimiz Issue List" className="absolute inset-0 w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
           <div className="hidden absolute inset-0 flex flex-col items-center justify-center border border-dashed border-danger/30 bg-[linear-gradient(45deg,rgba(255,60,60,0.03)_25%,transparent_25%,transparent_50%,rgba(255,60,60,0.03)_50%,rgba(255,60,60,0.03)_75%,transparent_75%,transparent)] bg-[length:24px_24px] p-4 text-center">
             <span className="mono text-danger mb-1 text-xs">[ ISSUE LIST ]</span>
             <p className="text-ink-3 text-[10px]">Add <code className="text-danger bg-surface px-1 py-0.5 rounded">public/images/seo-optimiz/3.png</code></p>
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"></div>
           <div className="absolute bottom-4 left-4 flex flex-col gap-0.5 pointer-events-none">
             <span className="mono text-[9px] tracking-[0.1em] text-danger font-medium">03 // INSIGHTS</span>
             <span className="text-ink text-xs font-medium">Prioritized Fixes</span>
           </div>
        </div>

      </div>

      {/* 01 — Overview */}
      <Beat index={1} title="Overview">
        <div className="mt-8 rounded-3xl bg-[var(--accent)] p-8 sm:p-12 text-bg-deep shadow-[0_20px_60px_-15px_var(--accent)] transform transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_30px_80px_-20px_var(--accent)]">
          <p className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-8 leading-[1.3]">{project.lede}</p>
          <div className="h-px w-24 bg-bg-deep/15 mb-8" />
          <p className="text-[1.05rem] font-medium text-bg-deep/80 leading-relaxed max-w-3xl">{project.body}</p>
        </div>
      </Beat>

      {/* 02 — The problem */}
      <Beat index={2} title="The problem">
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <div key={p.title} className={`group relative rounded-2xl border border-line-soft bg-surface/30 p-6 transition-all duration-400 hover:-translate-y-1 hover:border-[var(--danger)] hover:bg-surface/60 overflow-hidden ${i === 0 ? 'sm:col-span-2' : ''}`}>
              {i === 0 && (
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-[var(--danger)] animate-pulse" />
                  <span className="mono text-[0.65rem] font-bold text-[var(--danger)]">ERR: SCORE UNKNOWN</span>
                </div>
              )}
              <h4 className="text-ink text-[1.1rem] font-semibold tracking-tight group-hover:text-[var(--danger)] transition-colors duration-300">{p.title}</h4>
              <p className="text-ink-2 mt-3 text-[0.9rem] leading-[1.6] max-w-sm">{p.text}</p>
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
      <Beat index={4} title="Architecture">
        <ProcessTimeline steps={HOW_IT_WORKS_STEPS} />
        
        {/* Blueprint Terminal Wrapper */}
        <div className="mt-12 overflow-hidden rounded-[20px] border-2 border-line-soft bg-[#0a0a0c] shadow-2xl">
          <div className="flex items-center justify-between border-b border-line-soft bg-surface/40 px-6 py-3 backdrop-blur-md">
            <span className="mono text-xs text-ink-3">sys_analytics_v1.0 // SEO_PIPELINE</span>
            <div className="flex items-center gap-2">
              <span className="live-dot" style={{ backgroundColor: 'var(--accent)' }} />
              <span className="mono text-xs font-bold text-[var(--accent)] tracking-widest">ONLINE</span>
            </div>
          </div>
          <div className="relative overflow-x-auto p-6 sm:p-12 bg-[linear-gradient(rgba(255,122,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,122,0,0.02)_1px,transparent_1px)] bg-[length:32px_32px]">
            <ArchitectureDiagram
              className="m-0 min-w-155"
              nodes={NODES}
              edges={EDGES}
              ariaLabel={ARIA_LABEL}
              caption={CAPTION}
              externalHighlight={highlightedNode}
            />
          </div>
        </div>
      </Beat>

      {/* 05 — Engineering challenges */}
      <Beat index={5} title="Engineering challenges">
        <div className="mt-8 grid gap-6">
          {CHALLENGES.map((c) => (
            <div key={c.title} className="group relative rounded-2xl border border-line-soft bg-surface/20 p-6 sm:p-8 transition-all duration-300 hover:border-[var(--accent)] hover:bg-surface/40 overflow-hidden">
              <h4 className="text-ink text-[1.2rem] font-semibold tracking-tight mb-6 flex items-center justify-between">
                {c.title}
                <div className="flex gap-1 opacity-20 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></div>
                </div>
              </h4>
              <div className="grid gap-4 sm:grid-cols-3 relative z-10">
                <div className="rounded-xl border border-line-soft bg-bg-deep/50 p-5 shadow-sm">
                  <span className="mono mb-2 block text-[0.65rem] uppercase text-[var(--danger)] tracking-widest font-bold">Challenge</span>
                  <p className="text-ink-2 text-[0.85rem] leading-[1.6]">{c.challenge}</p>
                </div>
                <div className="rounded-xl border border-line-soft bg-bg-deep/50 p-5 shadow-sm">
                  <span className="mono mb-2 block text-[0.65rem] uppercase text-[var(--accent-2)] tracking-widest font-bold">Approach</span>
                  <p className="text-ink-2 text-[0.85rem] leading-[1.6]">{c.approach}</p>
                </div>
                <div className="rounded-xl border border-transparent bg-[var(--accent)] p-5 shadow-[0_10px_30px_-10px_var(--accent)] text-bg-deep transform transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
                  <span className="mono mb-2 block text-[0.65rem] uppercase text-bg-deep/60 tracking-widest font-bold">Result</span>
                  <p className="text-bg-deep text-[0.85rem] leading-[1.6] font-bold">{c.result}</p>
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
        <div className="mt-8 flex flex-col gap-6">
          {TECH_GROUPS.map((g) => (
            <div key={g.group} className="border-line-soft border-t pt-6">
              <h4 className="text-ink text-[0.95rem] font-medium mb-1">{g.group}</h4>
              <p className="text-ink-3 text-[0.8125rem] mb-4">{g.note}</p>
              <div className="flex flex-wrap gap-3">
                {g.items.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onMouseEnter={() => setHighlightedNode(t.node)}
                    onMouseLeave={() => setHighlightedNode(null)}
                    onFocus={() => setHighlightedNode(t.node)}
                    onBlur={() => setHighlightedNode(null)}
                    className="group relative flex items-center gap-2 rounded-full border border-line-soft bg-surface/30 px-4 py-2 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-surface/80 hover:shadow-[0_10px_20px_-10px_var(--accent)]"
                  >
                    <span
                      className="font-semibold text-sm transition-colors duration-200"
                      style={{ color: t.node && t.node === highlightedNode ? 'var(--accent)' : 'var(--ink)' }}
                    >
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Beat>
    </div>
  );
}
