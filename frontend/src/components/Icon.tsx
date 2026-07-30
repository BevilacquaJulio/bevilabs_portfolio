import type { Icon as PhosphorIcon, IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import { FolderIcon } from '@phosphor-icons/react/dist/csr/Folder';
import { RocketLaunchIcon } from '@phosphor-icons/react/dist/csr/RocketLaunch';
import { LightningIcon } from '@phosphor-icons/react/dist/csr/Lightning';
import { StackIcon } from '@phosphor-icons/react/dist/csr/Stack';
import { BracketsCurlyIcon } from '@phosphor-icons/react/dist/csr/BracketsCurly';
import { GlobeIcon } from '@phosphor-icons/react/dist/csr/Globe';
import { LinkIcon } from '@phosphor-icons/react/dist/csr/Link';
import { CubeIcon } from '@phosphor-icons/react/dist/csr/Cube';
import { TerminalWindowIcon } from '@phosphor-icons/react/dist/csr/TerminalWindow';
import { ChartLineUpIcon } from '@phosphor-icons/react/dist/csr/ChartLineUp';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { CompassIcon } from '@phosphor-icons/react/dist/csr/Compass';
import { ShieldCheckIcon } from '@phosphor-icons/react/dist/csr/ShieldCheck';
import { DatabaseIcon } from '@phosphor-icons/react/dist/csr/Database';
import { MapPinIcon } from '@phosphor-icons/react/dist/csr/MapPin';
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/csr/EnvelopeSimple';
import { PhoneIcon } from '@phosphor-icons/react/dist/csr/Phone';
import { LinkedinLogoIcon } from '@phosphor-icons/react/dist/csr/LinkedinLogo';
import { GithubLogoIcon } from '@phosphor-icons/react/dist/csr/GithubLogo';
import { LockKeyIcon } from '@phosphor-icons/react/dist/csr/LockKey';
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/csr/ArrowUpRight';
import { GraduationCapIcon } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { AtomIcon } from '@phosphor-icons/react/dist/csr/Atom';
import { HexagonIcon } from '@phosphor-icons/react/dist/csr/Hexagon';
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus';
import { TrashIcon } from '@phosphor-icons/react/dist/csr/Trash';
import { PencilSimpleIcon } from '@phosphor-icons/react/dist/csr/PencilSimple';
import { SignOutIcon } from '@phosphor-icons/react/dist/csr/SignOut';
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check';
import { WarningCircleIcon } from '@phosphor-icons/react/dist/csr/WarningCircle';
import { EyeIcon } from '@phosphor-icons/react/dist/csr/Eye';
import { EyeSlashIcon } from '@phosphor-icons/react/dist/csr/EyeSlash';
import { XIcon } from '@phosphor-icons/react/dist/csr/X';
import { ListIcon } from '@phosphor-icons/react/dist/csr/List';

const ICONS = {
  folder: FolderIcon,
  rocket: RocketLaunchIcon,
  zap: LightningIcon,
  layers: StackIcon,
  code: BracketsCurlyIcon,
  globe: GlobeIcon,
  link: LinkIcon,
  box: CubeIcon,
  terminal: TerminalWindowIcon,
  chart: ChartLineUpIcon,
  search: MagnifyingGlassIcon,
  compass: CompassIcon,
  shield: ShieldCheckIcon,
  database: DatabaseIcon,
  pin: MapPinIcon,
  mail: EnvelopeSimpleIcon,
  phone: PhoneIcon,
  linkedin: LinkedinLogoIcon,
  github: GithubLogoIcon,
  lock: LockKeyIcon,
  arrowUpRight: ArrowUpRightIcon,
  graduation: GraduationCapIcon,
  react: AtomIcon,
  node: HexagonIcon,
  plus: PlusIcon,
  trash: TrashIcon,
  pencil: PencilSimpleIcon,
  logout: SignOutIcon,
  check: CheckIcon,
  alert: WarningCircleIcon,
  eye: EyeIcon,
  eyeSlash: EyeSlashIcon,
  x: XIcon,
  menu: ListIcon,
} as const satisfies Record<string, PhosphorIcon>;

export type IconName = keyof typeof ICONS;

type IconProps = Omit<PhosphorIconProps, 'ref'> & {
  name: IconName;
  /** Rótulo acessível. Sem ele, o ícone é estritamente decorativo. */
  title?: string;
};

export function Icon({ name, title, weight = 'regular', ...props }: IconProps) {
  const Glyph = ICONS[name];

  return (
    <Glyph
      weight={weight}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...props}
    />
  );
}
