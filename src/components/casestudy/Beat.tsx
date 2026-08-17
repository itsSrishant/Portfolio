import type { ReactNode } from 'react';

/**
 * The numbered section chrome shared by every case study — extracted once
 * both Voice AI and SEOOptimiz needed the identical wrapper, rather than
 * copy-pasting it a second time.
 */
export default function Beat({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <div className="border-line-soft border-t pt-12 pb-12 first:border-t-0 first:pt-0">
      <div className="border-line-soft bg-surface inline-flex items-center gap-3 rounded-xl border px-4 py-2.5">
        <span className="mono text-accent">{String(index).padStart(2, '0')}</span>
        <span className="text-ink text-[0.95rem] font-medium">{title}</span>
      </div>
      {children}
    </div>
  );
}
