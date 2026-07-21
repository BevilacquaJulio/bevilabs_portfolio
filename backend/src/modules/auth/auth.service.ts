import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { readAdminUsername } from '../../config/admin-credentials';
import { AuthRepository } from './auth.repository';

/**
 * `expiresIn` do jsonwebtoken aceita numero (segundos) ou string no formato
 * "15m" / "7d". O tipo `StringValue` do pacote `ms` nao e reexportado pelo
 * @nestjs/jwt, entao declaramos o formato aceito aqui.
 */
type ExpiresIn = `${number}${'s' | 'm' | 'h' | 'd'}`;

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
};

type RefreshPayload = { jti: string; sub: number };

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Login por senha unica do admin. O username vem de ADMIN_USERNAME.
   * A comparacao bcrypt roda sempre, mesmo sem usuario, para nao vazar
   * a existencia da conta por diferenca de tempo.
   */
  async login(password: string): Promise<TokenPair> {
    const username = readAdminUsername();
    const user = await this.repository.findByUsername(username);

    const hashToCompare =
      user?.passwordHash ?? '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin';
    const valid = await compare(password, hashToCompare);

    if (!user || !valid) {
      throw new UnauthorizedException('Senha incorreta.');
    }

    return this.issueTokens(user.id, user.username);
  }

  /** Rotaciona o refresh token: o antigo e revogado e um novo par e emitido. */
  async refresh(refreshToken: string): Promise<TokenPair> {
    let payload: RefreshPayload;

    try {
      payload = await this.jwtService.verifyAsync<RefreshPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Sessao invalida ou expirada.');
    }

    const stored = await this.repository.findRefreshToken(payload.jti);

    if (!stored || stored.revokedAt !== null || stored.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Sessao invalida ou expirada.');
    }

    const matches = await compare(refreshToken, stored.tokenHash);
    if (!matches) {
      // Token reaproveitado ou adulterado: revoga tudo do usuario.
      await this.repository.revokeAllForUser(stored.userId);
      throw new UnauthorizedException('Sessao invalida ou expirada.');
    }

    await this.repository.revokeRefreshToken(stored.id);
    return this.issueTokens(stored.user.id, stored.user.username);
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
      await this.repository.revokeRefreshToken(payload.jti);
    } catch {
      // Logout e idempotente: token invalido tambem encerra a sessao no cliente.
    }
  }

  private async issueTokens(userId: number, username: string): Promise<TokenPair> {
    const jti = randomUUID();

    const accessToken = await this.jwtService.signAsync(
      { sub: userId, username },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow<ExpiresIn>('JWT_ACCESS_EXPIRES_IN'),
      },
    );

    const refreshExpiresIn = this.configService.getOrThrow<ExpiresIn>('JWT_REFRESH_EXPIRES_IN');
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, jti },
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshExpiresIn,
      },
    );

    await this.repository.createRefreshToken({
      id: jti,
      userId,
      tokenHash: await hash(refreshToken, 10),
      expiresAt: new Date(Date.now() + parseDuration(refreshExpiresIn)),
    });

    return { accessToken, refreshToken, tokenType: 'Bearer' };
  }
}

/** Converte "15m" / "7d" / "3600s" em milissegundos. */
export function parseDuration(value: string): number {
  const match = /^(\d+)\s*([smhd])$/.exec(value.trim());
  if (!match) {
    const asNumber = Number(value);
    if (Number.isFinite(asNumber)) return asNumber * 1000;
    throw new Error(`Duracao invalida: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2] as 's' | 'm' | 'h' | 'd';
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 } as const;
  return amount * multipliers[unit];
}
