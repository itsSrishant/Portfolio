import { useEffect, useRef, useState } from 'react';
import ArchitectureDiagram from './ArchitectureDiagram';
import ProcessTimeline from './ProcessTimeline';
import Beat from './casestudy/Beat';
import type { Project } from '../data/profile';

const HOW_IT_WORKS_STEPS = [
  {
    number: '01',
    title: 'A caller speaks',
    body: 'Audio streams in from the browser and moves straight into speech-to-text — no waiting for the call to finish.',
  },
  {
    number: '02',
    title: 'Retrieval grounds the reply',
    body: "The question is matched against the client's own uploaded documents, so the model answers from what's actually there.",
  },
  {
    number: '03',
    title: 'Guardrails keep it honest',
    body: "Responses stay inside the system's intended scope, with a defined handoff for anything outside it.",
  },
];

/**
 * The case study for the flagship project — a scroll-driven narrative
 * (overview → problem → solution → architecture → challenges → technology)
 * rather than a spec sheet.
 *
 * Every fact here already exists elsewhere in this codebase (profile.ts's
 * project entry, or the internship's contribution list) — this component
 * only restructures and re-narrates approved copy. Nothing is invented:
 * no metrics, no infra detail, no proprietary implementation specifics.
 */

const PROBLEMS = [
  {
    title: 'Latency',
    text: 'Voice conversations become unnatural when a caller has to wait too long for a reply.',
  },
  {
    title: 'Accuracy',
    text: 'The system has to ground answers in the knowledge it was given, not invent information that sounds plausible.',
  },
  {
    title: 'Reliability',
    text: 'Unexpected or out-of-scope questions need predictable behavior, not a confident wrong answer.',
  },
  {
    title: 'Adaptability',
    text: 'A new business use case should be a configuration change, not a rewrite of the application.',
  },
  {
    title: 'Voice quality',
    text: 'Speech recognition and synthesis both have to hold up in real conversational conditions, not just clean test audio.',
  },
];

const CHALLENGES = [
  {
    title: 'Latency',
    challenge:
      'Voice interaction has a much lower tolerance for delay than a text interface — a pause that reads as normal in chat feels broken on a call.',
    approach:
      'Streaming was used across the pipeline stages, so processing and playback could begin before a full response was ready, instead of waiting on the entire pipeline to finish.',
    result: 'Lower perceived latency, and a conversation that keeps its rhythm.',
  },
  {
    title: 'Speech recognition',
    challenge: 'Background noise, interruptions and natural conversational speech all affect transcription quality.',
    approach:
      'The audio capture and speech-processing path was tuned for real conversational conditions, not clean, scripted audio.',
    result: 'More consistent transcription across real calls.',
  },
  {
    title: 'RAG & knowledge grounding',
    challenge: "A language model can produce a plausible-sounding answer that isn't actually in the client's documents.",
    approach:
      'Documents are extracted, chunked, indexed, and retrieved per turn, so the model answers from the passages actually retrieved rather than general training knowledge alone.',
    result: 'Responses stay grounded in the knowledge the client actually provided.',
  },
  {
    title: 'Guardrails',
    challenge: "An assistant that answers confidently outside its intended scope is worse than one that says it doesn't know.",
    approach:
      'A guardrail layer constrains what the assistant will commit to, and hands the conversation to a human when a question falls outside that scope.',
    result: 'Predictable behavior on the questions the system was never meant to answer.',
  },
  {
    title: 'Streaming & bandwidth trade-offs',
    challenge:
      'Streaming trades a simple request/response model for continuous audio transfer, buffering, and the risk of playback interruption if a stage falls behind.',
    approach:
      'The audio pipeline was treated as its own engineering problem — not a feature bolted onto a chat API — with explicit handling for buffering and interruption.',
    result: 'A playback path that stays smooth under normal conversational conditions.',
  },
  {
    title: 'Reliability',
    challenge:
      "Calls fail in ways chat sessions don't — a provider call times out mid-sentence, a caller asks something entirely out of scope, a connection drops.",
    approach:
      'Defined fallback behavior for each of these cases, so a failure surfaces as a handled response instead of a raw error reaching the caller.',
    result: 'A system that degrades predictably instead of breaking silently.',
  },
];

const TECH: Array<{ name: string; reason: string; node: string | null }> = [
  { name: 'React', reason: 'Interactive voice interface and dashboard.', node: null },
  { name: 'JavaScript', reason: 'Application logic across the frontend.', node: null },
  { name: 'Python', reason: 'AI and voice-processing orchestration.', node: 'llm' },
  { name: 'FastAPI', reason: "Backend API layer connecting the voice pipeline's services.", node: null },
  { name: 'LLMs', reason: 'Conversation reasoning and response generation.', node: 'llm' },
  { name: 'STT', reason: "Converts the caller's speech into text.", node: 'stt' },
  { name: 'TTS', reason: 'Converts generated responses into spoken audio.', node: 'tts' },
  { name: 'RAG', reason: 'Grounds responses in the uploaded knowledge base.', node: 'kb' },
  { name: 'PostgreSQL', reason: 'Application data during development.', node: null },
  { name: 'REST APIs', reason: 'Communication between application services.', node: null },
  { name: 'Docker', reason: 'A reproducible application environment.', node: null },
];

/** A sophisticated, elegant audio waveform visualization that reacts to scroll
 *  and simulates active voice processing, fitting the premium aesthetic. */
