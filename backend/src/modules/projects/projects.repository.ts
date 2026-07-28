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
    // Sequencial: evita $transaction (timeout no adapter MariaDB) e nao esgota o pool.
    const data = await this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await this.prisma.project.count();
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
