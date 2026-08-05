import { useEffect, useRef } from 'react';

interface Ember {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
}

interface IntroEmbersProps {
  intensityRef: React.RefObject<number>;
}

/**
 * A sparse field of drifting purple embers behind the character frames —
 * pure atmosphere, not story. Density stays constant; brightness and rise
 * speed scale with `intensityRef.current` (0..1, the intro's own scroll
 * progress), written directly from CinematicIntro's ScrollTrigger onUpdate
 * rather than through React state, so this component never re-renders.
 * Mirrors the pause-on-hidden discipline already established in
 * hero/scene.ts.
 */
export default function IntroEmbers({ intensityRef }: IntroEmbersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let embers: Ember[] = [];
    let raf = 0;
    let visible = true;
    let inView = true;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      embers = Array.from({ length: 46 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 2,
        r: 0.8 + Math.random() * 1.8,
        speed: 6 + Math.random() * 14,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function frame(now: number) {
      const intensity = 0.15 + 0.85 * (intensityRef.current ?? 0);
      ctx!.clearRect(0, 0, w, h);
      for (const e of embers) {
        e.y -= (e.speed * intensity) / 60;
        e.x += Math.sin(now * 0.0006 + e.phase) * 0.15;
        if (e.y < -10) {
          e.y = h + 10;
          e.x = Math.random() * w;
        }
        const alpha = 0.18 + 0.5 * intensity;
        ctx!.fillStyle = `rgba(196, 132, 252, ${alpha})`;
        ctx!.beginPath();
        ctx!.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (raf) return;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function sync() {
      if (visible && inView) start();
      else stop();
    }

    resize();
    sync();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Same pause discipline as hero/scene.ts: stop the rAF loop entirely
    // once this canvas scrolls well out of view (the intro sits above
    // everything else, so once the user reaches Projects/Skills there is
    // no reason to keep animating 46 particles nobody can see) or the tab
    // is hidden — not just visually idle, actually not ticking.
    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              inView = entries.some((e) => e.isIntersecting);
              sync();
            },
            { rootMargin: '200px' },
          )
        : null;
    observer?.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
      sync();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intensityRef]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}
