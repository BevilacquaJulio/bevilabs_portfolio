import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { TechBadge } from '@/components/Badge';
import { SectionHeading } from '@/components/SectionHeading';
import { defaultViewport, staggerContainer, staggerItem } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { STACK } from '../data/content';

export function Stack() {
  return (
    <section id="stack" className="relative z-2 scroll-mt-24 py-20 md:py-28">
      <div className="layout">
        <SectionHeading
          eyebrow="Stack"
          title="Tecnologias que uso"
          subtitle="Um unico ecossistema, do banco de dados a interface: TypeScript em todas as camadas."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {STACK.map((group) => (
            <motion.article
              key={group.title}
              variants={staggerItem}
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className={cn(
                'group flex flex-col rounded-2xl border p-6 transition-colors duration-300',
                group.accent
                  ? 'border-neon/25 bg-bg-elevated [box-shadow:var(--shadow-accent-border-soft)] hover:border-neon/45'
                  : 'border-line bg-bg-elevated [box-shadow:var(--shadow-neon-border)] hover:border-line-strong',
              )}
            >
              <header className="mb-5 flex items-center gap-3">
                <span
                  className={cn(
                    'inline-flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110',
                    group.accent ? 'bg-neon-soft text-neon' : 'bg-bg-subtle text-fg',
                  )}
                >
                  <Icon name={group.icon} className="size-5" />
                </span>
                <h3 className="font-display text-[1.05rem] font-bold">{group.title}</h3>
              </header>

              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <TechBadge accent={group.accent}>{item}</TechBadge>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
