import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/Reveal';
import { CONTACT, PROFILE } from '../data/content';

export function Contact() {
  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="relative z-2 scroll-mt-24 py-12 md:py-18"
    >
      <div className="layout">
        <Reveal>
          <div className="blueprint overflow-hidden rounded-[var(--radius-md)] bg-ink text-paper [box-shadow:var(--shadow-float)] sm:rounded-[var(--radius-lg)]">
            <div className="grid gap-5 px-5 py-6 sm:gap-7 sm:px-7 sm:py-7 md:px-9 md:py-9 lg:grid-cols-12 lg:gap-x-10">
              <div className="lg:col-span-8">
                <h2
                  id="contato-title"
                  className="max-w-[13ch] font-display text-[1.6rem] leading-[1.04] font-semibold tracking-[-0.042em] text-balance sm:text-[1.78rem] md:text-[clamp(1.8rem,3.8vw,3.1rem)] md:leading-[0.99] md:tracking-[-0.05em]"
                >
                  {CONTACT.title}
                </h2>
              </div>

              <p className="max-w-[38ch] self-end text-[0.92rem] leading-[1.6] text-paper/68 sm:text-[0.96rem] lg:col-span-4">
                {CONTACT.lead}
              </p>
            </div>

            <a
              href={`mailto:${PROFILE.email}`}
              className="group focus-on-dark flex min-h-20 items-center gap-3 border-y border-white/18 px-5 py-4 transition-colors duration-200 ease-[var(--ease-out)] hover:bg-white/8 active:bg-white/12 sm:gap-4 sm:px-7 sm:py-5 md:min-h-24 md:px-9"
              aria-label={`Enviar e-mail para ${PROFILE.email}`}
            >
              <Icon name="mail" className="size-5 shrink-0 md:size-7" weight="light" />
              <span className="min-w-0 flex-1 break-words font-display text-[0.88rem] leading-[1.14] font-semibold tracking-[-0.028em] min-[360px]:text-[0.96rem] min-[390px]:text-[1.02rem] md:text-[clamp(1.1rem,2.9vw,2.15rem)] md:leading-none md:tracking-[-0.04em]">
                {PROFILE.email}
              </span>
              <Icon
                name="arrowUpRight"
                className="size-5 shrink-0 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:size-7"
                weight="light"
              />
            </a>

            <div className="grid gap-px bg-white/14 min-[390px]:grid-cols-2 lg:grid-cols-4">
              <ContactItem
                icon="phone"
                label="Telefone"
                value={PROFILE.phone}
                href={`tel:${PROFILE.phoneHref}`}
              />
              <ContactItem
                icon="linkedin"
                label="LinkedIn"
                value="Abrir perfil"
                href={PROFILE.linkedin}
                external
              />
              <ContactItem
                icon="github"
                label="GitHub"
                value="Ver código"
                href={PROFILE.github}
                external
              />
              <ContactItem icon="pin" label="Base" value={PROFILE.location} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type ContactItemProps = {
  icon: 'phone' | 'linkedin' | 'github' | 'pin';
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

function ContactItem({ icon, label, value, href, external }: ContactItemProps) {
  const content = (
    <>
      <Icon name={icon} className="size-5 shrink-0 text-paper/58" weight="light" />
      <span>
        <span className="block text-[0.72rem] font-medium text-paper/52">{label}</span>
        <span className="mt-1 block text-sm font-semibold text-paper">{value}</span>
      </span>
      {href && <Icon name="arrowUpRight" className="ml-auto size-4 shrink-0 text-paper/58" />}
    </>
  );

  const className =
    'flex min-h-16 items-center gap-3 bg-ink px-5 py-3.5 transition-colors duration-200 ease-[var(--ease-out)] sm:min-h-18 sm:px-7 lg:px-5';

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a
      href={href}
      className={`focus-on-dark ${className} hover:bg-white/8 active:bg-white/12`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  );
}
