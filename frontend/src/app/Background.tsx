import { useNeonGrid } from '@/hooks/useNeonGrid';

/** Camadas de fundo compartilhadas: grade neon reativa + grao de filme. */
export function Background() {
  const canvasRef = useNeonGrid();

  return (
    <>
      <canvas ref={canvasRef} className="grid-canvas" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
    </>
  );
}
