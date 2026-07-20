import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type AdminUserRecord = {
  id: number;
  username: string;
  passwordHash: string;
};

/** Unica camada que fala Prisma no modulo de auth. */
@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUsername(username: string): Promise<AdminUserRecord | null> {
    return this.prisma.adminUser.findUnique({
      where: { username },
      select: { id: true, username: true, passwordHash: true },
    });
  }

  async createRefreshToken(input: {
    id: string;
    userId: number;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.prisma.refreshToken.create({ data: input });
  }

  findRefreshToken(id: string) {
    return this.prisma.refreshToken.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        tokenHash: true,
        expiresAt: true,
        revokedAt: true,
        user: { select: { id: true, username: true } },
      },
    });
  }

  async revokeRefreshToken(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: number): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
