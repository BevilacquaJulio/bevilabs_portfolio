import { motion } from 'framer-motion';
import { Icon, type IconName } from '@/components/Icon';
import { StatusBadge } from '@/components/Badge';
import { Reveal } from '@/components/Reveal';
import { defaultViewport, staggerContainer, staggerItem } from '@/lib/motion';
import { CONTACT, PROFILE } from '../data/content';

type ContactEntry = {
  icon: IconName;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

const ENTRIES: readonly ContactEntry[] = [
  { icon: 'pin', label: 'Localizacao', value: PROFILE.location },
  { icon: 'mail', label: 'E-mail', value: PROFILE.email, href: `mailto:${PROFILE.email}` },
  { icon: 'phone', label: 'Telefone', value: PROFILE.phone, href: `tel:${PROFILE.phoneHref}` },
  {
    icon: 'linkedin',
    label: 'LinkedIn',
    value: PROFILE.linkedinLabel,
    href: PROFILE.linkedin,
    external: true,
  },
  {
    icon: 'github',
    label: 'GitHub',
    value: PROFILE.githubLabel,
    href: PROFILE.github,
    external: true,
  },
];

export function Contact() {
  return (
    <section id="contato" className="relative z-2 scroll-mt-24 py-20 md:py-28">
      <div className="layout">
        <Reveal className="mb-10 text-center">
          <StatusBadge className="mb-5">Disponivel para novos projetos</StatusBadge>
          <h2
            id="contato-title"
            className="font-display text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.1] font-extrabold tracking-[-0.03em]"
          >
            {CONTACT.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[clamp(0.9rem,2vw,1.05rem)] font-light text-fg-muted">
            {CONTACT.subtitle}
          </p>
        </Reveal>

        <Reveal className="panel p-6 md:p-10">
          <div className="mx-auto max-w-2xl text-center text-[0.95rem] leading-[1.75] font-light text-fg-muted">
            {CONTACT.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 30)} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {ENTRIES.map((entry) => (
              <motion.li key={entry.label} variants={staggerItem}>
                <ContactCard {...entry} />
              </motion.li>
            ))}
          </motion.ul>
        </Reveal>
      </div>
    </section>
  );
}

function ContactCard({ icon, label, value, href, external }: ContactEntry) {
  const content = (
    <>
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-subtle text-neon [box-shadow:var(--shadow-neon-border)] transition-transform duration-300 group-hover:scale-110">
        <Icon name={icon} className="size-5" />
      </span>

      <span className="flex min-w-0 flex-col">
        <span className="text-[0.7rem] font-medium tracking-[0.1em] text-fg-subtle uppercase">
          {label}
        </span>
        <span className="truncate text-[0.9rem] font-medium text-fg">{value}</span>
      </span>

      {href && (
        <span
          aria-hidden="true"
          className="ml-auto shrink-0 text-fg-subtle transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neon"
        >
          <Icon name="arrowUpRight" className="size-4" />
        </span>
      )}
    </>
  );

  const className =
    'group flex h-full items-center gap-4 rounded-xl border border-line bg-bg-subtle/60 p-4 ' +
    'transition-all duration-300 hover:border-neon/35 hover:bg-bg-subtle hover:[box-shadow:var(--shadow-accent-border-soft)]';

  if (!href) {
    return <span className={className}>{content}</span>;
  }

  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  );
}
