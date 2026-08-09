import { motion, useTransform, type MotionStyle, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/cn';

type HeroBackgroundProps = {
  mx: MotionValue<string>;
  my: MotionValue<string>;
  offsetX: MotionValue<number>;
  offsetY: MotionValue<number>;
  reducedMotion: boolean | null;
};

type HeroPointerStyle = MotionStyle & {
  '--mx': MotionValue<string>;
  '--my': MotionValue<string>;
};

type Particle = {
  /** Posição em porcentagem da hero. Nada em pixel, para escalar sozinho. */
  x: number;
  y: number;
  size: number;
  kind: 'dot' | 'plus' | 'ring' | 'halo';
  /** 1 fica quase parado, 3 é o plano mais solto no parallax. */
  depth: 1 | 2 | 3;
  duration: number;
  delay: number;
  /** Falso some abaixo de 640px, para não empoeirar a tela pequena. */
  onMobile: boolean;
};

/**
 * As partículas ficam nas laterais e nas faixas de cima e de baixo. O miolo,
 * onde vive o lettering, fica limpo de propósito: decoração atrás de texto é
 * ruído, não profundidade.
 */
const PARTICLES: readonly Particle[] = [
  { x: 4, y: 18, size: 5, kind: 'dot', depth: 2, duration: 9, delay: 0, onMobile: true },
  { x: 9.5, y: 34, size: 3, kind: 'dot', depth: 1, duration: 11, delay: 1.4, onMobile: false },
  { x: 2.5, y: 52, size: 22, kind: 'halo', depth: 3, duration: 13, delay: 0.6, onMobile: true },
  { x: 7, y: 67, size: 4, kind: 'dot', depth: 2, duration: 10, delay: 2.1, onMobile: false },
  { x: 13, y: 81, size: 11, kind: 'plus', depth: 1, duration: 12, delay: 0.9, onMobile: true },
  { x: 17, y: 23, size: 12, kind: 'plus', depth: 3, duration: 9.5, delay: 1.8, onMobile: false },
  { x: 11, y: 47, size: 15, kind: 'ring', depth: 2, duration: 14, delay: 0.3, onMobile: true },
  { x: 20.5, y: 61, size: 3, kind: 'dot', depth: 1, duration: 8.5, delay: 2.6, onMobile: false },
  { x: 5, y: 89, size: 6, kind: 'dot', depth: 3, duration: 11.5, delay: 1.1, onMobile: false },

  { x: 95, y: 14, size: 4, kind: 'dot', depth: 1, duration: 10.5, delay: 0.4, onMobile: true },
  { x: 88, y: 29, size: 13, kind: 'plus', depth: 2, duration: 12.5, delay: 1.6, onMobile: true },
  { x: 96.5, y: 44, size: 6, kind: 'dot', depth: 3, duration: 9, delay: 2.3, onMobile: false },
  { x: 83, y: 57, size: 17, kind: 'ring', depth: 1, duration: 15, delay: 0.8, onMobile: true },
  { x: 92, y: 71, size: 3, kind: 'dot', depth: 2, duration: 8, delay: 1.3, onMobile: false },
  { x: 79, y: 85, size: 11, kind: 'plus', depth: 3, duration: 13.5, delay: 0.2, onMobile: false },
  { x: 86, y: 8, size: 26, kind: 'halo', depth: 2, duration: 16, delay: 1.9, onMobile: true },
  { x: 98, y: 63, size: 4, kind: 'dot', depth: 1, duration: 10, delay: 2.8, onMobile: false },

  { x: 34, y: 9, size: 3, kind: 'dot', depth: 2, duration: 9.5, delay: 1.2, onMobile: false },
  { x: 62, y: 6.5, size: 5, kind: 'dot', depth: 3, duration: 11, delay: 0.5, onMobile: true },
  { x: 45, y: 93, size: 4, kind: 'dot', depth: 1, duration: 12, delay: 2.4, onMobile: false },
  { x: 70, y: 90, size: 10, kind: 'plus', depth: 2, duration: 10.5, delay: 1.7, onMobile: true },
  { x: 29, y: 88, size: 13, kind: 'ring', depth: 3, duration: 14.5, delay: 0.7, onMobile: false },
];

/** Quanto cada plano se desloca, em pixel, entre uma borda e outra da hero. */
const PARALLAX = { 1: -22, 2: -46, 3: -78 } as const;

/**
 * Fundo da hero.
 *
 * Oito camadas empilhadas: a imagem que cobre a seção inteira, banho de cor,
 * arcos tracejados girando, orbes desfocados derivando, matriz de pontos nos
 * cantos, três planos de partículas com parallax, e por cima a malha e o
 * brilho que seguem o cursor.
 *
 * Todo o movimento é `transform` e `opacity`, e as partículas usam animação
 * CSS em vez de JavaScript: são vinte e duas, e vinte e duas animações no
 * compositor custam menos que vinte e duas assinaturas de rAF.
 */
export function HeroBackground({ mx, my, offsetX, offsetY, reducedMotion }: HeroBackgroundProps) {
  const layer1X = useTransform(offsetX, (value) => value * PARALLAX[1]);
  const layer1Y = useTransform(offsetY, (value) => value * PARALLAX[1]);
  const layer2X = useTransform(offsetX, (value) => value * PARALLAX[2]);
  const layer2Y = useTransform(offsetY, (value) => value * PARALLAX[2]);
  const layer3X = useTransform(offsetX, (value) => value * PARALLAX[3]);
  const layer3Y = useTransform(offsetY, (value) => value * PARALLAX[3]);

  const layers = [
    { depth: 1 as const, style: { x: layer1X, y: layer1Y } },
    { depth: 2 as const, style: { x: layer2X, y: layer2Y } },
    { depth: 3 as const, style: { x: layer3X, y: layer3Y } },
  ];
  const pointerStyle: HeroPointerStyle = { '--mx': mx, '--my': my };

  return (
    <motion.div
      aria-hidden="true"
      className="hero-bg"
      style={reducedMotion ? undefined : pointerStyle}
    >
      <div className="hero-photo" />

      <div className="hero-wash" />

      <div className="hero-arcs">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
          <circle cx="500" cy="500" r="240" />
          <circle cx="500" cy="500" r="370" />
          <circle cx="500" cy="500" r="486" />
        </svg>
      </div>

      <div>
        <span className="hero-orb hero-orb--a" />
        <span className="hero-orb hero-orb--b" />
        <span className="hero-orb hero-orb--c" />
        <span className="hero-orb hero-orb--d" />
      </div>

      <div>
        <span className="hero-matrix hero-matrix--tr" />
        <span className="hero-matrix hero-matrix--bl" />
      </div>

      {layers.map((layer) => (
        <motion.div key={layer.depth} style={reducedMotion ? undefined : layer.style}>
          {PARTICLES.filter((particle) => particle.depth === layer.depth).map((particle) => (
            <span
              key={`${particle.x}-${particle.y}`}
              className={cn(
                'hero-particle',
                `hero-particle--${particle.kind}`,
                !particle.onMobile && 'hidden sm:block',
              )}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </motion.div>
      ))}

      <div className="hero-hotgrid" />
      <div className="hero-spot" />
      <div className="hero-seam" />
    </motion.div>
  );
}
