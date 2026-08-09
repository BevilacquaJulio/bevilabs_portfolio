import { z } from 'zod';
import { PROJECT_ICONS } from '@/features/projects/project-icons';

/** Espelha o projectInputSchema do backend; cliente e servidor validam igual. */
const httpsUrlSchema = z
  .string()
  .trim()
  .url('Informe uma URL válida (com https://).')
  .max(2048)
  .refine((value) => /^https:\/\//i.test(value), 'Use um link seguro com https://.');

export const projectInputSchema = z.object({
  title: z.string().trim().min(1, 'Informe o título.').max(255, 'Máximo de 255 caracteres.'),
  icon: z.enum(PROJECT_ICONS),
  description: z
    .string()
    .trim()
    .min(1, 'Informe a descrição.')
    .max(5000, 'Máximo de 5000 caracteres.'),
  link: httpsUrlSchema,
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

export const projectSchema = projectInputSchema.extend({
  id: z.string(),
  icon: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export type PaginatedProjects = {
  data: Project[];
  total: number;
  page: number;
  limit: number;
};

/** Defesa adicional para links antigos ou respostas que não passaram pelo schema atual. */
export function getSafeProjectUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}
