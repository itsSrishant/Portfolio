import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MilestoneId = 
  | 'system_boot'
  | 'thermal_overload'
  | 'xray_protocol'
  | 'architectural_analysis'
  | 'audio_technician'
  | 'stargazer'
  | 'source_code'
  | 'terminal_hacker'; 

export interface Milestone {
  id: MilestoneId;
  title: string;
  hint: string;
  description: string;
  discoveredAt: number | null;
}

const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'system_boot',
    title: 'System Boot',
    hint: 'Scroll to the deepest layer of the interface.',
    description: 'You reached the footer and mapped the entire homepage.',
    discoveredAt: null
  },
  {
    id: 'thermal_overload',
    title: 'Thermal Overload',
    hint: 'Apply maximum energy to a featured project.',
    description: 'You triggered the fiery hover state on a project card.',
    discoveredAt: null
  },
  {
    id: 'xray_protocol',
    title: 'X-Ray Protocol',
    hint: 'Use the spotlight in the SEOOptimiz study.',
    description: 'You revealed the hidden UI using the X-Ray spotlight.',
    discoveredAt: null
  },
  {
    id: 'architectural_analysis',
    title: 'Architectural Analysis',
    hint: 'Examine the technical blueprint.',
    description: 'You highlighted a specific node in the Architecture Diagram.',
    discoveredAt: null
  },
  {
    id: 'audio_technician',
    title: 'Audio Technician',
    hint: 'Observe the real-time visualization.',
    description: 'You discovered the responsive Audio Waveform.',
    discoveredAt: null
  },
  {
    id: 'stargazer',
    title: 'Stargazer',
    hint: 'Observe the sky for 15 seconds.',
    description: 'You watched the multi-colored shooting stars streak by.',
    discoveredAt: null
  },
  {
    id: 'source_code',
    title: 'Source Code Extraction',
    hint: 'Access the raw data.',
    description: 'You clicked a GitHub link to view the actual code.',
    discoveredAt: null
  },
  {
    id: 'terminal_hacker',
    title: 'Terminal Hacker',
    hint: 'Use the keyboard combination.',
    description: 'You discovered the hidden Terminal Easter Egg.',
    discoveredAt: null
  }
];

interface ExplorationContextType {
  milestones: Milestone[];
  unlockMilestone: (id: MilestoneId) => void;
  isPanelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  discoveredCount: number;
  totalCount: number;
  percentage: number;
  toastMilestone: Milestone | null;
}

const ExplorationContext = createContext<ExplorationContextType | undefined>(undefined);

export function ExplorationProvider({ children }: { children: ReactNode }) {
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('portfolio_exploration');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return INITIAL_MILESTONES.map(m => {
          const savedM = parsed.find((p: any) => p.id === m.id);
          return savedM ? { ...m, discoveredAt: savedM.discoveredAt } : m;
        });
      } catch (e) {
        return INITIAL_MILESTONES;
      }
    }
    return INITIAL_MILESTONES;
  });

  const [isPanelOpen, setPanelOpen] = useState(false);
  const [toastMilestone, setToastMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    localStorage.setItem('portfolio_exploration', JSON.stringify(milestones.map(m => ({ id: m.id, discoveredAt: m.discoveredAt }))));
  }, [milestones]);

  const unlockMilestone = (id: MilestoneId) => {
    setMilestones(prev => {
      const milestone = prev.find(m => m.id === id);
      if (milestone && !milestone.discoveredAt) {
        const updated = prev.map(m => m.id === id ? { ...m, discoveredAt: Date.now() } : m);
        setToastMilestone({ ...milestone, discoveredAt: Date.now() });
        setTimeout(() => setToastMilestone(null), 5000);
        return updated;
      }
      return prev;
    });
  };

  const discoveredCount = milestones.filter(m => m.discoveredAt !== null).length;
  const totalCount = milestones.length;
  const percentage = Math.round((discoveredCount / totalCount) * 100);

  return (
    <ExplorationContext.Provider 
      value={{ 
        milestones, 
        unlockMilestone, 
        isPanelOpen, 
        setPanelOpen,
        discoveredCount,
        totalCount,
        percentage,
        toastMilestone
      }}
    >
      {children}
    </ExplorationContext.Provider>
  );
}

export function useExploration() {
  const context = useContext(ExplorationContext);
  if (context === undefined) {
    throw new Error('useExploration must be used within an ExplorationProvider');
  }
  return context;
}
