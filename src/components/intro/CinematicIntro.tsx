import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import HeroContent from '../hero/HeroContent';
import IntroEmbers from './IntroEmbers';
import { introFrames, type IntroFrameKey } from './introFrames';
import { STAGE, CROSSFADE, DURATION } from './introStages';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { getLenisInstance } from '../../lib/smoothScroll';

const NARROW_BREAKPOINT = 820;
/** If nothing has triggered the intro by itself, start it anyway — scroll
 *  must never stay locked indefinitely just because a visitor's input
 *  device doesn't fire wheel/touch/key events the listeners below expect. */
const SAFETY_MS = 12000;

/**
 * Home unmounts and remounts on every client-side navigation away from and
 * back to `/` (a project's case study is a real route, not a modal), which
 * would otherwise replay this from scratch each time — a five-second
 * scroll-lock every time someone taps "back" reads as broken, not
 * cinematic. sessionStorage instead of a module-level flag specifically:
 * a module flag would also survive a hard refresh, which should still
 * play the intro once.
 */
const SESSION_KEY = 'intro-played';

function hasPlayedThisSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markPlayedThisSession(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // Storage blocked (private mode, etc.) — the intro simply replays on
    // the next mount instead of persisting, which is a harmless downgrade.
  }
}

function useIsNarrowViewport(): boolean {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < NARROW_BREAKPOINT,
  );
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < NARROW_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return narrow;
}

type StoryFrameKey = Exclude<IntroFrameKey, 'curtain'>;

const FRAME_ORDER: StoryFrameKey[] = ['rest', 'awakening', 'gestureBegins', 'energyBuilding', 'dissolve'];
const STAGE_POINTS = [
  STAGE.rest,
  STAGE.awakening,
  STAGE.gestureBegins,
  STAGE.energyBuilding,
  STAGE.dissolve,
  STAGE.curtainBegin,
];

/** STAGE values are fractions of DURATION — this just multiplies through so
 *  the tween code below reads the same way the old scroll-fraction version
 *  did, only in seconds now instead of scroll progress. */
const at = (fraction: number) => fraction * DURATION;

/**
 * A one-shot, scroll-*triggered* autoplay — not scroll-*scrubbed*. Scrolling
 * through several screen-heights to see a five-frame sequence read as a
 * chore rather than cinematic, so instead: the first scroll/tap/key input
 * locks the page and starts a fixed-length (DURATION-second) timeline that
 * plays through on its own (rest → awakening → gesture → energy → dissolve
 * → curtain), then unlocks scroll and fades away to reveal HeroContent,
 * which sits underneath this fixed overlay in normal document flow the
 * whole time (not hidden via CSS — the opaque overlay is what's covering
 * it, so there's nothing for a no-JS or reduced-motion visitor to get stuck
 * behind).
 */
