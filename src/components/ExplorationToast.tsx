import { useExploration } from '../contexts/ExplorationContext';

export default function ExplorationToast() {
  const { toastMilestone, setPanelOpen, percentage } = useExploration();

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] transition-all duration-500 transform ${
        toastMilestone ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
      }`}
    >
      <div 
        onClick={() => setPanelOpen(true)}
        className="flex items-center gap-4 bg-[#111111]/90 backdrop-blur-md border border-[var(--accent)]/40 p-4 rounded-2xl shadow-[0_10px_40px_rgba(255,122,0,0.15)] cursor-pointer hover:border-[var(--accent)] hover:scale-105 transition-all duration-300"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 7L5 11L13 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="pr-2">
          <p className="text-white font-semibold text-sm tracking-tight">{toastMilestone?.title} Decrypted.</p>
          <p className="text-[var(--accent)] text-xs mono mt-0.5 uppercase tracking-widest">{percentage}% Explored</p>
        </div>
      </div>
    </div>
  );
}
