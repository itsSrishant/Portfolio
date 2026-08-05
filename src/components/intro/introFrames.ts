interface FrameAsset {
  desktop: string;
  mobile: string;
}

export type IntroFrameKey =
  | 'rest'
  | 'awakening'
  | 'gestureBegins'
  | 'energyBuilding'
  | 'dissolve'
  | 'curtain';

/**
 * Centralised asset lookup — components never reference literal filenames.
 * These are placeholder paths (see public/assets/portfolio-intro/README.md);
 * swapping in final art is a matter of replacing the files at these exact
 * paths, not a code change.
 */
export const introFrames: Record<IntroFrameKey, FrameAsset> = {
  rest: {
    desktop: '/assets/portfolio-intro/frame-1-rest.webp',
    mobile: '/assets/portfolio-intro/frame-1-rest-mobile.webp',
  },
  awakening: {
    desktop: '/assets/portfolio-intro/frame-2-awakening.webp',
    mobile: '/assets/portfolio-intro/frame-2-awakening-mobile.webp',
  },
  gestureBegins: {
    desktop: '/assets/portfolio-intro/frame-3-gesture.webp',
    mobile: '/assets/portfolio-intro/frame-3-gesture-mobile.webp',
  },
  energyBuilding: {
    desktop: '/assets/portfolio-intro/frame-4-energy.webp',
    mobile: '/assets/portfolio-intro/frame-4-energy-mobile.webp',
  },
  dissolve: {
    desktop: '/assets/portfolio-intro/frame-5-dissolve.webp',
    mobile: '/assets/portfolio-intro/frame-5-dissolve-mobile.webp',
  },
  curtain: {
    desktop: '/assets/portfolio-intro/frame-6-curtain.webp',
    mobile: '/assets/portfolio-intro/frame-6-curtain-mobile.webp',
  },
};
