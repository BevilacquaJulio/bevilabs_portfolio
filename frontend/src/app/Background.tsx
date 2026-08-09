/**
 * Camada global de grão.
 *
 * A partir do momento em que cada seção passou a ter a própria superfície, um
 * fundo fixo por baixo de tudo não apareceria em lugar nenhum. Sobrou o grão,
 * que roda por cima e em opacidade baixa o bastante para funcionar tanto no
 * papel quanto no navy, e é o que costura a textura entre as seis seções.
 *
 * O campo animado, com orbes e partículas, vive dentro da hero, onde ele é o
 * espetáculo, e não um ruído de fundo constante.
 */
export function Background() {
  return <div className="bg-grain" aria-hidden="true" />;
}
