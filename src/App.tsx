import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import RouteEffects from './components/RouteEffects';
import DocumentMeta from './components/DocumentMeta';
import VectorCursor from './components/VectorCursor';
import TerminalEasterEgg from './components/TerminalEasterEgg';
import Home from './pages/Home';
import WorkDetail from './pages/WorkDetail';
import Privacy from './pages/Privacy';
import { ExplorationProvider } from './contexts/ExplorationContext';
import ExplorationPanel from './components/ExplorationPanel';
import ExplorationToast from './components/ExplorationToast';

export default function App() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.querySelectorAll('.btn').forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (btn as HTMLElement).style.setProperty('--x', `${x}px`);
        (btn as HTMLElement).style.setProperty('--y', `${y}px`);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <ExplorationProvider>
      <RouteEffects />
      <DocumentMeta />
      <VectorCursor />
      <TerminalEasterEgg />
      <Nav />
      <main id="main-content" role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <Footer />
      <ExplorationPanel />
      <ExplorationToast />
    </ExplorationProvider>
  );
}
