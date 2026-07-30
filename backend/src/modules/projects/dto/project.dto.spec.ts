import { describe, expect, it } from 'vitest';
import { projectInputSchema } from './project.dto';

const validProject = {
  title: 'Projeto seguro',
  icon: 'folder' as const,
  description: 'Descrição',
};

describe('projectInputSchema', () => {
  it('aceita links HTTPS', () => {
    expect(
      projectInputSchema.safeParse({ ...validProject, link: 'https://example.com' }).success,
    ).toBe(true);
  });

  it.each(['javascript:alert(1)', 'data:text/html,unsafe', 'http://example.com'])(
    'rejeita o protocolo inseguro %s',
    (link) => {
      expect(projectInputSchema.safeParse({ ...validProject, link }).success).toBe(false);
    },
  );
});
