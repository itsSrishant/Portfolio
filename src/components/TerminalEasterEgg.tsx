import { useEffect, useState, useRef } from 'react';

export default function TerminalEasterEgg() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{type: 'cmd' | 'out', text: string}[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open terminal on ` or ~ press
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsOpen((prev) => {
           if (!prev) {
             setTimeout(() => inputRef.current?.focus(), 100);
           }
           return !prev;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, { type: 'cmd' as const, text: `guest@portfolio:~$ ${input}` }];
    
    if (cmd === 'help') {
      newHistory.push({ type: 'out', text: 'Commands: help, about, contact, clear, sudo, exit' });
    } else if (cmd === 'about') {
      newHistory.push({ type: 'out', text: 'Srishant — AI & Software Engineer building intelligent systems.' });
    } else if (cmd === 'contact') {
      newHistory.push({ type: 'out', text: 'Redirecting to contact section...' });
      window.location.hash = '#contact';
      setIsOpen(false);
    } else if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (cmd === 'sudo') {
      newHistory.push({ type: 'out', text: 'Nice try! Access denied.' });
    } else if (cmd === 'exit') {
      setIsOpen(false);
    } else if (cmd !== '') {
      newHistory.push({ type: 'out', text: `Command not found: ${cmd}` });
    }
    
    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-bg/90 backdrop-blur-md flex flex-col p-6 sm:p-12 font-mono text-accent-2 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl mx-auto h-full max-h-[70vh] mt-10 flex flex-col border border-accent-2/30 rounded-lg bg-surface/50 p-4 shadow-[0_0_50px_rgba(255,122,0,0.15)] shadow-accent-2/20">
        <div className="flex items-center gap-2 mb-4 border-b border-line-soft pb-3">
          <div className="w-3 h-3 rounded-full bg-danger"></div>
          <div className="w-3 h-3 rounded-full bg-accent-2"></div>
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <span className="text-xs text-ink-3 ml-2 font-medium">sys_terminal_v1.0 (guest)</span>
          <button onClick={() => setIsOpen(false)} className="ml-auto text-ink-3 hover:text-ink text-xs transition-colors">esc to close</button>
        </div>
        <div className="flex-1 overflow-auto no-scrollbar space-y-2 text-sm md:text-base">
          <p className="text-ink-3 mb-4">Welcome to the hidden terminal. Type 'help' to see available commands.</p>
          {history.map((line, i) => (
            <p key={i} className={line.type === 'cmd' ? 'text-ink' : 'text-accent-2 opacity-80'}>{line.text}</p>
          ))}
          <form onSubmit={handleSubmit} className="flex items-center mt-2">
            <span className="text-ink mr-2">guest@portfolio:~$</span>
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-accent-2 placeholder-ink-3/30"
              autoFocus
              spellCheck={false}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
