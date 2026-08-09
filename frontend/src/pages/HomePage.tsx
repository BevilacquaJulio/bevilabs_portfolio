import { CursorFollower } from '@/features/site/shell/CursorFollower';
import { SectionRail } from '@/features/site/components/SectionRail';
import { Header } from '@/features/site/components/Header';
import { Hero } from '@/features/site/components/Hero';
import { TechStack } from '@/features/site/components/TechStack';
import { Journey } from '@/features/site/components/Journey';
import { About } from '@/features/site/components/About';
import { Contact } from '@/features/site/components/Contact';
import { Footer } from '@/features/site/components/Footer';
import { ProjectsSection } from '@/features/projects/components/ProjectsSection';

/**
 * Seis seções, nesta ordem:
 * abertura, prova, ferramenta, histórico, pessoa, canal.
 *
 * O cursor próprio vive aqui, e não no App, porque no painel administrativo
 * um ponteiro customizado atrapalha mais do que ajuda.
 */
export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <CursorFollower />
      <Header />
      <SectionRail />
      <main id="conteudo">
        <Hero />
        <ProjectsSection />
        <TechStack />
        <Journey />
        <About />
        <Contact />
      </main>
      <div id="site-footer">
        <Footer />
      </div>
    </>
  );
}
