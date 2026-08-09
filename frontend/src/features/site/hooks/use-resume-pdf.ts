import { useEffect, useState } from 'react';
import { RESUME } from '../data/content';

export type ResumePdfStatus = 'idle' | 'loading' | 'ready' | 'missing';

/** Confirma se o PDF existe antes de embutir — evita cair na rota 404 da SPA. */
async function probeResumePdf(): Promise<boolean> {
  try {
    const res = await fetch(RESUME.href, { method: 'HEAD', cache: 'no-store' });
    if (!res.ok) return false;

    const type = (res.headers.get('content-type') ?? '').toLowerCase();
    if (type.includes('text/html')) return false;

    return type.includes('pdf') || type.includes('octet-stream');
  } catch {
    return false;
  }
}

export function useResumePdfAvailability(open: boolean): ResumePdfStatus {
  const [status, setStatus] = useState<ResumePdfStatus>('idle');

  useEffect(() => {
    if (!open) {
      setStatus('idle');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    probeResumePdf().then((ready) => {
      if (!cancelled) setStatus(ready ? 'ready' : 'missing');
    });

    return () => {
      cancelled = true;
    };
  }, [open]);

  return status;
}
