import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const loginSchema = z.object({
  password: z.string().min(1, 'Informe a senha.'),
});

export class LoginDto extends createZodDto(loginSchema) {}

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token ausente.'),
});

export class RefreshDto extends createZodDto(refreshSchema) {}
