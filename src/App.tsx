import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import RouteEffects from './components/RouteEffects';
import DocumentMeta from './components/DocumentMeta';
import Home from './pages/Home';
import WorkDetail from './pages/WorkDetail';
import Privacy from './pages/Privacy';

export default function App() {
  return (
    <>
      <RouteEffects />
      <DocumentMeta />
      <Nav />
      <main id="main-content" role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
