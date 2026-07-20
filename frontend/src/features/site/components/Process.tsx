import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { SectionHeading } from '@/components/SectionHeading';
import { defaultViewport, staggerContainer, staggerItem } from '@/lib/motion';
import { PROCESS } from '../data/content';

export function Process() {
  return (
    <section id="metodologia" className="relative z-2 scroll-mt-24 py-20 md:py-28">
      <div className="layout">
        <SectionHeading
          eyebrow="Processo"
          title="Como eu desenvolvo"
          subtitle="Um caminho claro, do primeiro requisito ao container em producao."
        />

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {PROCESS.map((step, index) => (
            <motion.li
              key={step.title}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="group panel relative overflow-hidden p-6 transition-colors hover:border-line-strong hover:[box-shadow:var(--shadow-neon-glow-strong)]"
            >
              <span
                aria-hidden="true"
                className="absolute top-4 right-5 font-display text-4xl font-extrabold text-white/4 transition-colors duration-300 group-hover:text-neon/12"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="mb-4 inline-flex size-11 items-center justify-center rounded-lg bg-bg-subtle text-neon [box-shadow:var(--shadow-neon-border)] transition-transform duration-300 group-hover:scale-110">
                <Icon name={step.icon} className="size-5" />
              </span>

              <h3 className="mb-2 font-display text-[1.05rem] font-bold">{step.title}</h3>
              <p className="text-sm leading-relaxed font-light text-fg-muted">{step.text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
