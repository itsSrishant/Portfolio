import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTilt } from '../hooks/useTilt';

const PORTRAIT_SRC = '/srishant-portrait.jpg';
const CHARACTER_SRC = '/assets/portfolio-intro/frame-portrait-reveal.webp';

/** Both layers share this exact object-position — the two images were
 *  created with matching framing specifically so the character's head,
 *  eyes and shoulders land where the portrait's do. Repositioning either
 *  layer independently would break that alignment. */
const OBJECT_POSITION = '50% 18%';

const ALT = "Srishant Kulkarni's portrait — press to reveal a futuristic armoured version of him.";

/** Small, fixed set of drift targets — not randomised per-render, so the
 *  burst looks the same (subtle) every time rather than occasionally
 *  clumping. Kept short deliberately: this is a hint of energy, not a
 *  particle simulation. */
const PARTICLES = [
  { x: 22, y: 30, delay: 0.0, driftX: -14, driftY: -26, size: 3 },
  { x: 68, y: 18, delay: 0.05, driftX: 10, driftY: -30, size: 2.4 },
  { x: 40, y: 60, delay: 0.1, driftX: -18, driftY: -22, size: 2.8 },
  { x: 80, y: 45, delay: 0.04, driftX: 16, driftY: -24, size: 2.2 },
  { x: 15, y: 70, delay: 0.14, driftX: -10, driftY: -28, size: 2.6 },
  { x: 55, y: 80, delay: 0.08, driftX: 6, driftY: -26, size: 3.2 },
  { x: 88, y: 68, delay: 0.16, driftX: 14, driftY: -20, size: 2.2 },
  { x: 32, y: 12, delay: 0.12, driftX: -8, driftY: -24, size: 2.6 },
];

/** Diagonal skew of the wipe edge, in percentage-points of the frame width. */
const SWEEP = 20;
/** Total transition duration in seconds — within the 600-900ms enter /
 *  500-800ms leave targets for both directions, since GSAP's `.reverse()`
 *  plays the same timeline backward at the same speed. */
const DURATION = 0.7;

/**
 * The signature interaction, rebuilt around two aligned image layers
 * instead of a cursor-tracked canvas aperture: hovering (or, on touch,
 * tapping) the whole portrait triggers a diagonal purple energy sweep that
 * wipes the portrait away to reveal the armoured character beneath —
 * "my identity → energy activation → transformation → futuristic
 * character" — rather than a cursor-followed keyhole.
 *
 * One GSAP timeline drives everything (the wipe, the sweep band, the
 * rim-light, the particle burst) via a single progress value written
 * directly to the DOM in onUpdate — never through React state — so rapid
 * hover in/out just calls `.play()`/`.reverse()` on the same in-flight
 * timeline instead of restarting an animation, which is what keeps quick
 * re-triggering from ever looking broken.
 */
