import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client';
import { buildMariaDbPoolConfig } from '../config/database-url';

/**
 * Prisma 7 exige um driver adapter. `new PrismaClient()` sem adapter lanca no boot.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({ adapter: new PrismaMariaDb(buildMariaDbPoolConfig()) });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();

    // $connect() com driver adapter e lazy: nao abre socket. Sem este SELECT 1
    // o boot logava "conexao estabelecida" mesmo com credencial/handshake
    // quebrado, e a falha so aparecia 10s depois no acquireTimeout do pool.
    try {
      await this.$queryRaw`SELECT 1`;
      this.logger.log('Conexao com o MySQL estabelecida.');
    } catch (error) {
      this.logger.error(
        `Falha ao abrir conexao real com o MySQL: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
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
