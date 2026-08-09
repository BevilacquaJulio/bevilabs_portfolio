import { useCallback, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ActionButton } from '@/features/site/components/ActionButton';
import { DottedSectionBackground } from '@/features/site/components/DottedSectionBackground';
import { Icon } from '@/components/Icon';
import { MagneticButton } from '@/components/MagneticButton';
import { SectionHeading } from '@/components/SectionHeading';
import { useDottedFieldPointer } from '@/features/site/hooks/useDottedFieldPointer';
import { cn } from '@/lib/cn';
import { defaultViewport, EASE_OUT, stepDelay } from '@/lib/motion';
import { CONTACT, CONTACT_CHANNELS, PROFILE, RESUME, type ContactChannel } from '../data/content';
import { ResumeViewer } from './ResumeViewer';

/**
 * Contato.
 *
 * Bloco escuro que fecha a página, dividido em duas colunas: à esquerda o
 * convite, a disponibilidade e o botão principal; à direita a lista de canais.
 *
 * Cada linha da lista é um alvo grande, com o valor sempre visível. Nada de
 * esconder o e-mail atrás de um formulário: quem está com pressa copia e sai.
 */
export function Contact() {
  const reducedMotion = useReducedMotion();
  const dots = useDottedFieldPointer();
  const [resumeOpen, setResumeOpen] = useState(false);

  const openResume = useCallback(() => setResumeOpen(true), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);

  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      onPointerMove={dots.onPointerMove}
      onPointerLeave={dots.onPointerLeave}
      className="surface-contact relative isolate z-[var(--z-content)] scroll-mt-24 overflow-hidden py-14 text-on-dark sm:py-20 md:py-28"
    >
      <DottedSectionBackground x={dots.x} y={dots.y} presence={dots.presence} />
      <span
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_70%_at_85%_5%,rgb(39_101_204/0.24),transparent_62%)]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-soft/45 to-transparent"
      />

      <div className="layout relative z-[1]">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h-compact)+3rem)]">
            <SectionHeading
              id="contato-title"
              label={CONTACT.label}
              title={CONTACT.title}
              subtitle={CONTACT.lead}
              tone="dark"
            />

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={defaultViewport}
              transition={{ duration: 0.55, delay: 0.32, ease: EASE_OUT }}
              className="mt-8 flex flex-col items-start gap-5 sm:mt-10"
            >
              <ActionButton
                onClick={openResume}
                variant="primary"
                size="lg"
                icon="filePdf"
              >
                {RESUME.viewLabel}
              </ActionButton>

              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/14 px-3.5 py-1.5">
                <span aria-hidden="true" className="relative flex size-1.5 shrink-0">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/80 motion-reduce:hidden" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-success" />
                </span>
                <span className="font-mono text-[0.66rem] font-medium tracking-[0.12em] text-on-dark-muted uppercase">
                  {CONTACT.availability}
                </span>
              </p>

              <p className="flex items-center gap-2.5 font-mono text-[0.7rem] tracking-[0.1em] text-on-dark-muted uppercase">
                <Icon name="pin" className="size-3.5 shrink-0" />
                {PROFILE.location}, {PROFILE.country}
              </p>
            </motion.div>
          </div>

          <ul className="border-t border-white/12">
            {CONTACT_CHANNELS.map((channel, index) => (
              <Channel key={channel.id} channel={channel} index={index} />
            ))}
          </ul>
        </div>
      </div>

      <ResumeViewer open={resumeOpen} onClose={closeResume} />
    </section>
  );
}

const channelClasses =
  'group focus-on-dark relative flex min-h-20 w-full items-center gap-4 overflow-hidden px-2 py-4 text-left sm:min-h-24 sm:gap-6 sm:px-4';

function Channel({ channel, index }: { channel: ContactChannel; index: number }) {
  const reducedMotion = useReducedMotion();

  if (channel.copy) {
    return <CopyChannel channel={channel} index={index} reducedMotion={reducedMotion} />;
  }

  const external = channel.external
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {};

  return (
    <motion.li
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ duration: 0.5, delay: stepDelay(index, 0.07), ease: EASE_OUT }}
      className="border-b border-white/12"
    >
      <a href={channel.href} {...external} className={channelClasses}>
        <ChannelContent channel={channel} trailingIcon="arrowUpRight" />
      </a>
    </motion.li>
  );
}

function CopyChannel({
  channel,
  index,
  reducedMotion,
}: {
  channel: ContactChannel;
  index: number;
  reducedMotion: boolean | null;
}) {
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(channel.value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }, [channel.value]);

  return (
    <motion.li
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ duration: 0.5, delay: stepDelay(index, 0.07), ease: EASE_OUT }}
      className="border-b border-white/12"
    >
      <MagneticButton
        type="button"
        onClick={copyEmail}
        aria-label={copied ? CONTACT.emailCopiedLabel : CONTACT.emailCopyLabel}
        className={channelClasses}
      >
        <ChannelContent
          channel={channel}
          trailingIcon={copied ? 'check' : 'copy'}
          trailingClassName={copied ? 'text-success' : undefined}
        />
      </MagneticButton>
    </motion.li>
  );
}

function ChannelContent({
  channel,
  trailingIcon,
  trailingClassName,
}: {
  channel: ContactChannel;
  trailingIcon: 'arrowUpRight' | 'copy' | 'check';
  trailingClassName?: string;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 origin-left scale-x-0 bg-accent/14',
          'transition-transform duration-500 ease-[var(--ease-out)]',
          'group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none',
        )}
      />

      <span
        aria-hidden="true"
        className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-white/14 text-accent-soft transition-[background-color,border-color,color,transform] duration-300 ease-[var(--ease-out)] group-hover:border-accent-soft group-hover:bg-accent-soft group-hover:text-ink group-hover:scale-105 motion-reduce:transform-none sm:size-12"
      >
        <Icon name={channel.icon} className="size-5" weight="bold" />
      </span>

      <span className="relative min-w-0 flex-1">
        <span className="meta block text-on-dark-muted">{channel.label}</span>
        <span className="mt-1.5 block [overflow-wrap:anywhere] font-display text-[1rem] leading-[1.35] font-bold tracking-[-0.03em] text-on-dark transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1 motion-reduce:transform-none sm:truncate sm:text-[1.2rem]">
          {channel.value}
        </span>
      </span>

      <Icon
        name={trailingIcon}
        className={cn(
          'relative size-5 shrink-0 text-on-dark-muted transition-[transform,color] duration-300 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-soft motion-reduce:transform-none',
          trailingClassName,
        )}
        weight="bold"
      />
    </>
  );
}
