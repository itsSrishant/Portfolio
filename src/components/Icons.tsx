type IconProps = { className?: string };

const base = 'h-[18px] w-[18px]';

export function GitHubIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`${base} ${className}`}>
      <path d="M12 .5C5.73.5.66 5.58.66 11.85c0 5.02 3.25 9.27 7.76 10.77.57.1.78-.24.78-.54v-1.9c-3.16.69-3.83-1.53-3.83-1.53-.51-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.66 1.24 3.31.95.1-.74.4-1.24.72-1.53-2.52-.29-5.18-1.27-5.18-5.63 0-1.25.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.13-1.17 3.13-1.17.63 1.57.24 2.73.12 3.02.73.8 1.17 1.81 1.17 3.06 0 4.37-2.67 5.33-5.2 5.62.41.35.78 1.05.78 2.12v3.15c0 .3.2.65.79.54a11.36 11.36 0 0 0 7.75-10.77C23.34 5.58 18.27.5 12 .5Z" />
    </svg>
  );
}

export function LinkedInIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`${base} ${className}`}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function MailIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`${base} ${className}`}
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 7 7.6 5.4a1.6 1.6 0 0 0 1.8 0L20.5 7" />
    </svg>
  );
}

export function ArrowIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-4 w-4 ${className}`}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