export default function CinematicIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLParagraphElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLImageElement>(null);
  const curtainRightRef = useRef<HTMLImageElement>(null);
  const restRef = useRef<HTMLImageElement>(null);
  const awakeningRef = useRef<HTMLImageElement>(null);
  const gestureBeginsRef = useRef<HTMLImageElement>(null);
  const energyBuildingRef = useRef<HTMLImageElement>(null);
  const dissolveRef = useRef<HTMLImageElement>(null);
  const emberIntensityRef = useRef(0);

  const frameRefs: Record<StoryFrameKey, React.RefObject<HTMLImageElement>> = {
    rest: restRef,
    awakening: awakeningRef,
    gestureBegins: gestureBeginsRef,
    energyBuilding: energyBuildingRef,
    dissolve: dissolveRef,
  };

  const reducedMotion = usePrefersReducedMotion();
  const isNarrow = useIsNarrowViewport();
  const [played, setPlayed] = useState(() => reducedMotion || hasPlayedThisSession());

  useLayoutEffect(() => {
    if (reducedMotion || hasPlayedThisSession()) {
      setPlayed(true);
      document.documentElement.setAttribute('data-hero-revealed', 'true');
      return;
    }

    const overlay = overlayRef.current;
    const flash = flashRef.current;
    if (!overlay) return;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    getLenisInstance()?.stop();

    function unlockScroll() {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      getLenisInstance()?.start();
    }

    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        emberIntensityRef.current = tl.progress();
      },
      onComplete: () => {
        unlockScroll();
        document.documentElement.setAttribute('data-hero-revealed', 'true');
        setPlayed(true);
        markPlayedThisSession();
      },
    });

    if (cueRef.current) {
      tl.to(cueRef.current, { opacity: 0, ease: 'power1.out', duration: at(0.04) }, 0);
    }

    FRAME_ORDER.forEach((key, i) => {
      const el = frameRefs[key].current;
      if (!el) return;
      const enterAt = STAGE_POINTS[i];
      const exitAt = STAGE_POINTS[i + 1];
      const fadeInStart = i > 0 ? enterAt - CROSSFADE : enterAt;

      if (i > 0) {
        tl.fromTo(
          el,
          { opacity: 0, filter: 'blur(6px)' },
          { opacity: 1, filter: 'blur(0px)', ease: 'power2.out', duration: at(CROSSFADE) },
          at(fadeInStart),
        );
      }
      tl.to(el, { opacity: 0, ease: 'power1.in', duration: at(CROSSFADE) }, at(exitAt - CROSSFADE));

      // Continuous slow zoom across the frame's entire visible lifetime, so
      // it never reads as a static image that abruptly changes.
      tl.fromTo(
        el,
        { scale: 1 },
        { scale: 1.09, ease: 'none', duration: at(exitAt - fadeInStart) },
        at(fadeInStart),
      );
    });

    if (flash) {
      tl.fromTo(
        flash,
        { opacity: 0 },
        { opacity: 0.85, duration: at(CROSSFADE * 0.5), ease: 'power2.out' },
        at(STAGE.curtainBegin - CROSSFADE * 0.5),
      );
      tl.to(flash, { opacity: 0, duration: at(CROSSFADE * 0.7), ease: 'power1.in' }, at(STAGE.curtainBegin));
    }

    if (curtainLeftRef.current && curtainRightRef.current) {
      tl.fromTo(
        [curtainLeftRef.current, curtainRightRef.current],
        { opacity: 0 },
        { opacity: 1, duration: at(CROSSFADE) },
        at(STAGE.curtainBegin - CROSSFADE),
      );
      tl.to(
        curtainLeftRef.current,
        { xPercent: -100, ease: 'power2.in', duration: at(STAGE.curtainEnd - STAGE.curtainBegin) },
        at(STAGE.curtainBegin),
      );
      tl.to(
        curtainRightRef.current,
        { xPercent: 100, ease: 'power2.in', duration: at(STAGE.curtainEnd - STAGE.curtainBegin) },
        at(STAGE.curtainBegin),
      );
    }

    // The reveal: HeroContent already sits in normal document flow behind
    // this overlay, so all that's needed is for the overlay itself to fade
    // away — no separate opacity/transform choreography on HeroContent.
    tl.to(overlay, { opacity: 0, ease: 'power2.inOut', duration: at(1 - STAGE.curtainEnd) }, at(STAGE.curtainEnd));

    let triggered = false;
    function trigger() {
      if (triggered) return;
      triggered = true;
      // Calling stop() here (not just once at mount) is load-bearing: this
      // component's own useLayoutEffect runs before SmoothScrollProvider's
      // useEffect even mounts (child layout effects precede ancestor
      // passive effects), so the mount-time stop() call below is racing
      // against Lenis's own instance not existing yet and silently no-ops.
      // By the time any real DOM event fires, that race is long over —
      // and since this listener was attached before Lenis's own (same
      // ordering reason), this still runs before Lenis's listener sees the
      // same event, so scroll never gets a chance to move first.
      getLenisInstance()?.stop();
      tl.play();
      detachTriggers();
      window.clearTimeout(safetyTimer);
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      trigger();
    }
    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
      trigger();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) return;
      e.preventDefault();
      trigger();
    }
    function onPointerDown() {
      trigger();
    }

    function detachTriggers() {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);

    const safetyTimer = window.setTimeout(trigger, SAFETY_MS);

    return () => {
      detachTriggers();
      window.clearTimeout(safetyTimer);
      tl.kill();
      unlockScroll();
    };
  }, [reducedMotion]);

  return (
    <>
      {!played && (
        <div ref={overlayRef} className="fixed inset-0" style={{ zIndex: 'var(--z-overlay)' }}>
          <div
            ref={stageRef}
            data-theme="dark"
            className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#050507]"
          >
            <IntroEmbers intensityRef={emberIntensityRef} />

            {/* Full-screen, object-contain: the character fills as much of
                the viewport as it can without any part of it being cropped.
                `screen` blend drops each frame's near-black background
                against the page's own near-black background, so the (rare,
                aspect-ratio-driven) letterbox strip reads as page
                background rather than a visible seam. */}
            {FRAME_ORDER.map((key) => (
              <img
                key={key}
                ref={frameRefs[key]}
                src={isNarrow ? introFrames[key].mobile : introFrames[key].desktop}
                alt=""
                aria-hidden
                loading={key === 'rest' ? 'eager' : 'lazy'}
                className="absolute inset-0 h-full w-full object-contain mix-blend-screen"
                style={{ opacity: key === 'rest' ? 1 : 0 }}
              />
            ))}

            {/* The curtain stays full-bleed — environmental energy filling
                the screen, not a framed shot of a figure. */}
            <img
              ref={curtainLeftRef}
              src={isNarrow ? introFrames.curtain.mobile : introFrames.curtain.desktop}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
              style={{ opacity: 0, clipPath: 'inset(0 50% 0 0)' }}
            />
            <img
              ref={curtainRightRef}
              src={isNarrow ? introFrames.curtain.mobile : introFrames.curtain.desktop}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
              style={{ opacity: 0, clipPath: 'inset(0 0 0 50%)' }}
            />

            <div
              ref={flashRef}
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: 0,
                background: 'radial-gradient(60% 60% at 50% 45%, var(--accent-2), transparent 70%)',
              }}
            />

            <p ref={cueRef} className="mono absolute inset-x-0 bottom-10 text-center" style={{ color: 'var(--accent-2)' }}>
              Scroll to enter
            </p>
          </div>
        </div>
      )}

      <HeroContent ref={heroContentRef} />
    </>
  );
}
