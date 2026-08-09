type WritableFile = {
  write: (data: Blob) => Promise<void>;
  close: () => Promise<void>;
};

type SaveFileHandle = {
  createWritable: () => Promise<WritableFile>;
};

type SaveFilePicker = (options: {
  suggestedName: string;
  types: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
}) => Promise<SaveFileHandle>;

type WindowWithSavePicker = Window & {
  showSaveFilePicker?: SaveFilePicker;
};

function downloadWithBrowser(url: string, fileName: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
}

function isPickerCancellation(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

/**
 * Abre o seletor de destino quando o navegador oferece File System Access API.
 * Firefox e Safari recebem o download HTML tradicional como fallback.
 */
export async function savePdf(url: string, fileName: string): Promise<void> {
  const showSaveFilePicker = (window as WindowWithSavePicker).showSaveFilePicker;

  if (!showSaveFilePicker) {
    downloadWithBrowser(url, fileName);
    return;
  }

  try {
    const handle = await showSaveFilePicker.call(window, {
      suggestedName: fileName,
      types: [
        {
          description: 'Documento PDF',
          accept: { 'application/pdf': ['.pdf'] },
        },
      ],
    });
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Não foi possível baixar o PDF: HTTP ${response.status}`);
    }

    const writable = await handle.createWritable();
    await writable.write(await response.blob());
    await writable.close();
  } catch (error) {
    if (!isPickerCancellation(error)) {
      downloadWithBrowser(url, fileName);
    }
  }
}