function AudioWaveform() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mt-12 flex h-32 w-full items-center justify-center gap-1.5 rounded-2xl border border-line-soft bg-bg-deep p-8 shadow-inner"
    >
      {Array.from({ length: 48 }).map((_, i) => {
        // Create a realistic-looking waveform shape using a sine wave envelope
        const normalized = i / 47;
        const envelope = Math.sin(normalized * Math.PI);
        // Randomize the height slightly, but bounded by the envelope
        const height = inView ? Math.max(10, Math.random() * 80 * envelope + 10) : 4;
        
        return (
          <div
            key={i}
            className="w-1.5 rounded-full bg-accent transition-all duration-300 ease-out"
            style={{
              height: `${height}%`,
              opacity: inView ? Math.random() * 0.5 + 0.5 : 0.2,
              transitionDelay: `${i * 15}ms`,
              boxShadow: inView ? '0 0 10px var(--accent)' : 'none'
            }}
          />
        );
      })}
    </div>
  );
}

export default function CaseStudy({ project }: { project: Project }) {
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  return (
    <div 
      className="mt-10" 
      style={{ 
        '--accent': 'oklch(0.95 0 0)', // Elegant Silver/White
        '--accent-2': 'oklch(0.85 0.05 100)', // Subtle Warm Gold/Sand
        '--danger': 'oklch(0.7 0.1 20)', // Muted brick red
        
        // Re-aliasing for Tailwind classes
        '--color-accent': 'var(--accent)',
        '--color-accent-2': 'var(--accent-2)',
        '--color-danger': 'var(--danger)',
        
        // Tinting the lines to match the silver theme
        '--color-line': 'color-mix(in oklch, var(--accent) 25%, #050505)',
        '--color-line-soft': 'color-mix(in oklch, var(--accent) 12%, #050505)'
      } as React.CSSProperties}
    >
      {/* 01 — Overview */}
      <Beat index={1} title="Overview">
        <div className="mt-8 rounded-3xl bg-[var(--accent)] p-8 sm:p-12 text-bg-deep shadow-[0_20px_60px_-15px_var(--accent)] transform transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_30px_80px_-20px_var(--accent)]">
          <p className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-8 leading-[1.3]">{project.lede}</p>
          <div className="h-px w-24 bg-bg-deep/15 mb-8" />
          <p className="text-[1.05rem] font-medium text-bg-deep/80 leading-relaxed max-w-3xl">{project.body}</p>
        </div>
        <div className="mt-12 rounded-2xl overflow-hidden border border-line-soft bg-surface/20 p-8 flex items-center justify-center shadow-inner">
          <AudioWaveform />
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
                  <span className="mono text-[0.65rem] font-bold text-[var(--danger)]">ERR: TIMEOUT &gt; 2000ms</span>
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
          I worked on a configurable, domain-agnostic voice AI platform that combines real-time speech processing,
          retrieval-augmented generation, conversation orchestration and a guardrail layer into a single system.
        </p>
      </Beat>

      {/* 04 — How it works / architecture */}
      <Beat index={4} title="Architecture">
        <ProcessTimeline steps={HOW_IT_WORKS_STEPS} />
        
        {/* Blueprint Terminal Wrapper */}
        <div className="mt-12 overflow-hidden rounded-[20px] border-2 border-line-soft bg-[#0a0a0c] shadow-2xl">
          <div className="flex items-center justify-between border-b border-line-soft bg-surface/40 px-6 py-3 backdrop-blur-md">
            <span className="mono text-xs text-ink-3">sys_arch_v2.0 // VOICE_PIPELINE</span>
            <div className="flex items-center gap-2">
              <span className="live-dot" style={{ backgroundColor: 'var(--accent-2)' }} />
              <span className="mono text-xs font-bold text-[var(--accent-2)] tracking-widest">ONLINE</span>
            </div>
          </div>
          <div className="relative overflow-x-auto p-6 sm:p-12 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:32px_32px]">
            <ArchitectureDiagram className="m-0 min-w-155" externalHighlight={highlightedNode} />
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
                <div className="rounded-xl border border-transparent bg-[var(--accent)] p-5 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.2)] text-bg-deep transform transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
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
          Hover or focus a piece of the stack to see where it sits in the architecture above.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {TECH.map((t) => (
            <button
              key={t.name}
              type="button"
              onMouseEnter={() => setHighlightedNode(t.node)}
              onMouseLeave={() => setHighlightedNode(null)}
              onFocus={() => setHighlightedNode(t.node)}
              onBlur={() => setHighlightedNode(null)}
              className="group relative flex items-center gap-3 rounded-full border border-line-soft bg-surface/30 px-5 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-surface/80 hover:shadow-[0_10px_20px_-10px_var(--accent)]"
            >
              <span
                className="font-semibold transition-colors duration-200"
                style={{ color: t.node && t.node === highlightedNode ? 'var(--accent)' : 'var(--ink)' }}
              >
                {t.name}
              </span>
              <span className="h-4 w-[1px] bg-line-soft group-hover:bg-[var(--accent)]/30 transition-colors duration-300" />
              <span className="text-ink-3 text-[0.8rem] max-w-[140px] truncate sm:max-w-none text-left leading-tight group-hover:text-ink-2 transition-colors duration-300">{t.reason}</span>
            </button>
          ))}
        </div>
      </Beat>
    </div>
  );
}
