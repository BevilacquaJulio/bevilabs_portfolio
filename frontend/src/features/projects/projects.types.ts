import { z } from 'zod';
import { PROJECT_ICONS } from '@/components/project-icons';

/** Espelha o projectInputSchema do backend — cliente e servidor validam igual. */
export const projectInputSchema = z.object({
  title: z.string().trim().min(1, 'Informe o titulo.').max(255, 'Maximo de 255 caracteres.'),
  icon: z.enum(PROJECT_ICONS),
  description: z
    .string()
    .trim()
    .min(1, 'Informe a descricao.')
    .max(5000, 'Maximo de 5000 caracteres.'),
  link: z.string().trim().url('Informe uma URL valida (com https://).').max(2048),
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
