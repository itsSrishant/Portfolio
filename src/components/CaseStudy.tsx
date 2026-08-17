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

const FLOW_STEPS = [
  'Caller speaks',
  'Speech-to-text',
  'Conversation reasoning',
  'Knowledge retrieval',
  'LLM',
  'Guardrails',
  'Text-to-speech',
  'Caller hears response',
];

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

function FlowArrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M12 4v14M6 12l6 6 6-6" />
    </svg>
  );
}

function FlowBox({ steps, activeIndex, offset }: { steps: string[]; activeIndex: number; offset: number }) {
  return (
    <div className="border-line-soft bg-bg-deep rounded-2xl border p-6 sm:p-8">
      <ol className="flex flex-col items-center gap-3">
        {steps.map((step, i) => {
          const active = activeIndex === offset + i;
          return (
            <li key={step} className="flex w-full flex-col items-center gap-3">
              <span
                className="w-full rounded-full border px-5 py-3 text-center text-[0.9rem] font-medium transition-all duration-500"
                style={
                  active
                    ? {
                        borderColor: 'var(--accent)',
                        color: 'var(--ink)',
                        backgroundColor: 'color-mix(in oklch, var(--accent) 18%, var(--surface))',
                        boxShadow: '0 0 16px 2px color-mix(in oklch, var(--accent) 45%, transparent)',
                      }
                    : { borderColor: 'var(--line-soft)', color: 'var(--ink-2)', backgroundColor: 'var(--surface)' }
                }
              >
                {step}
              </span>
              {i < steps.length - 1 && (
                <FlowArrow
                  className={`h-5 w-5 flex-none transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-40'}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** The overview's system-flow visual: two large boxes spanning the full
 *  width with a big, clearly visible connecting arrow between them. A
 *  highlight steps through all eight stages in sequence — box one, across
 *  the arrow, box two, on a loop — so the "data is moving through this"
 *  read comes from real motion, not a static row of pills. Gated to run
 *  only while on screen, and skipped entirely under reduced motion (the
 *  fully legible static diagram is shown instead). */
function FlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduceMotionRef.current) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % FLOW_STEPS.length);
    }, 900);
    return () => clearInterval(id);
  }, [inView]);

  const arrowActive = !reduceMotionRef.current && (activeIndex === 3 || activeIndex === 4);

  return (
    <div
      ref={ref}
      data-in-view={inView ? 'true' : 'false'}
      className="mt-8 grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-8"
    >
      <FlowBox steps={FLOW_STEPS.slice(0, 4)} activeIndex={activeIndex} offset={0} />
      <div
        className={`flow-strip-arrow mx-auto flex h-14 w-14 flex-none items-center justify-center rounded-full transition-transform duration-500 ${
          arrowActive ? 'scale-110' : ''
        }`}
      >
        <FlowArrow className="h-7 w-7 sm:-rotate-90" />
      </div>
      <FlowBox steps={FLOW_STEPS.slice(4)} activeIndex={activeIndex} offset={4} />
    </div>
  );
}

export default function CaseStudy({ project }: { project: Project }) {
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  return (
    <div className="mt-10">
      {/* 01 — Overview */}
      <Beat index={1} title="Overview">
        <p className="text-ink prose-col mt-5 text-[1.1rem] leading-[1.7]">{project.lede}</p>
        <p className="text-ink-2 prose-col mt-4 leading-[1.75]">{project.body}</p>
        <FlowDiagram />
      </Beat>

      {/* 02 — The problem */}
      <Beat index={2} title="The problem">
        <p className="text-ink-2 prose-col mt-5 leading-[1.75]">
          A voice AI system can't just generate a good answer. It has to understand spoken language, respond quickly
          enough that a call doesn't feel broken, retrieve facts instead of inventing them, stay inside its intended
          scope, and do all of this across business use cases it wasn't specifically built for.
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
          I worked on a configurable, domain-agnostic voice AI platform that combines real-time speech processing,
          retrieval-augmented generation, conversation orchestration and a guardrail layer into a single system.
        </p>
      </Beat>

      {/* 04 — How it works / architecture */}
      <Beat index={4} title="How it works">
        <p className="text-ink-2 prose-col mt-5 leading-[1.75]">
          The system is a pipeline, not a single model call. Caller audio moves through speech-to-text, a
          conversation manager, retrieval, the language model, a guardrail layer, and text-to-speech — with a
          knowledge-base pipeline feeding retrieval, and a transcript branching off into post-call analysis.
        </p>
        <ProcessTimeline steps={HOW_IT_WORKS_STEPS} />
        <div className="border-line-soft bg-bg-deep mt-12 overflow-x-auto rounded-[14px] border p-6 sm:p-8">
          <ArchitectureDiagram className="m-0 min-w-155" externalHighlight={highlightedNode} />
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
          Hover or focus a piece of the stack — where it has a place in the architecture above, that node lights up
          there (scroll up to see it if it's out of view).
        </p>
        <div className="mt-4">
          {TECH.map((t) => (
            <button
              key={t.name}
              type="button"
              onMouseEnter={() => setHighlightedNode(t.node)}
              onMouseLeave={() => setHighlightedNode(null)}
              onFocus={() => setHighlightedNode(t.node)}
              onBlur={() => setHighlightedNode(null)}
              className="border-line-soft hover:border-accent/60 hover:bg-surface flex w-full cursor-pointer flex-col gap-1 border-t px-3 py-4 text-left transition-all duration-200 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <span
                className="font-medium transition-colors duration-200"
                style={{ color: t.node && t.node === highlightedNode ? 'var(--accent-2)' : 'var(--ink)' }}
              >
                {t.name}
              </span>
              <span className="text-ink-3 text-[0.875rem]">{t.reason}</span>
            </button>
          ))}
        </div>
      </Beat>
    </div>
  );
}
