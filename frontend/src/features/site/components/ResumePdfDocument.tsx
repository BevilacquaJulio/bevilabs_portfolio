import { useEffect, useRef, useState } from 'react';
import { getDocument, type PDFDocumentProxy } from 'pdfjs-dist';
import { Icon } from '@/components/Icon';
import { RESUME } from '../data/content';
import '@/features/site/lib/pdfjs';

type ResumePdfDocumentProps = {
  src: string;
  onReady?: (pageCount: number) => void;
  onFail?: () => void;
};

type PdfPageProps = {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  containerWidth: number;
  totalPages: number;
};

function getOutputScale(): number {
  return Math.min(window.devicePixelRatio || 1, 2.5);
}

function PdfPage({ pdf, pageNumber, containerWidth, totalPages }: PdfPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;

    const renderPage = async () => {
      if (containerWidth <= 0) return;

      const page = await pdf.getPage(pageNumber);
      if (cancelled || !canvasRef.current) return;

      const outputScale = getOutputScale();
      const baseViewport = page.getViewport({ scale: 1 });
      const layoutScale = (containerWidth - 2) / baseViewport.width;
      const viewport = page.getViewport({ scale: layoutScale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const transform =
        outputScale !== 1
          ? [outputScale, 0, 0, outputScale, 0, 0]
          : undefined;

      await page.render({
        canvasContext: context,
        viewport,
        transform,
        intent: 'display',
      }).promise;
    };

    void renderPage();

    return () => {
      cancelled = true;
    };
  }, [pdf, pageNumber, containerWidth]);

  return (
    <article className="resume-page" aria-label={`Página ${pageNumber} de ${totalPages}`}>
      <span className="resume-page__badge" aria-hidden="true">
        {String(pageNumber).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
      </span>
      <canvas ref={canvasRef} className="resume-page__canvas" />
    </article>
  );
}

/** Renderiza todas as paginas em canvas — funciona no mobile, onde iframe so mostra a primeira. */
export function ResumePdfDocument({ src, onReady, onFail }: ResumePdfDocumentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  const onFailRef = useRef(onFail);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onReadyRef.current = onReady;
    onFailRef.current = onFail;
  }, [onReady, onFail]);

  useEffect(() => {
    let cancelled = false;
    let doc: PDFDocumentProxy | null = null;

    setLoading(true);
    setPdf(null);
    setPageCount(0);

    getDocument(src)
      .promise.then((loaded) => {
        if (cancelled) {
          void loaded.destroy();
          return;
        }

        doc = loaded;
        setPdf(loaded);
        setPageCount(loaded.numPages);
        onReadyRef.current?.(loaded.numPages);
      })
      .catch(() => {
        if (!cancelled) onFailRef.current?.();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      void doc?.destroy();
    };
  }, [src]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const update = () => setContainerWidth(node.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const preparing = loading || !pdf || pageCount === 0 || containerWidth <= 0;

  return (
    <div ref={scrollRef} className="resume-document">
      {preparing ? (
        <div className="resume-viewer__state">
          <span aria-hidden="true" className="resume-viewer__state-icon">
            <Icon name="filePdf" className="size-5" weight="bold" />
          </span>
          <p className="meta text-on-dark-muted">{RESUME.loadingLabel}</p>
        </div>
      ) : (
        Array.from({ length: pageCount }, (_, index) => (
          <PdfPage
            key={`${containerWidth}-${getOutputScale()}-${index + 1}`}
            pdf={pdf}
            pageNumber={index + 1}
            containerWidth={containerWidth}
            totalPages={pageCount}
          />
        ))
      )}
    </div>
  );
}
