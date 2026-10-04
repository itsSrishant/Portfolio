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

    // 3D Parallax Mouse Tracking & Velocity Glitch
    let lastX = 0;
    let lastTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (stageRef.current) {
        // Position for radial gradient & parallax
        const x = (e.clientX / window.innerWidth - 0.5) * 40; 
        const y = (e.clientY / window.innerHeight - 0.5) * 40; 
        stageRef.current.style.setProperty('--mx', `${x}px`);
        stageRef.current.style.setProperty('--my', `${y}px`);

        // 3D Tilt
        const rotateY = (e.clientX / window.innerWidth - 0.5) * 12; 
        const rotateX = -(e.clientY / window.innerHeight - 0.5) * 12;
        stageRef.current.style.setProperty('--rx', `${rotateX}deg`);
        stageRef.current.style.setProperty('--ry', `${rotateY}deg`);

        // Velocity Glitch
        const now = Date.now();
        const dt = now - lastTime;
        if (dt > 0 && dt < 100) {
          const velocity = Math.abs(e.clientX - lastX) / dt;
          if (velocity > 3) {
            stageRef.current.classList.add('velocity-glitch');
            setTimeout(() => {
              stageRef.current?.classList.remove('velocity-glitch');
            }, 80);
          }
        }
        lastX = e.clientX;
        lastTime = now;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    if (cueRef.current) {
      tl.to(cueRef.current, { opacity: 0, scale: 1.5, filter: 'blur(10px)', ease: 'power2.in', duration: at(0.08) }, 0);
    }
    
    // Action Sequence: Blast through the HUD and Grid on scroll
    if (stageRef.current) {
      const hudEls = stageRef.current.querySelectorAll('.cyberpunk-hud');
      const gridEl = stageRef.current.querySelector('.cyberpunk-grid');
      tl.to(hudEls, { scale: 3, opacity: 0, filter: 'blur(15px)', ease: 'power2.in', duration: at(0.12) }, 0);
      tl.to(gridEl, { scale: 5, opacity: 0, ease: 'power3.in', duration: at(0.15) }, 0);
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

      // Overload Glitch Effect on the Energy Building frame
      if (key === 'energyBuilding') {
        tl.to(
          el,
          { 
            x: () => Math.random() * 8 - 4,
            y: () => Math.random() * 8 - 4,
            filter: 'hue-rotate(90deg) saturate(3) brightness(1.5)',
            duration: 0.05,
            repeat: 20, // Rapid violent shaking
            yoyo: true,
            ease: "rough({ template: none.out, strength: 2, points: 20, taper: none, randomize: true, clamp: false })"
          },
          at(fadeInStart + CROSSFADE)
        );
      }
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
      window.removeEventListener('mousemove', handleMouseMove);
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
            className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#050507] transition-[filter,transform] duration-75"
          >
            <style>{`
              .velocity-glitch {
                filter: hue-rotate(90deg) saturate(2.5) brightness(1.2);
                transform: scale(1.02) skewX(2deg);
              }
            `}</style>
            
            <IntroEmbers intensityRef={emberIntensityRef} />

            {/* Subtle Tech Grid Background */}
            <div className="cyberpunk-grid absolute inset-0 pointer-events-none opacity-10 origin-center" style={{ backgroundImage: 'linear-gradient(rgba(255,122,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,0,1) 1px, transparent 1px)', backgroundSize: '50px 50px', maskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 70%)' }}></div>

            {/* Dynamic Wakandan Spotlight (follows mouse) */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 600px at calc(50% + var(--mx, 0px) * 10) calc(50% + var(--my, 0px) * 10), rgba(255,122,0,0.15), transparent 60%)`,
              }}
            />

            {/* Cyberpunk HUD Overlays */}
            <div className="cyberpunk-hud absolute inset-0 pointer-events-none z-10 flex justify-between p-6 sm:p-10 mix-blend-screen opacity-70 origin-center">
              {/* Left HUD */}
              <div className="flex flex-col gap-4 font-mono text-[0.65rem] text-accent-2/80 tracking-widest uppercase">
                <div className="flex items-center gap-2 font-bold text-accent-2">
                  <div className="w-2 h-2 bg-danger shadow-[0_0_8px_var(--color-danger)] animate-pulse"></div>
                  SYS.ONLINE
                </div>
                <div className="flex flex-col gap-1.5 opacity-80">
                  <span>NEURAL NET: [ACTIVE]</span>
                  <span>CORE TEMP: 34.2°C</span>
                  <span>WAKANDAN_OS v2.4</span>
                </div>
                <div className="mt-auto mb-10 flex flex-col gap-1 opacity-40">
                  <span>0x000F43A</span>
                  <span>0x000F43B</span>
                  <span>0x000F43C</span>
                  <span>0x000F43D</span>
                  <span>0x000F43E</span>
                </div>
              </div>

              {/* Right HUD */}
              <div className="flex flex-col gap-4 font-mono text-[0.65rem] text-accent-2/80 tracking-widest uppercase text-right items-end hidden sm:flex">
                <div className="w-32 h-[2px] bg-accent-2/20 relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-accent-2 w-1/3 animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
                <span className="opacity-80">MEM: 64TB / 128TB</span>
                <span className="opacity-80">UPLINK: SECURE</span>
                
                <div className="mt-auto mb-10 w-20 h-20 border border-accent-2/20 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-2 border border-accent-2/50 rounded-full animate-spin-slow" style={{ borderTopColor: 'transparent', animationDuration: '4s' }}></div>
                  <div className="absolute inset-4 border border-danger/30 rounded-full animate-spin-slow" style={{ borderBottomColor: 'transparent', animationDuration: '6s', animationDirection: 'reverse' }}></div>
                  <div className="w-1.5 h-1.5 bg-accent-2 shadow-[0_0_8px_var(--color-accent-2)] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Parallax Container for the Hologram frames */}
            <div 
              className="absolute inset-0 transition-[transform] duration-75 ease-out will-change-transform"
              style={{ transform: 'perspective(1000px) translate3d(calc(var(--mx, 0px) * -1), calc(var(--my, 0px) * -1), 0) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))' }}
            >
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
            </div>

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
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                opacity: 0,
                background: 'radial-gradient(60% 60% at 50% 45%, var(--accent-2), transparent 70%)',
              }}
            />

            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-30 mix-blend-overlay opacity-30" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%' }}></div>

            <div ref={cueRef} className="absolute inset-x-0 bottom-10 flex justify-center z-40">
              <p className="mono flex items-center gap-2 px-6 py-2 rounded-full border border-accent-2/20 bg-surface/40 backdrop-blur-md text-xs sm:text-sm font-bold tracking-widest shadow-[0_0_15px_rgba(255,122,0,0.2)]" style={{ color: 'var(--accent-2)' }}>
                <span className="opacity-70">&gt; SYS_READY...</span> 
                <span className="text-danger drop-shadow-[0_0_5px_var(--color-danger)]">[ SCROLL TO ENTER ]</span> 
                <span className="animate-pulse w-2 h-4 bg-accent-2 inline-block -mb-0.5"></span>
              </p>
            </div>
          </div>
        </div>
      )}

      <HeroContent ref={heroContentRef} />
    </>
  );
}
