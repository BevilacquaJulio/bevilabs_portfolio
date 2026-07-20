import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { normalizeProjectIcon } from '@/components/project-icons';
import { staggerItem } from '@/lib/motion';
import type { Project } from '../projects.types';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article variants={staggerItem} whileHover={{ y: -6 }} className="h-full">
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir projeto ${project.title}`}
        className="group panel flex h-full flex-col p-6 transition-all duration-300 hover:border-neon/35 hover:[box-shadow:var(--shadow-accent-border-soft)]"
      >
        <span className="mb-4 inline-flex size-11 items-center justify-center rounded-lg bg-bg-subtle text-neon [box-shadow:var(--shadow-neon-border)] transition-transform duration-300 group-hover:scale-110">
          <Icon name={normalizeProjectIcon(project.icon)} className="size-5" />
        </span>

        <h3 className="mb-2 font-display text-[1.05rem] leading-snug font-bold">{project.title}</h3>

        <p className="text-sm leading-relaxed font-light text-fg-muted">{project.description}</p>

        <span
          aria-hidden="true"
          className="mt-4 inline-flex items-center gap-1 text-[0.8rem] font-medium text-fg-subtle transition-all duration-300 group-hover:gap-2 group-hover:text-neon"
        >
          Acessar
          <Icon name="arrowUpRight" className="size-3.5" />
        </span>
      </a>
    </motion.article>
  );
}
