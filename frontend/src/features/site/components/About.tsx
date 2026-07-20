import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { StatusBadge } from '@/components/Badge';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { defaultViewport, staggerContainer, staggerItem } from '@/lib/motion';
import { ABOUT, ABOUT_STATS, PROFILE } from '../data/content';

export function About() {
  return (
    <section id="sobre" className="relative z-2 scroll-mt-24 py-20 md:py-28">
      <div className="layout">
        <SectionHeading id="sobre-title" title={ABOUT.title} subtitle={ABOUT.subtitle} />

        <Reveal className="panel p-6 md:p-10">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
            <div className="relative shrink-0" aria-hidden="true">
              <motion.span
                className="absolute -inset-2 rounded-full border border-neon/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              />
              <span className="flex size-24 items-center justify-center rounded-full bg-bg-subtle font-display text-2xl font-extrabold text-neon [box-shadow:var(--shadow-accent-glow)] md:size-28 md:text-3xl">
                {PROFILE.initials}
              </span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <StatusBadge className="mb-4">{ABOUT.badge}</StatusBadge>

              <h3 className="font-display text-2xl font-extrabold tracking-[-0.02em] md:text-3xl">
                {PROFILE.name}
              </h3>
              <p className="mt-1 text-[0.95rem] font-medium text-neon">{PROFILE.roleLong}</p>

              <span className="mt-3 inline-flex items-center gap-2 text-sm text-fg-muted">
                <Icon name="pin" className="size-4 shrink-0" />
                {PROFILE.location}
              </span>

              <div className="mt-6 flex flex-col gap-4 text-left text-[0.95rem] leading-[1.75] font-light text-fg-muted">
                {ABOUT.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          {ABOUT_STATS.map((stat) => (
            <motion.li
              key={stat.label}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="panel flex flex-col items-center gap-1.5 px-4 py-6 text-center transition-colors hover:border-line-strong"
            >
              <span className="neon-text font-display text-xl font-extrabold tracking-[-0.02em] md:text-2xl">
                {stat.value}
              </span>
              <span className="text-[0.72rem] leading-snug font-medium text-fg-muted">
                {stat.label}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
