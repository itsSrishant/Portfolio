import { useEffect, useRef, useState } from 'react';

/**
 * The voice assistant, drawn at the level it can honestly be shown.
 *
 * This is the project's imagery. Screenshots of the real product would expose
 * an employer's internal software, so the system is documented instead of
 * photographed — which is also the more useful artefact for anyone reading the
 * project as engineering rather than as a portfolio tile.
 *
 * Nothing here is vendor-specific: these are roles in a pipeline, not products.
 *
 * Interaction: hovering a node spotlights it and its direct neighbors (the
 * subgraph actually touching it) and dims the rest — useful for an
 * architecture diagram specifically, since "what talks to what" is the
 * question a reader actually has. The edges carry a slow traveling pulse,
 * gated by IntersectionObserver so it only runs while the diagram is on
 * screen — a static diagram would read as a screenshot; a pipeline that
 * never stops moving reads as decoration. Both respect
 * prefers-reduced-motion.
 */

export interface NodeDef {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: boolean;
}

export interface EdgeDef {
  id: string;
  from: string;
  to: string;
  d: string;
  kind: 'main' | 'accent' | 'dashed';
}

/** The voice platform's pipeline — the diagram's original (and still
 *  default) content, kept here as named exports so every existing call
 *  site keeps working with zero props. */
export const VOICE_NODES: NodeDef[] = [
  { id: 'caller-in', x: 14, y: 118, w: 96, h: 46, label: 'Caller', sub: 'audio in' },
  { id: 'stt', x: 150, y: 118, w: 108, h: 46, label: 'Speech → text', sub: 'streaming' },
  { id: 'llm', x: 298, y: 110, w: 130, h: 62, label: 'Language model', sub: 'streamed reply', accent: true },
  { id: 'tts', x: 468, y: 118, w: 108, h: 46, label: 'Text → speech', sub: 'streaming' },
  { id: 'caller-out', x: 616, y: 118, w: 96, h: 46, label: 'Caller', sub: 'audio out' },
  { id: 'guardrails', x: 298, y: 18, w: 130, h: 44, label: 'Guardrails', sub: 'scope + handoff' },
  { id: 'kb', x: 298, y: 218, w: 130, h: 46, label: 'Knowledge base', sub: 'retrieval' },
  { id: 'postcall', x: 468, y: 218, w: 108, h: 46, label: 'Post-call', sub: 'analysis' },
];

export const VOICE_EDGES: EdgeDef[] = [
  { id: 'e-in-stt', from: 'caller-in', to: 'stt', d: 'M110 141H144', kind: 'main' },
  { id: 'e-stt-llm', from: 'stt', to: 'llm', d: 'M258 141H292', kind: 'main' },
  { id: 'e-llm-tts', from: 'llm', to: 'tts', d: 'M428 141H462', kind: 'main' },
  { id: 'e-tts-out', from: 'tts', to: 'caller-out', d: 'M576 141H610', kind: 'main' },
  { id: 'e-guardrails-llm', from: 'guardrails', to: 'llm', d: 'M363 62V104', kind: 'accent' },
  { id: 'e-kb-llm', from: 'kb', to: 'llm', d: 'M363 218V178', kind: 'accent' },
  { id: 'e-tts-postcall', from: 'tts', to: 'postcall', d: 'M428 241H462', kind: 'dashed' },
];

export const VOICE_ARIA_LABEL =
  "System diagram. A caller's speech enters a streaming speech-to-text stage, which passes text to a language model. The language model reads retrieved passages from a knowledge base built from uploaded documents, and is constrained by a guardrail layer. Its streamed reply is spoken back through text-to-speech to the caller. The full transcript is also written to post-call analysis.";

export const VOICE_CAPTION = 'UPLOADED DOCUMENTS → CHUNKED → INDEXED → RETRIEVED PER TURN';

const EDGE_COLOR = {
  main: { base: 'rgba(233,233,242,0.4)', active: 'rgba(233,233,242,0.9)' },
  accent: { base: 'rgba(139,123,240,0.65)', active: 'rgba(139,123,240,1)' },
  dashed: { base: 'rgba(233,233,242,0.24)', active: 'rgba(233,233,242,0.6)' },
} as const;

interface ArchitectureDiagramProps {
  className?: string;
  nodes?: NodeDef[];
  edges?: EdgeDef[];
  ariaLabel?: string;
  /** Small mono caption under the diagram — omit to leave it blank. */
  caption?: string;
  /** Lets an ancestor (e.g. a "technology → architecture" hover list) drive
   *  the same spotlight this diagram already applies to its own hover —
   *  additive only, so nothing changes when it's left unset. */
  externalHighlight?: string | null;
}

