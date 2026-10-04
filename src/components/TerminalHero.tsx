import { useEffect, useState, useRef } from 'react';
import { getLenisInstance } from '../lib/smoothScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BOOT_LOGS = [
  "bios_checksum: VERIFIED",
  "mounting /dev/core... [OK]",
  "loading kernel modules... [OK]",
  "initializing RAG pipeline... [OK]",
  "establishing neural link... [OK]",
  "connecting to primary datastore... [OK]",
  "loading workspace parameters...",
  "SYSTEM ONLINE.",
];

export default function TerminalHero() {
  const [booting, setBooting] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isActive = true;
    
    // Lock scroll during boot
    if (booting) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      getLenisInstance()?.stop();
    }

    const unlockScroll = () => {
      document.documentElement.setAttribute('data-hero-revealed', 'true');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      getLenisInstance()?.start();
      // Give the DOM a frame to settle, then refresh all GSAP triggers (fixes Experience line)
      setTimeout(() => ScrollTrigger.refresh(), 50);
    };

    const runBootSequence = async () => {
      // Temporarily always show boot sequence for development
      // if (sessionStorage.getItem('booted')) {
      //   setBooting(false);
      //   unlockScroll();
      //   return;
      // }
      
      for (let i = 0; i < BOOT_LOGS.length; i++) {
        if (!isActive) break;
        // Fast random typing delays between 80ms and 250ms
        await new Promise(r => setTimeout(r, Math.random() * 150 + 50));
        setLogs(prev => [...prev, BOOT_LOGS[i]]);
      }
      
      if (!isActive) return;
      await new Promise(r => setTimeout(r, 600)); // Pause on SYSTEM ONLINE
      sessionStorage.setItem('booted', 'true');
      setBooting(false);
      unlockScroll();
    };

    runBootSequence();

    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current && !booting) {
        const rect = spotlightRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spotlightRef.current.style.setProperty('--x', `${x}px`);
        spotlightRef.current.style.setProperty('--y', `${y}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      isActive = false;
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [booting]);

  if (!booting) return null;

  return (
    <div className="fixed inset-0 h-screen w-full bg-bg-deep flex flex-col justify-end p-8 font-mono text-accent-2 text-[0.85rem] md:text-base z-[100] overflow-hidden">
      {/* Terminal Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-40 mix-blend-overlay"></div>
      
      <div className="relative z-10">
        {logs.map((log, i) => (
          <div key={i} className="mb-2 uppercase opacity-90 tracking-widest">
            <span className="text-ink-3">[{new Date().toISOString()}]</span> {log}
          </div>
        ))}
        <div className="animate-pulse mt-4 bg-accent-2 w-3 h-5 shadow-[0_0_10px_var(--color-accent-2)]"></div>
      </div>
    </div>
  );
}
