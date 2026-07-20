import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

export type ErrorEnvelope = {
  error: { code: string; message: string; details?: unknown };
};

const STATUS_CODES: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE_ENTITY',
  429: 'TOO_MANY_REQUESTS',
  500: 'INTERNAL_SERVER_ERROR',
};

/** Converte qualquer excecao no envelope unico { error: { code, message } }. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body: ErrorEnvelope = {
      error: {
        code: STATUS_CODES[status] ?? 'ERROR',
        message: this.resolveMessage(exception, status),
        ...(this.resolveDetails(exception) ? { details: this.resolveDetails(exception) } : {}),
      },
    };

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json(body);
  }

  private resolveMessage(exception: unknown, status: number): string {
    if (status >= 500) {
      // Nunca vazar stack trace ou detalhe interno para o cliente.
      return 'Erro interno do servidor.';
    }

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      if (typeof payload === 'string') return payload;
      if (typeof payload === 'object' && payload !== null) {
        const maybe = payload as { message?: unknown };
        if (typeof maybe.message === 'string') return maybe.message;
        if (Array.isArray(maybe.message)) return maybe.message.join('; ');
      }
      return exception.message;
    }

    return 'Erro inesperado.';
  }

  private resolveDetails(exception: unknown): unknown {
    if (!(exception instanceof HttpException)) return undefined;
    const payload = exception.getResponse();
    if (typeof payload !== 'object' || payload === null) return undefined;
    const maybe = payload as { errors?: unknown };
    return maybe.errors;
  }
}
