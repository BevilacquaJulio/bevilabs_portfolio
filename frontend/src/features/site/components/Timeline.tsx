import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { TechBadge } from '@/components/Badge';
import { SectionHeading } from '@/components/SectionHeading';
import { defaultViewport, staggerItem } from '@/lib/motion';
import { TIMELINE, TIMELINE_LINKS } from '../data/content';

export function Timeline() {
  const containerRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 55%'],
  });
  // A linha vertical "cresce" conforme a secao e percorrida.
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <section id="experiencia" className="relative z-2 scroll-mt-24 py-20 md:py-28">
      <div className="layout">
        <SectionHeading
          eyebrow="Trajetoria"
          title="Onde ja construi"
          subtitle="Projetos e desafios que me trouxeram ate aqui."
        />

        <ol
          ref={containerRef}
          className="relative mx-auto flex max-w-[720px] flex-col gap-8 pl-8 md:gap-10 md:pl-10"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px bg-line"
          />
          <motion.span
            aria-hidden="true"
            style={{ scaleY }}
            className="absolute inset-y-0 left-0 w-px origin-top bg-neon [box-shadow:var(--shadow-accent-glow)]"
          />

          {TIMELINE.map((item) => {
            const link = TIMELINE_LINKS[item.title];

            return (
              <motion.li
                key={item.title}
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="group relative"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-2 -left-8 size-2.5 rounded-full border-2 border-bg bg-fg-subtle transition-all duration-300 group-hover:scale-125 group-hover:bg-neon group-hover:[box-shadow:var(--shadow-accent-glow)] md:-left-10"
                />

                <span className="text-[0.75rem] font-medium tracking-[0.1em] text-fg-subtle uppercase">
                  {item.period}
                </span>

                <h3 className="mt-1 font-display text-[1.05rem] leading-snug font-bold md:text-[1.15rem]">
                  {item.title}
                </h3>

                <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed font-light text-fg-muted">
                  {item.text}{' '}
                  {link && (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon underline decoration-neon/40 underline-offset-4 transition-colors hover:decoration-neon"
                    >
                      {link.label}
                    </a>
                  )}
                </p>

                <ul className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li key={tag}>
                      <TechBadge>{tag}</TechBadge>
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
