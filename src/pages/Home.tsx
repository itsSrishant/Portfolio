import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import { useReveal } from '../hooks/useReveal';

export default function Home() {
  // Scoped to whatever's actually mounted under this route — Home unmounts
  // when the reader navigates to a case study and remounts on the way
  // back, so this re-observes the current DOM's [data-reveal] elements
  // each time rather than needing to be told the route changed.
  useReveal();

  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
}
