import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { ProjectInput } from './dto/project.dto';

export type ProjectRecord = {
  id: string;
  title: string;
  icon: string;
  description: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyPaginated(page: number, limit: number): Promise<[ProjectRecord[], number]> {
    const offset = (page - 1) * limit;

    // SQL direto: o adapter MariaDB do Prisma 7 pode abrir transacao implicita em findMany/count
    // e, com pool pequeno, estourar "Unable to start a transaction in the given time".
    const data = await this.prisma.$queryRaw<ProjectRecord[]>`
      SELECT
        id,
        title,
        icon,
        description,
        link,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM projects
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countRows = await this.prisma.$queryRaw<[{ total: bigint | number }]>`
      SELECT COUNT(*) AS total FROM projects
    `;
    const total = Number(countRows[0]?.total ?? 0);

    return [data, total];
  }

  findById(id: string): Promise<ProjectRecord | null> {
    return this.prisma.project.findUnique({ where: { id } });
  }

  create(data: ProjectInput & { id: string }): Promise<ProjectRecord> {
    return this.prisma.project.create({ data });
  }

  update(id: string, data: ProjectInput): Promise<ProjectRecord> {
    return this.prisma.project.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }
}
