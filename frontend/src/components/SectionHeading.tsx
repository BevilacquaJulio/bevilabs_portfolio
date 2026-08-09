import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { defaultViewport, EASE_OUT } from '@/lib/motion';

type SectionHeadingProps = {
  id: string;
  /** Rótulo curto acima do título. Diz a categoria, nunca repete o título. */
  label: string;
  title: string;
  subtitle?: string;
  /** `dark` inverte as cores para as seções em navy. */
  tone?: 'light' | 'dark';
  className?: string;
};

/**
 * Cabeçalho de seção: rótulo, título e uma linha de apoio.
 *
 * O título tem um tamanho só, definido em `.section-title` (globals), igual em
 * todas as seções. Ele quebra em quantas linhas precisar: um título curto e um
 * longo pesam o mesmo na página, o que é o que faz o leitor reconhecer os dois
 * como título e não confundir o mais longo com um parágrafo de apoio.
 *
 * O rótulo entra com uma régua que cresce ao lado, o título sobe palavra a
 * palavra e o apoio aparece por último. Nada depende de máscara de recorte
 * para ficar visível: se a animação não rodar, o texto continua na tela.
 */
export function SectionHeading({
  id,
  label,
  title,
  subtitle,
  tone = 'light',
  className,
}: SectionHeadingProps) {
  const reducedMotion = useReducedMotion();
  const dark = tone === 'dark';
  const words = title.split(' ');

  return (
    <div className={cn('w-full', className)}>
      <motion.p
        initial={reducedMotion ? false : { opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={defaultViewport}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className={cn(
          'flex items-center gap-3 font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase',
          dark ? 'text-accent-soft' : 'text-accent',
        )}
      >
        <motion.span
          aria-hidden="true"
          initial={reducedMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={defaultViewport}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
          className={cn('h-px w-8 shrink-0 origin-left', dark ? 'bg-accent-soft' : 'bg-accent')}
        />
        {label}
      </motion.p>

      <h2
        id={id}
        className={cn(
          'section-title mt-3 font-section font-normal tracking-[-0.015em] [font-feature-settings:\'liga\'_1,\'calt\'_1] sm:mt-4',
          dark ? 'text-on-dark' : 'text-ink',
        )}
      >
        {/*
         * O espaço fica FORA do span, como nó de texto de verdade.
         * Palavras em `inline-block` coladas uma na outra viram
         * "Projetosemprodução" no nome acessível e na cópia do texto.
         */}
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <motion.span
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={defaultViewport}
              transition={{ duration: 0.6, delay: 0.12 + index * 0.05, ease: EASE_OUT }}
              className="inline-block"
            >
              {word}
            </motion.span>
            {index < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </h2>

      {subtitle && (
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ duration: 0.55, delay: 0.26, ease: EASE_OUT }}
          className={cn(
            'mt-4 max-w-[54ch] text-[0.95rem] leading-[1.65] sm:mt-5 sm:text-[1.02rem]',
            dark ? 'text-on-dark-muted' : 'text-fg-muted',
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
