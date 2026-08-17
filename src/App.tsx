import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import RouteEffects from './components/RouteEffects';
import Home from './pages/Home';
import WorkDetail from './pages/WorkDetail';

export default function App() {
  return (
    <>
      <RouteEffects />
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
