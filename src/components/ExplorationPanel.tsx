import { useExploration } from '../contexts/ExplorationContext';
import { useEffect } from 'react';

export default function ExplorationPanel() {
  const { milestones, isPanelOpen, setPanelOpen, percentage, discoveredCount, totalCount } = useExploration();

  useEffect(() => {
    if (isPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isPanelOpen]);

  if (!isPanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500"
        onClick={() => setPanelOpen(false)}
        aria-hidden="true"
      />

      {/* Side Panel */}
      <div className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-bg-deep/95 border-l border-white/10 shadow-2xl z-[101] flex flex-col p-6 md:p-10 overflow-y-auto transform transition-transform duration-500 shadow-[0_0_80px_rgba(255,122,0,0.1)]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-heading font-semibold text-ink tracking-tight flex items-center gap-2">
              <span className="text-[var(--accent)]">✦</span>
              EXPLORATION INDEX
            </h2>
            <p className="text-ink-3 text-sm mono tracking-widest uppercase mt-2">
              {percentage === 100 ? 'SYSTEM MASTERED' : 'Decrypting telemetry...'}
            </p>
          </div>
          <button 
            onClick={() => setPanelOpen(false)}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-ink-2 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close panel"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-3">
            <span className="text-3xl font-heading font-semibold text-white">{percentage}%</span>
            <span className="text-ink-3 text-xs mono tracking-widest">{discoveredCount} / {totalCount} FOUND</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 h-full bg-[var(--accent)] transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_var(--accent)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Intro Description */}
        <p className="text-ink-2 text-[0.9rem] leading-relaxed mb-8 bg-surface/30 p-4 rounded-xl border border-white/5">
          This portfolio is a living system. Discover interactive components, hidden features, and unique UI states by exploring the site. 
          <br/><br/>
          <span className="text-accent/80 text-xs uppercase mono tracking-widest font-semibold">Tip: Click on any module below to investigate its location.</span>
        </p>

        {/* Milestones List */}
        <div className="flex flex-col gap-4 flex-1">
          {milestones.map((milestone) => {
            const isDiscovered = milestone.discoveredAt !== null;
            
            return (
              <a 
                key={milestone.id}
                href={milestone.targetPath || '#'}
                onClick={(e) => {
                  if (!milestone.targetPath) e.preventDefault();
                  else setPanelOpen(false); // Close panel when navigating
                }}
                className={`relative p-5 rounded-2xl border transition-all duration-500 block ${
                  isDiscovered 
                    ? 'border-[var(--accent)]/30 bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/50 cursor-pointer' 
                    : milestone.targetPath ? 'border-white/5 bg-white/5 opacity-60 hover:opacity-100 hover:border-white/20 cursor-pointer' : 'border-white/5 bg-white/5 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-500 ${
                    isDiscovered 
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-bg-deep' 
                      : 'border-white/20'
                  }`}>
                    {isDiscovered && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold tracking-tight ${isDiscovered ? 'text-white' : 'text-ink-2'}`}>
                      {isDiscovered ? milestone.title : '[ ENCRYPTED ]'}
                    </h3>
                    <p className={`text-sm mt-1.5 leading-relaxed ${isDiscovered ? 'text-ink-2' : 'text-ink-3 mono tracking-tight text-[0.75rem]'}`}>
                      {isDiscovered ? milestone.description : milestone.hint}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
