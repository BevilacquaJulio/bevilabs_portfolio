import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { staggerItem } from './motion';

const SRC = join(process.cwd(), 'src');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/**
 * O Framer Motion grava o resultado da animacao como estilo inline. Um
 * `transform: translateY(0px)` inline vence qualquer classe `hover:-translate-y-*`
 * do Tailwind, entao o hover do card morre em silencio, sem erro de build nem de
 * tipo. Estes testes prendem as duas pontas do problema.
 */
describe('linguagem de movimento', () => {
  it('anima `y` em vez da string `transform` nos presets compartilhados', () => {
    for (const variants of [staggerItem]) {
      for (const state of ['hidden', 'visible'] as const) {
        const target = variants[state] as Record<string, unknown>;
        expect(target).not.toHaveProperty('transform');
        expect(target).toHaveProperty('y');
      }
    }
  });

  it('nao deixa nenhum componente motion com hover baseado em transform', () => {
    const tag = /<(motion\.\w+)\b((?:[^<>]|\{[^{}]*\})*?)>/gs;
    const transformHover = /\bhover:-?(?:translate|scale|rotate)[-\w./[\]]*/g;

    const offenders: string[] = [];
    for (const file of walk(SRC).filter((f) => f.endsWith('.tsx'))) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(tag)) {
        const hits = match[2].match(transformHover);
        if (hits) offenders.push(`${file} <${match[1]}> ${hits.join(', ')}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('nao anima a string `transform` em nenhum lugar', () => {
    const offenders = walk(SRC)
      .filter((f) => /\.tsx?$/.test(f) && !f.endsWith('motion.test.ts'))
      .filter((f) => /transform:\s*'translate/.test(readFileSync(f, 'utf8')));

    expect(offenders).toEqual([]);
  });
});
