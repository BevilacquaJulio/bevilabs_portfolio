import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Paginated } from '../../common/dto/pagination.dto';
import type { ProjectInput } from './dto/project.dto';
import { normalizeIcon } from './project-icons';
import { ProjectsRepository, type ProjectRecord } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(private readonly repository: ProjectsRepository) {}

  async list(page: number, limit: number): Promise<Paginated<ProjectRecord>> {
    const [data, total] = await this.repository.findManyPaginated(page, limit);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<ProjectRecord> {
    const project = await this.repository.findById(id);
    if (!project) {
      throw new NotFoundException('Projeto nao encontrado.');
    }
    return project;
  }

  create(input: ProjectInput): Promise<ProjectRecord> {
    return this.repository.create({ ...this.sanitize(input), id: randomUUID() });
  }

  async update(id: string, input: ProjectInput): Promise<ProjectRecord> {
    await this.findOne(id);
    return this.repository.update(id, this.sanitize(input));
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }

  private sanitize(input: ProjectInput): ProjectInput {
    return {
      title: input.title.trim(),
      icon: normalizeIcon(input.icon),
      description: input.description.trim(),
      link: input.link.trim(),
    };
  }
}
