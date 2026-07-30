/** Camadas de papel e grão compartilhadas por todas as rotas. */
export function Background() {
  return (
    <>
      <div className="ambient-background" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
    </>
  );
}