export default function ProfileReveal() {
  const frameRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);

  // A second, independent layer of depth: the whole card leans in 3D toward
  // a mouse or trackpad, on top of this component's own reveal. See
  // hooks/useTilt.ts for why it's skipped on touch and under reduced motion.
  useTilt(frameRef);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
    const syncMotion = () => setReducedMotion(motion.matches);
    const syncCoarse = () => setCoarsePointer(coarse.matches);
    syncMotion();
    syncCoarse();
    motion.addEventListener('change', syncMotion);
    coarse.addEventListener('change', syncCoarse);
    return () => {
      motion.removeEventListener('change', syncMotion);
      coarse.removeEventListener('change', syncCoarse);
    };
  }, []);

  // The cinematic timeline only exists under no-preference motion. Reduced
  // motion instead drives a plain CSS opacity crossfade via `revealed`
  // directly on the portrait layer's inline style below — a real branch,
  // not this effect quietly doing less.
  useEffect(() => {
    if (reducedMotion) return;
    const portrait = portraitRef.current;
    const band = bandRef.current;
    const glow = glowRef.current;
    if (!portrait || !band || !glow) return;

    const state = { p: 0 };
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power2.inOut' },
      onUpdate: () => {
        const t = state.p;
        // Diagonal wipe: at t=0 the portrait fully covers the frame; at
        // t=1 it's clipped away entirely. `centerX` sweeps the diagonal
        // edge from well past the right border to well past the left one,
        // so both corners clear smoothly instead of snapping.
        const centerX = 100 + SWEEP - t * (100 + SWEEP * 2);
        const topX = centerX + SWEEP;
        const bottomX = centerX - SWEEP;
        portrait.style.clipPath = `polygon(0% 0%, ${topX}% 0%, ${bottomX}% 100%, 0% 100%)`;
        band.style.left = `${centerX - 23}%`;
        // sin envelope: 0 at both ends, peak at the midpoint — the sweep
        // band appears as it crosses and fades before it's just sitting
        // on an edge.
        band.style.opacity = String(Math.sin(Math.min(1, Math.max(0, t)) * Math.PI) * 0.85);
        // Capped well below 1: this is a rim accent, not a wash. The
        // character image already has its own contrast and detail — this
        // layer should only add a hint of edge glow, not compete with it.
        glow.style.opacity = String(t * 0.22);
      },
    });

    tl.to(state, { p: 1, duration: DURATION }, 0);

    particleRefs.current.forEach((el, i) => {
      if (!el) return;
      const p = PARTICLES[i];
      tl.fromTo(
        el,
        { opacity: 0, x: 0, y: 0 },
        { opacity: 1, x: p.driftX, y: p.driftY, duration: DURATION * 0.55, ease: 'power1.out' },
        p.delay,
      ).to(el, { opacity: 0, duration: DURATION * 0.35, ease: 'power1.in' }, `>-${DURATION * 0.1}`);
    });

    timelineRef.current = tl;
    return () => {
      tl.kill();
      timelineRef.current = null;
    };
  }, [reducedMotion]);

  const reveal = () => {
    timelineRef.current?.play();
    setRevealed(true);
  };

  const conceal = () => {
    timelineRef.current?.reverse();
    setRevealed(false);
  };

  // Extremely subtle cursor-relative drift on the glow layer only — not the
  // whole card (useTilt already owns that) — a few px, never more.
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || coarsePointer) return;
    const frame = frameRef.current;
    const glow = glowRef.current;
    if (!frame || !glow) return;
    const r = frame.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    glow.style.setProperty('--glow-x', `${(nx * 5).toFixed(1)}px`);
    glow.style.setProperty('--glow-y', `${(ny * 4).toFixed(1)}px`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (revealed) conceal();
    else reveal();
  };

  const handleClick = () => {
    // Desktop already reveals on hover; only touch needs a toggle.
    if (!coarsePointer) return;
    if (revealed) conceal();
    else reveal();
  };

  return (
    <figure className="m-0">
      <div className="tilt-stage">
        <div
          ref={frameRef}
          className={`portrait-frame profile-reveal group relative overflow-hidden rounded-[14px] border border-line-soft ${
            revealed ? 'is-revealed' : ''
          }`}
          style={{ aspectRatio: '4 / 5' }}
          role="button"
          tabIndex={0}
          aria-pressed={revealed}
          aria-label={ALT}
          onPointerEnter={coarsePointer ? undefined : reveal}
          onPointerLeave={coarsePointer ? undefined : conceal}
          onPointerMove={handlePointerMove}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
        >
          {/* Character layer: always present underneath, revealed as the
              portrait above wipes away. */}
          <img
            src={CHARACTER_SRC}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: OBJECT_POSITION }}
          />

          {/* Rim-light boost over the character — soft bloom concentrated
              toward the top/shoulders via the gradient itself, not a hard
              outline — fades in with reveal progress. */}
          <div
            ref={glowRef}
            aria-hidden
            className="profile-reveal-glow pointer-events-none absolute inset-0"
            style={
              reducedMotion
                ? { opacity: revealed ? 0.22 : 0, transition: 'opacity 300ms ease' }
                : { opacity: 0 }
            }
          />

          {/* Portrait layer on top, clipped away by the timeline. Under
              reduced motion this is a plain opacity crossfade instead. */}
          <img
            ref={portraitRef}
            src={PORTRAIT_SRC}
            alt={ALT}
            width={1200}
            height={1500}
            className="absolute inset-0 h-full w-full object-cover"
            style={
              reducedMotion
                ? { objectPosition: OBJECT_POSITION, opacity: revealed ? 0 : 1, transition: 'opacity 300ms ease' }
                : { objectPosition: OBJECT_POSITION }
            }
          />

          {!reducedMotion && (
            <>
              {/* Energy sweep band. */}
              <div
                ref={bandRef}
                aria-hidden
                className="profile-reveal-band pointer-events-none absolute inset-y-0"
                style={{ opacity: 0, left: '-30%' }}
              />

              {/* Particles. */}
              {PARTICLES.map((p, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    particleRefs.current[i] = el;
                  }}
                  aria-hidden
                  className="profile-reveal-particle pointer-events-none absolute rounded-full"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0 }}
                />
              ))}
            </>
          )}

          {/* Instrument corner marks — four hairlines, not a frame. */}
          <span aria-hidden className="corner corner-tl" />
          <span aria-hidden className="corner corner-tr" />
          <span aria-hidden className="corner corner-bl" />
          <span aria-hidden className="corner corner-br" />

          {/* A soft highlight that leans with the tilt, so the card reads as
              a lit pane of glass rather than a flat image on a hinge. */}
          <span aria-hidden className="tilt-glare" />
        </div>
      </div>

      <figcaption className="mt-4 flex items-center gap-2.5">
        <span className={revealed ? 'live-dot' : 'idle-dot'} aria-hidden />
        <span className="mono">
          {coarsePointer ? (revealed ? 'Tap to return' : 'Tap to reveal') : revealed ? 'The other side' : 'Move across the portrait'}
        </span>
      </figcaption>
    </figure>
  );
}
