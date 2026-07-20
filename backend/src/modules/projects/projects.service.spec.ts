import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectsService } from './projects.service';
import type { ProjectsRepository, ProjectRecord } from './projects.repository';
import type { ProjectInput } from './dto/project.dto';

const project: ProjectRecord = {
  id: 'e2b0f1a4-0000-4000-8000-000000000001',
  title: 'Change Tracker',
  icon: 'chart',
  description: 'Auditoria de mudancas',
  link: 'https://example.com',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

function makeRepository(): ProjectsRepository {
  return {
    findManyPaginated: vi.fn().mockResolvedValue([[project], 1]),
    findById: vi.fn().mockResolvedValue(project),
    create: vi.fn().mockResolvedValue(project),
    update: vi.fn().mockResolvedValue(project),
    delete: vi.fn().mockResolvedValue(undefined),
  } as unknown as ProjectsRepository;
}

describe('ProjectsService', () => {
  let repository: ProjectsRepository;
  let service: ProjectsService;

  beforeEach(() => {
    repository = makeRepository();
    service = new ProjectsService(repository);
  });

  it('devolve o envelope paginado', async () => {
    const result = await service.list(1, 20);
    expect(result).toEqual({ data: [project], total: 1, page: 1, limit: 20 });
  });

  it('lanca 404 quando o projeto nao existe', async () => {
    vi.mocked(repository.findById).mockResolvedValueOnce(null);
    await expect(service.findOne('inexistente')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('faz trim dos campos e gera um uuid na criacao', async () => {
    const input: ProjectInput = {
      title: '  Meu projeto  ',
      icon: 'rocket',
      description: '  descricao  ',
      link: '  https://example.com  ',
    };

    await service.create(input);

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Meu projeto',
        icon: 'rocket',
        description: 'descricao',
        link: 'https://example.com',
        id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      }),
    );
  });

  it('cai para o icone padrao quando o valor e desconhecido', async () => {
    await service.create({
      title: 'X',
      icon: 'desconhecido' as ProjectInput['icon'],
      description: 'y',
      link: 'https://example.com',
    });

    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ icon: 'folder' }));
  });

  it('nao deleta um projeto inexistente', async () => {
    vi.mocked(repository.findById).mockResolvedValueOnce(null);
    await expect(service.remove('x')).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
