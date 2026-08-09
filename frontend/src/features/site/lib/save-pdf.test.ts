import { afterEach, describe, expect, it, vi } from 'vitest';
import { savePdf } from './save-pdf';

afterEach(() => {
  Reflect.deleteProperty(window, 'showSaveFilePicker');
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('savePdf', () => {
  it('abre o seletor de destino e grava o PDF escolhido', async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    const close = vi.fn().mockResolvedValue(undefined);
    const showSaveFilePicker = vi.fn().mockResolvedValue({
      createWritable: vi.fn().mockResolvedValue({ write, close }),
    });
    const pdf = new Blob(['pdf'], { type: 'application/pdf' });

    Object.defineProperty(window, 'showSaveFilePicker', {
      configurable: true,
      value: showSaveFilePicker,
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(pdf, { status: 200 })),
    );

    await savePdf('/documents/curriculo.pdf', 'curriculo.pdf');

    expect(showSaveFilePicker).toHaveBeenCalledWith(
      expect.objectContaining({ suggestedName: 'curriculo.pdf' }),
    );
    expect(write).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledOnce();
  });

  it('usa o download tradicional quando o seletor nao existe', async () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    await savePdf('/documents/curriculo.pdf', 'curriculo.pdf');

    expect(click).toHaveBeenCalledOnce();
  });
});
