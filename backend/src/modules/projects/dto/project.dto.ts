import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PROJECT_ICONS } from '../project-icons';

const httpsUrlSchema = z
  .string()
  .trim()
  .url('Informe uma URL válida.')
  .max(2048)
  .refine((value) => /^https:\/\//i.test(value), 'Use um link seguro com https://.');

export const projectInputSchema = z.object({
  title: z.string().trim().min(1, 'Informe o título.').max(255),
  icon: z.enum(PROJECT_ICONS).default('folder'),
  description: z.string().trim().min(1, 'Informe a descrição.').max(5000),
  link: httpsUrlSchema,
});

export class CreateProjectDto extends createZodDto(projectInputSchema) {}
export class UpdateProjectDto extends createZodDto(projectInputSchema) {}

export type ProjectInput = z.infer<typeof projectInputSchema>;
