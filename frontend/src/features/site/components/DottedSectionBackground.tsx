import { motion, type MotionValue } from 'framer-motion';

type DottedSectionBackgroundProps = {
  x: MotionValue<string>;
  y: MotionValue<string>;
  presence: MotionValue<number>;
};

type DotFieldStyle = React.CSSProperties & {
  '--dots-x': MotionValue<string>;
  '--dots-y': MotionValue<string>;
};

/**
 * Grade pontilhada das superfícies navy.
 *
 * A base é sempre estática. Em desktop, duas grades alinhadas com pontos
 * maiores aparecem sob o mouse; como todas compartilham o mesmo passo, o ponto
 * parece crescer em vez de trocar de posição.
 */
export function DottedSectionBackground({ x, y, presence }: DottedSectionBackgroundProps) {
  const style: DotFieldStyle = { '--dots-x': x, '--dots-y': y };

  return (
    <motion.div aria-hidden="true" className="dotted-field" style={style}>
      <span className="dotted-field__base" />
      <motion.span className="dotted-field__focus" style={{ opacity: presence }} />
      <motion.span className="dotted-field__core" style={{ opacity: presence }} />
    </motion.div>
  );
}
