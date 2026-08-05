import { useEffect, type RefObject } from 'react';

interface TiltOptions {
  /** Peak rotation in degrees at the frame's edge. */
  max?: number;
  /** Scale applied while tracking, for a subtle "lift toward the cursor". */
  scale?: number;
}

/**
 * Pointer-driven 3D tilt for the element `ref` points to.
 *
 * Gated to fine, hover-capable input (mouse/trackpad/hovering pen) and to
 * `prefers-reduced-motion: no-preference`. Two reasons, not one:
 *
 *   - A tilted card with no hover to drive it is just an inert perspective
 *     transform sitting on the page.
 *   - On touch there is no hover to lean toward in the first place — the
 *     reveal there is a tap toggle instead (see ProfileReveal.tsx), so
 *     tilting the whole card on every tap would just be motion for its
 *     own sake.
 *
 * Reads and writes the DOM directly rather than through React state: at
 * pointermove frequency a state-driven re-render would be wasted work for a
 * change that is purely visual, and CSS custom properties plus a `transition`
 * on `transform` give the settle-back easing for free.
 */
export function useTilt(ref: RefObject<HTMLElement | null>, options: TiltOptions = {}) {
  const { max = 6.5, scale = 1.018 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = fine.matches && !reduce.matches;

    function reset() {
      el!.style.setProperty('--rx', '0');
      el!.style.setProperty('--ry', '0');
      el!.style.setProperty('--tilt-scale', '1');
      el!.classList.remove('is-tracking');
    }

    function onCapabilityChange() {
      active = fine.matches && !reduce.matches;
      if (!active) reset();
    }

    function onMove(e: PointerEvent) {
      if (!active || e.pointerType === 'touch') return;
      const r = el!.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      el!.style.setProperty('--ry', (nx * max * 2).toFixed(2));
      el!.style.setProperty('--rx', (-ny * max * 2).toFixed(2));
      el!.style.setProperty('--tilt-scale', String(scale));
      el!.classList.add('is-tracking');
    }

    fine.addEventListener('change', onCapabilityChange);
    reduce.addEventListener('change', onCapabilityChange);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
    el.addEventListener('pointercancel', reset);

    return () => {
      fine.removeEventListener('change', onCapabilityChange);
      reduce.removeEventListener('change', onCapabilityChange);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', reset);
      el.removeEventListener('pointercancel', reset);
      reset();
    };
  }, [ref, max, scale]);
}
