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
  targetPath?: string;
}

const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'system_boot',
    title: 'Contact Footer',
    hint: 'Scroll all the way down to the bottom of the homepage.',
    description: 'You mapped the entire homepage layout.',
    discoveredAt: null,
    targetPath: '/#contact'
  },
  {
    id: 'thermal_overload',
    title: 'Featured Projects',
    hint: 'Hover over a project card on the homepage to unleash its energy.',
    description: 'You triggered the fiery hover state on a project card.',
    discoveredAt: null,
    targetPath: '/#work'
  },
  {
    id: 'xray_protocol',
    title: 'SEOOptimiz Case Study',
    hint: 'Use the Spotlight tool inside the SEOOptimiz project gallery.',
    description: 'You revealed the hidden UI using the X-Ray spotlight.',
    discoveredAt: null,
    targetPath: '/work/seooptimiz'
  },
  {
    id: 'architectural_analysis',
    title: 'Voice AI Architecture',
    hint: 'Hover over the Voice AI architecture diagram nodes to highlight connections.',
    description: 'You interacted with the technical blueprint.',
    discoveredAt: null,
    targetPath: '/work/voice-ai-platform'
  },
  {
    id: 'audio_technician',
    title: 'Voice AI Waveform',
    hint: 'Find and scroll past the real-time audio visualization in the Voice AI project.',
    description: 'You discovered the responsive Audio Waveform.',
    discoveredAt: null,
    targetPath: '/work/voice-ai-platform'
  },
  {
    id: 'stargazer',
    title: 'Shooting Stars',
    hint: 'Stay in the homepage Hero section and watch the sky for 15 seconds.',
    description: 'You watched the multi-colored shooting stars streak by.',
    discoveredAt: null,
    targetPath: '/#top'
  },
  {
    id: 'source_code',
    title: 'GitHub Links',
    hint: 'Find and click a GitHub link to access the raw data.',
    description: 'You clicked a GitHub link to view the actual code.',
    discoveredAt: null,
    targetPath: '/#contact'
  },
  {
    id: 'terminal_hacker',
    title: 'Hidden Terminal',
    hint: 'Press the backtick ( ` ) key on your keyboard anywhere on the site to hack in.',
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
