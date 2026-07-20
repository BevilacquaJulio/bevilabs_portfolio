import { UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService, parseDuration } from './auth.service';
import type { AuthRepository } from './auth.repository';

const ENV: Record<string, string> = {
  ADMIN_USERNAME: 'admin',
  JWT_ACCESS_SECRET: 'a'.repeat(32),
  JWT_REFRESH_SECRET: 'b'.repeat(32),
  JWT_ACCESS_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
};

const configService = { getOrThrow: (key: string) => ENV[key] } as never;
const jwtService = {
  signAsync: vi.fn().mockResolvedValue('token'),
  verifyAsync: vi.fn(),
} as never;

describe('parseDuration', () => {
  it.each([
    ['30s', 30_000],
    ['15m', 900_000],
    ['2h', 7_200_000],
    ['7d', 604_800_000],
  ])('converte %s', (input, expected) => {
    expect(parseDuration(input)).toBe(expected);
  });

  it('rejeita valor invalido', () => {
    expect(() => parseDuration('semana')).toThrow();
  });
});

describe('AuthService.login', () => {
  let repository: AuthRepository;
  let service: AuthService;

  beforeEach(async () => {
    repository = {
      findByUsername: vi.fn().mockResolvedValue({
        id: 1,
        username: 'admin',
        passwordHash: await hash('senha-correta', 10),
      }),
      createRefreshToken: vi.fn().mockResolvedValue(undefined),
      findRefreshToken: vi.fn(),
      revokeRefreshToken: vi.fn(),
      revokeAllForUser: vi.fn(),
    } as unknown as AuthRepository;

    service = new AuthService(repository, jwtService, configService);
  });

  it('emite access + refresh token com a senha correta', async () => {
    const tokens = await service.login('senha-correta');
    expect(tokens.tokenType).toBe('Bearer');
    expect(repository.createRefreshToken).toHaveBeenCalledOnce();
  });

  it('rejeita senha incorreta', async () => {
    await expect(service.login('errada')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejeita quando o usuario admin nao existe', async () => {
    vi.mocked(repository.findByUsername).mockResolvedValueOnce(null);
    await expect(service.login('qualquer')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
