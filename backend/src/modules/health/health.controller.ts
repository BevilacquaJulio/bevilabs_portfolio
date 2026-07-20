import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liveness' })
  health(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Readiness — executa SELECT 1 no MySQL' })
  async ready(): Promise<{ status: 'ok'; database: 'up' }> {
    const up = await this.prisma.ping();
    if (!up) {
      throw new ServiceUnavailableException('Banco de dados indisponivel.');
    }
    return { status: 'ok', database: 'up' };
  }
}
