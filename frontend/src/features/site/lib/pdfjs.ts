import { GlobalWorkerOptions } from 'pdfjs-dist';

/** Worker em /public como .js — evita MIME errado de .mjs no nginx em producao. */
GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
