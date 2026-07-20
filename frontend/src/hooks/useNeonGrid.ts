import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { useIsFinePointer } from './useMediaQuery';

const SPACING = 50;
const MAX_DISTANCE = 220;
const NEON_RGB = '0, 240, 255';

/**
 * Grade de pontos neon reagindo ao ponteiro — assinatura visual do site original.
 *
 * Diferencas em relacao a versao vanilla:
 * - Sem MutationObserver e sem TreeWalker sobre todo o DOM (custavam caro e
 *   rodavam a cada mutacao). A grade agora e puramente geometrica.
 * - Suporta devicePixelRatio, entao nao fica serrilhada em tela retina.
 * - Congela o loop quando a aba esta oculta e quando o ponteiro nao e fino
 *   (mobile), onde a interacao com mouse nao existe e o custo era desperdicio.
 */
export function useNeonGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useIsFinePointer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;

    const pointer = { x: -9999, y: -9999 };
    const target = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawStatic = () => {
      context.clearRect(0, 0, width, height);
      context.shadowBlur = 0;
      context.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let y = 0; y <= height; y += SPACING) {
        for (let x = 0; x <= width; x += SPACING) {
          context.beginPath();
          context.arc(x, y, 1.3, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    const draw = () => {
      if (!running) return;

      // Lerp suaviza o rastro do cursor sem precisar de biblioteca.
      pointer.x += (target.x - pointer.x) * 0.12;
      pointer.y += (target.y - pointer.y) * 0.12;

      context.clearRect(0, 0, width, height);

      for (let y = 0; y <= height; y += SPACING) {
        for (let x = 0; x <= width; x += SPACING) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const influence = Math.max(0, 1 - distance / MAX_DISTANCE) ** 1.5;
          const size = 1.3 + influence * 3.5;

          context.beginPath();
          context.arc(x, y, size, 0, Math.PI * 2);

          if (influence > 0.03) {
            context.shadowBlur = 22 * influence;
            context.shadowColor = `rgba(${NEON_RGB}, ${Math.min(influence * 1.3, 1)})`;
            context.fillStyle = `rgba(${NEON_RGB}, ${0.08 + influence * 0.92})`;
          } else {
            context.shadowBlur = 0;
            context.fillStyle = 'rgba(255, 255, 255, 0.05)';
          }

          context.fill();
        }
      }

      context.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!reducedMotion && finePointer) {
        running = true;
        frame = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);

    if (reducedMotion || !finePointer) {
      // Sem movimento: desenha a grade uma vez e para por aqui.
      running = false;
      drawStatic();
      const redraw = () => {
        resize();
        drawStatic();
      };
      window.addEventListener('resize', redraw);
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('resize', redraw);
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    frame = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [reducedMotion, finePointer]);

  return canvasRef;
}
