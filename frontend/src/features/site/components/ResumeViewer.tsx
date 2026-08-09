import { lazy, Suspense, useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ActionButton } from '@/features/site/components/ActionButton';
import { Icon } from '@/components/Icon';
import { MagneticButton } from '@/components/MagneticButton';
import { EASE_OUT } from '@/lib/motion';
import { useResumePdfAvailability } from '@/features/site/hooks/use-resume-pdf';
import { savePdf } from '@/features/site/lib/save-pdf';
import { RESUME } from '../data/content';

const ResumePdfDocument = lazy(() =>
  import('./ResumePdfDocument').then((module) => ({ default: module.ResumePdfDocument })),
);

type ResumeViewerProps = {
  open: boolean;
  onClose: () => void;
};

/** Modal fullscreen para ler e baixar o PDF do currículo. */
export function ResumeViewer({ open, onClose }: ResumeViewerProps) {
  const reducedMotion = useReducedMotion();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const pdfStatus = useResumePdfAvailability(open);
  const pdfReady = pdfStatus === 'ready';
  const [pageCount, setPageCount] = useState(0);
  const [renderFailed, setRenderFailed] = useState(false);

  const handlePdfReady = useCallback((pages: number) => {
    setPageCount(pages);
    setRenderFailed(false);
  }, []);

  const handlePdfFail = useCallback(() => {
    setRenderFailed(true);
  }, []);

  const handleDownload = useCallback(() => {
    void savePdf(RESUME.href, RESUME.fileName);
  }, []);

  useEffect(() => {
    if (!open) {
      setPageCount(0);
      setRenderFailed(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.dataset.resumeViewer = 'true';

    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      delete document.body.dataset.resumeViewer;
      window.removeEventListener('keydown', onKeyDown);

      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const showDocument = pdfReady && !renderFailed;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
          className="resume-viewer fixed inset-0 flex flex-col backdrop-blur-md"
        >
          <div className="resume-viewer__shell">
            <div className="resume-viewer__toolbar">
              <div className="resume-viewer__meta">
                <p id={titleId} className="resume-viewer__title">
                  {RESUME.title}
                </p>
                <p className="resume-viewer__subtitle">
                  {showDocument && pageCount > 0
                    ? RESUME.pagesLabel(pageCount)
                    : RESUME.fileName}
                </p>
              </div>

              <div className="resume-viewer__actions">
                {pdfReady && (
                  <ActionButton
                    onClick={handleDownload}
                    variant="primary"
                    size="md"
                    icon="download"
                    className="!min-h-10 !px-4 text-[0.82rem] sm:!min-h-11 sm:!px-5"
                  >
                    {RESUME.downloadLabel}
                  </ActionButton>
                )}

                <MagneticButton
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label={RESUME.closeLabel}
                  className="resume-viewer__close focus-on-dark"
                >
                  <Icon name="x" className="size-4" weight="bold" />
                  <span>{RESUME.closeShortLabel}</span>
                </MagneticButton>
              </div>
            </div>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.28, delay: 0.04, ease: EASE_OUT }}
              className="resume-viewer__stage"
            >
              <div className="resume-preview">
                {pdfStatus === 'loading' && (
                  <div className="resume-viewer__state">
                    <span aria-hidden="true" className="resume-viewer__state-icon">
                      <Icon name="filePdf" className="size-5" weight="bold" />
                    </span>
                    <p className="meta text-on-dark-muted">{RESUME.loadingLabel}</p>
                  </div>
                )}

                {(pdfStatus === 'missing' || renderFailed) && (
                  <div className="resume-viewer__state">
                    <span
                      aria-hidden="true"
                      className="resume-viewer__state-icon resume-viewer__state-icon--warn"
                    >
                      <Icon name="alert" className="size-5" weight="bold" />
                    </span>
                    <div className="max-w-md space-y-2">
                      <p className="font-display text-[1.05rem] font-bold tracking-[-0.03em] text-on-dark">
                        {renderFailed ? RESUME.renderErrorTitle : RESUME.missingTitle}
                      </p>
                      <p className="meta text-on-dark-muted">
                        {renderFailed ? RESUME.renderErrorLead : RESUME.missingLead}
                      </p>
                    </div>
                  </div>
                )}

                {showDocument && (
                  <Suspense
                    fallback={
                      <div className="resume-viewer__state">
                        <span aria-hidden="true" className="resume-viewer__state-icon">
                          <Icon name="filePdf" className="size-5" weight="bold" />
                        </span>
                        <p className="meta text-on-dark-muted">{RESUME.loadingLabel}</p>
                      </div>
                    }
                  >
                    <ResumePdfDocument
                      src={RESUME.href}
                      onReady={handlePdfReady}
                      onFail={handlePdfFail}
                    />
                  </Suspense>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
