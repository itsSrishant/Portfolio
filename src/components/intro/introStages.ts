/**
 * The one source of truth for the cinematic intro's choreography.
 *
 * This used to be scroll-scrubbed (STAGE fractions mapped to how far the
 * visitor had physically scrolled), which meant seeing the whole sequence
 * took several screen-heights of continuous scrolling. It's now a single
 * scroll-triggered *autoplay*: one scroll/tap/keypress starts a fixed-length
 * timeline that plays through on its own, and scroll unlocks once it
 * finishes. STAGE fractions are now fractions of DURATION (wall-clock
 * seconds), not scroll distance — everything else about how they're used
 * (crossfade windows, the curtain split) stays the same shape.
 */
export const DURATION = 1.1;

/**
 * The curtain split (curtainBegin to curtainEnd) gets the biggest single
 * share of the timeline — 0.25s, more than any individual story frame —
 * since it's the last image the visitor sees before the hero. The five
 * story frames (rest through dissolve) evenly split 0.75s (0.15s each),
 * and the final overlay-fade takes the remaining 0.1s.
 */
export const STAGE = {
  rest: 0,
  awakening: 0.1364,
  gestureBegins: 0.2727,
  energyBuilding: 0.4091,
  dissolve: 0.5455,
  curtainBegin: 0.6818,
  curtainEnd: 0.9091,
} as const;

/** Fraction of DURATION each crossfade transition spans. */
export const CROSSFADE = 0.06;
