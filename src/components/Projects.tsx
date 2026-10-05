import Section from './Section';
import { projects } from '../data/profile';
import ThreeHallwayGallery from './ThreeHallwayGallery';

export default function Projects() {
  return (
    <Section id="projects" title="Featured work">
      <div className="w-full relative rounded-3xl overflow-hidden border border-line-soft">
        <ThreeHallwayGallery projects={projects} />
      </div>
    </Section>
  );
}