export default function ArchitectureDiagram({
  className = '',
  nodes = VOICE_NODES,
  edges = VOICE_EDGES,
  ariaLabel = VOICE_ARIA_LABEL,
  caption = VOICE_CAPTION,
  externalHighlight = null,
}: ArchitectureDiagramProps) {
  const figureRef = useRef<HTMLElement>(null);
  const [hoveredLocal, setHoveredLocal] = useState<string | null>(null);
  const hovered = hoveredLocal ?? externalHighlight;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = figureRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const neighbors = new Set<string>();
  if (hovered) {
    for (const edge of edges) {
      if (edge.from === hovered) neighbors.add(edge.to);
      if (edge.to === hovered) neighbors.add(edge.from);
    }
  }

  const nodeState = (id: string): 'active' | 'neighbor' | 'dim' | 'neutral' => {
    if (!hovered) return 'neutral';
    if (id === hovered) return 'active';
    if (neighbors.has(id)) return 'neighbor';
    return 'dim';
  };

  const edgeState = (edge: EdgeDef): 'active' | 'dim' | 'neutral' => {
    if (!hovered) return 'neutral';
    if (edge.from === hovered || edge.to === hovered) return 'active';
    return 'dim';
  };

  return (
    <figure ref={figureRef} className={className} data-in-view={inView ? 'true' : 'false'}>
      <svg
        viewBox="0 0 760 300"
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 10 5 0 10z" fill="rgba(233,233,242,0.4)" />
          </marker>
          <marker id="arw-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 10 5 0 10z" fill="rgba(139,123,240,0.7)" />
          </marker>
          <filter id="node-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges under nodes, so a hovered node's glow sits on top of its lines. */}
        {edges.map((edge) => {
          const state = edgeState(edge);
          const color = EDGE_COLOR[edge.kind];
          return (
            <path
              key={edge.id}
              d={edge.d}
              fill="none"
              stroke={state === 'active' ? color.active : color.base}
              strokeWidth={state === 'active' ? 2 : 1.2}
              strokeDasharray={edge.kind === 'dashed' ? '4 4' : undefined}
              markerEnd={`url(#${edge.kind === 'accent' ? 'arw-v' : 'arw'})`}
              className={edge.kind !== 'dashed' ? 'diagram-edge' : undefined}
              style={{
                opacity: state === 'dim' ? 0.25 : 1,
                transition: 'opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease',
              }}
            />
          );
        })}

        {nodes.map((node) => {
          const state = nodeState(node.id);
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredLocal(node.id)}
              onMouseLeave={() => setHoveredLocal(null)}
              style={{ opacity: state === 'dim' ? 0.4 : 1, transition: 'opacity 0.3s ease' }}
            >
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height={node.h}
                rx="7"
                fill={node.accent ? 'rgba(139,123,240,0.10)' : 'rgba(255,255,255,0.022)'}
                stroke={
                  state === 'active'
                    ? 'rgba(139,123,240,0.9)'
                    : node.accent
                      ? 'rgba(139,123,240,0.55)'
                      : 'rgba(233,233,242,0.16)'
                }
                strokeWidth={state === 'active' ? 1.6 : 1}
                filter={state === 'active' ? 'url(#node-glow)' : undefined}
                style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
              />
              <text
                x={node.x + node.w / 2}
                y={node.sub ? node.y + node.h / 2 - 3 : node.y + node.h / 2 + 4}
                textAnchor="middle"
                fill="#e9e9f2"
                fontSize="11.5"
                fontWeight="500"
                fontFamily="'Schibsted Grotesk', sans-serif"
              >
                {node.label}
              </text>
              {node.sub && (
                <text
                  x={node.x + node.w / 2}
                  y={node.y + node.h / 2 + 12}
                  textAnchor="middle"
                  fill="#8a8a9c"
                  fontSize="8.5"
                  fontFamily="'Geist Mono', ui-monospace, monospace"
                >
                  {node.sub}
                </text>
              )}
            </g>
          );
        })}

        {caption && (
          <text
            x={363}
            y={293}
            textAnchor="middle"
            fill="#8a8a9c"
            fontSize="8.5"
            fontFamily="'Geist Mono', ui-monospace, monospace"
            letterSpacing="0.12em"
          >
            {caption}
          </text>
        )}
      </svg>
    </figure>
  );
}
