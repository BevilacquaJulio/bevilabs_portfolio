import { useEffect, useState } from 'react';

const COARSE_POINTER = '(pointer: coarse), (hover: none)';

/** True em celulares e tablets — iframe de PDF nao exibe todas as paginas. */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(COARSE_POINTER).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(COARSE_POINTER);
    const sync = () => setCoarse(media.matches);

    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return coarse;
}
