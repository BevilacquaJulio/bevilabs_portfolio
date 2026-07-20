import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PROJECT_ICONS } from '../project-icons';

export const projectInputSchema = z.object({
  title: z.string().trim().min(1, 'Informe o titulo.').max(255),
  icon: z.enum(PROJECT_ICONS).default('folder'),
  description: z.string().trim().min(1, 'Informe a descricao.').max(5000),
  link: z.string().trim().url('Informe uma URL valida.').max(2048),
});

export class CreateProjectDto extends createZodDto(projectInputSchema) {}
export class UpdateProjectDto extends createZodDto(projectInputSchema) {}

export type ProjectInput = z.infer<typeof projectInputSchema>;
