import { Header } from '@/features/site/components/Header';
import { Hero } from '@/features/site/components/Hero';
import { About } from '@/features/site/components/About';
import { Process } from '@/features/site/components/Process';
import { Stack } from '@/features/site/components/Stack';
import { Timeline } from '@/features/site/components/Timeline';
import { Education } from '@/features/site/components/Education';
import { Contact } from '@/features/site/components/Contact';
import { Footer } from '@/features/site/components/Footer';
import { ProjectsSection } from '@/features/projects/components/ProjectsSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Process />
      <Stack />
      <Timeline />
      <Education />
      <ProjectsSection />
      <Contact />
      <Footer />
    </>
  );
}
