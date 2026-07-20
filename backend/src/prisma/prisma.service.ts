import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client';
import { buildDatabaseUrl } from '../config/database-url';

/**
 * Prisma 7 exige um driver adapter. `new PrismaClient()` sem adapter lanca no boot.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({ adapter: new PrismaMariaDb(buildDatabaseUrl()) });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Conexao com o MySQL estabelecida.');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  /** Readiness check — usado por GET /api/health/ready. */
  async ping(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
