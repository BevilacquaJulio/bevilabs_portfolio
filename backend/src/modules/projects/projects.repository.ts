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
    return this.prisma.$transaction([
      this.prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.project.count(),
    ]);
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
