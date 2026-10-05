import { useState, useRef } from 'react';
import ArchitectureDiagram, { type NodeDef, type EdgeDef } from './ArchitectureDiagram';
import ProcessTimeline from './ProcessTimeline';
import Beat from './casestudy/Beat';
import type { Project } from '../data/profile';

/* 
const SlideshowImage = ({ images, interval = 4000 }: { images: string[], interval?: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <>
      {images.map((src, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div 
            key={src} 
            className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110" aria-hidden="true" />
            <img src={src} alt={`Screenshot ${idx + 1}`} className={`absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-1000 ${isActive ? 'group-hover:scale-[1.03]' : 'scale-[0.97]'}`} />
          </div>
        );
      })}
    </>
  );
};
*/



const SpotlightGallery = ({ images }: { images: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const renderGrid = (isMasked: boolean) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full ${isMasked ? '' : 'opacity-20 grayscale brightness-50 contrast-125'}`}>
      {/* 1 - Top Left (50% Width) */}
      <div className="aspect-[4/3] md:aspect-[16/10] relative rounded-[2rem] border border-white/5 bg-[#050505] flex items-center justify-center p-6 md:p-12 overflow-hidden shadow-2xl">
        {isMasked && <div className="absolute inset-0 bg-accent/10"></div>}
        <img src={images[0]} className="relative z-10 w-full h-full object-contain" alt="" />
      </div>

      {/* 2 - Top Right (50% Width) */}
      <div className="aspect-[4/3] md:aspect-[16/10] relative rounded-[2rem] border border-white/5 bg-[#050505] flex items-center justify-center p-6 md:p-12 overflow-hidden shadow-xl">
        {isMasked && <div className="absolute inset-0 bg-accent/10"></div>}
        <img src={images[1]} className="relative z-10 w-full h-full object-contain" alt="" />
      </div>

      {/* 3 - Bottom Left (50% Width) */}
      <div className="aspect-[4/3] md:aspect-[16/10] relative rounded-[2rem] border border-white/5 bg-[#050505] flex items-center justify-center p-6 md:p-12 overflow-hidden shadow-xl">
        {isMasked && <div className="absolute inset-0 bg-accent/10"></div>}
        <img src={images[2]} className="relative z-10 w-full h-full object-contain" alt="" />
      </div>

      {/* 4 - Bottom Right (50% Width) */}
      <div className="aspect-[4/3] md:aspect-[16/10] relative rounded-[2rem] border border-white/5 bg-[#050505] flex items-center justify-center p-6 md:p-12 overflow-hidden shadow-2xl">
        {isMasked && <div className="absolute inset-0 bg-accent/10"></div>}
        <img src={images[3]} className="relative z-10 w-full h-full object-contain" alt="" />
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="mb-32 mt-16 relative w-[100vw] left-1/2 -translate-x-1/2 px-4 md:px-12 z-10 group cursor-crosshair"
      onMouseMove={handleMouseMove}
      style={{ '--mouse-x': '50%', '--mouse-y': '50%' } as React.CSSProperties}
    >
      {/* Base Layer: Dimmed, grayscale */}
      {renderGrid(false)}

      {/* Spotlight Layer: Full color, masked by cursor */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 px-4 md:px-12"
        style={{
          WebkitMaskImage: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), black 10%, transparent 100%)',
          maskImage: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), black 10%, transparent 100%)'
        }}
      >
        {renderGrid(true)}
      </div>

      {/* Decorative center glow for X-Ray */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), var(--color-accent) 0%, transparent 100%)',
          mixBlendMode: 'screen',
          opacity: 0.15
        }}
      ></div>

      {/* Interactive instruction */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-60 group-hover:opacity-0 transition-opacity duration-500 text-center">
        <span className="text-accent text-[0.65rem] mono tracking-[0.2em] uppercase font-bold animate-pulse">Hover to reveal X-Ray</span>
      </div>
    </div>
  );
};



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
      {/* 00 — Spotlight X-Ray Gallery */}
      <SpotlightGallery 
        images={[
          '/images/seo-optimiz/6.png', 
          '/images/seo-optimiz/1.png', 
          '/images/seo-optimiz/2.png',
          '/images/seo-optimiz/3.png'
        ]} 
      />

      {/* Legacy Scroll Deck Gallery (Commented out for fallback) */}
      {/* 
      <ScrollDeckGallery 
        images={[
          '/images/seo-optimiz/6.png', 
          '/images/seo-optimiz/1.png', 
          '/images/seo-optimiz/2.png',
          '/images/seo-optimiz/3.png',
          '/images/seo-optimiz/4.png',
          '/images/seo-optimiz/5.png'
        ]} 
      />
      */}

      {/* Legacy 3D Mockup (Commented out for fallback) */}
      {/* 
      <div className="mb-24 mt-16 relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] [perspective:2000px] group flex items-center justify-center z-10">
        <div className="absolute inset-0 bg-accent/5 blur-[100px] rounded-full group-hover:bg-accent/10 transition-colors duration-1000"></div>
        <div className="relative w-[95%] h-[95%] rounded-xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_20px_60px_-15px_var(--color-accent)] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform group-hover:[transform:rotateX(4deg)_rotateY(-6deg)_scale(1.02)] group-hover:shadow-[30px_50px_100px_-20px_var(--color-accent)] overflow-hidden flex flex-col">
          ...
        </div>
      </div>
      */}

      {/* Legacy Bento Grid (Commented out for fallback) */}
      {/* 
      <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px] z-10">
      ... (Legacy code retained in git history)
      </div> 
      */}

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
