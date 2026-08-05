# Design record

## Who this is for

Srishant Kulkarni — B.E. Artificial Intelligence & Data Science student (VESIT Mumbai,
CGPA 9.96/10, expected 2029) who has shipped real production software as an
AI/Software Development Intern at PlatinumOne Business Services.

The single sentence the site has to land: **"I am a student, but I build real things."**

Two audiences, one page: a recruiter skimming for evidence in 30 seconds, and an
engineer who wants to know whether the work is real.

## The scene

A research instrument in a dark lab at night. A portrait sits behind glass, lit like a
specimen. Move across it and the glass becomes a viewport onto the machine running
underneath — a live signal graph, a speech pipeline, a retrieval index. The person and
the system are the same object seen at two depths.

That scene forces the theme: **dark**. Not "dark because dev tools look cool dark" —
dark because the reveal is an *emission*, and emission needs an unlit surface to read
against.

## Color strategy: restrained, with the color quarantined

The page is effectively monochrome — near-black surfaces, off-white type, hairline
rules — with a single warm accent family (orange/amber) instead of the cooler
violet/cyan pair from an earlier pass. **Accent and accent-2 appear sparingly in the
page chrome**, mostly on primary actions, focus rings, and the live status dot, and
they leak fully loose inside the spacecraft hero, which renders as an instrument-panel
emission against the dark cabin.

This is the POV. The common failure for an "AI portfolio" is neon gradients on every
card, which makes the palette meaningless. Here, color *means* something: warm light is
the machine's own instrumentation, not decoration layered on top of it.

Named reference: Vercel-grade near-monochrome for the page, warm instrument emission
(amber cockpit glow, not cool sci-fi blue) for the accent and the hero canvas.

| Token | OKLCH | Role |
|---|---|---|
| `--bg` | `oklch(0.16 0.006 40)` | Page surface, near-black with a trace of warm amber |
| `--surface` | `oklch(0.2 0.008 40)` | Raised panels |
| `--ink` | `oklch(0.97 0.004 60)` | Primary type |
| `--ink-2` | `oklch(0.79 0.01 55)` | Secondary type — 6.4:1 on `--bg` |
| `--ink-3` | `oklch(0.66 0.012 50)` | Muted labels — 5.0:1 on `--bg` |
| `--line` | `oklch(0.32 0.014 40)` | Hairlines |
| `--accent` | `oklch(0.72 0.16 45)` | Primary actions, the machine's warm signal (orange) |
| `--accent-2` | `oklch(0.78 0.13 75)` | Secondary signal / data in motion (amber) |

Every text pairing clears WCAG AA. Muted type never drops below `--ink-3`.

## Typography

Voice words: **precise, quiet, instrumented.**

Reflex picks (Inter, Space Grotesk, IBM Plex) were rejected — they are the training-data
default for this exact brief, and two of them are on the reflex-reject list.

- **Schibsted Grotesk** — display and body. A sharp Scandinavian grotesque with slightly
  narrow, engineered forms. It has real presence at 5rem for the name and stays plain and
  legible at 17px for body copy, so one family carries the page through weight contrast
  (400 / 500 / 700) rather than a timid display+body pair.
- **Geist Mono** — technical labels only: HUD readouts, the pipeline stages, tech tags,
  section indices. The brand genuinely is technical, so mono is instrumentation and not
  costume. It never sets a sentence.

Display letter-spacing bottoms out at `-0.03em`; hero clamp maxes at `5.6rem`.

## Section cadence

No uppercase eyebrow above every heading — that is AI scaffolding. Instead each section
is introduced by a hairline rule with a single mono index and title on one line, and the
sections are deliberately given *different* treatments so the page doesn't read as one
card grid repeated seven times:

- **Hero** — full viewport, canvas-driven.
- **How it works** — a genuine 4-step sequence, so numbers are earned here.
- **About** — prose column, no cards.
- **Experience** — one detailed entry, a ledger row rather than a card.
- **Projects** — a single full-width case study, not a grid of one.
- **Skills** — a dense typographic table.
- **Exploring** — an inline flowing list.
- **Contact** — oversized type, minimal chrome.

## The hero interaction

Everything composites in **one 2D canvas** with one `requestAnimationFrame` loop. No
WebGL, no Three.js, no animation library — the effect is a compositing problem, not a 3D
one, and this keeps the JS bundle small and the frame budget predictable.

Per frame:

1. Draw the pre-treated portrait plate (treated once at load, never per frame).
2. `destination-out` a soft, organic aperture at the pointer → punches a feathered hole.
3. `destination-over` the AI world → the machine fills the hole exactly.
4. `source-over` the aperture rim, so the opening reads as a lens and not a cutout.

The aperture is **not a circle**. Three offset radial lobes, each drifting on its own
slow sine, so the opening breathes and never repeats a frame. Position is critically
damped toward the pointer, so it trails without jitter or overshoot.

**No pointer is still a state.** Before first interaction — and on any device without a
mouse — the aperture drifts along a slow Lissajous path, so the effect is alive on load
and on touch. Pointer or touch input takes over instantly; after 2.6s of stillness,
ambient drift resumes. This is why mobile needs no separate implementation: touch-drag
and idle drift are the same code path.

Portrait and AI layer parallax against each other by a few pixels, which is what sells
the aperture as depth rather than as a mask.

### Card tilt — a second, independent layer of depth

On top of the aperture's own 2D reveal, the whole card leans in 3D toward a mouse or
trackpad (`src/hooks/useTilt.ts`): a CSS `perspective` on the frame's parent, `rotateX` /
`rotateY` / `scale` on the frame itself, driven by direct DOM writes to CSS custom
properties rather than React state — at pointermove frequency a re-render would be wasted
work for something purely visual. A soft highlight pans opposite the tilt via `transform`
only (never a gradient repaint), so the card reads as a lit pane of glass rather than a
photo pinned to a hinge.

Peak tilt is ~6.5°, tuned deliberately restrained — this is a supporting cue, not the
headline interaction. It is gated to `(hover: hover) and (pointer: fine)` and to
`prefers-reduced-motion: no-preference`, for two different reasons: an untilted card on
touch would fight the same drag gesture that already drives the aperture, and a tilt with
no hover to drive it is just an inert transform sitting on the page.

## Reduced motion

`prefers-reduced-motion: reduce` is a real branch, not a disabled feature. The canvas
stops animating and settles into a single composed still — the aperture open low and
right, over the voice envelope and the speech pipeline — so the *idea* survives without
movement. Scroll reveals become instant, and the hero caption changes to match, because
telling a reduced-motion visitor to "move across the portrait" promises an interaction
they will not get.

Scroll reveals never gate content. The hidden start state is scoped to an attribute that
JavaScript sets, so if the script fails nothing is ever hidden; automated renderers
(`navigator.webdriver`) and print both skip straight to the finished state. This was a
real bug caught in review — the first headless capture of this page came back blank below
the fold.

This is a client-rendered React app, so it does need JavaScript to paint. Within that, the
portrait also exists as a plain `<img>` beneath the canvas, which carries the alt text and
covers the moment before the scene boots or the case where a 2D context is unavailable.
The aperture is keyboard-drivable with the arrow keys once the canvas has focus.

## Content rules

No invented achievements, hackathons, certificates, or statistics. Anything not supplied
is a marked placeholder in `src/data/profile.ts`. Employer-internal detail (model
vendors, client names) is deliberately kept out; the internship is described at the level
of architecture and responsibility only.
