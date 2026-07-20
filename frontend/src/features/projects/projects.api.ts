import { api } from '@/lib/api';
import type { PaginatedProjects, Project, ProjectInput } from './projects.types';

export async function listProjects(page = 1, limit = 50): Promise<PaginatedProjects> {
  const { data } = await api.get<PaginatedProjects>('/projects', { params: { page, limit } });
  return data;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { data } = await api.post<Project>('/projects', input);
  return data;
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project> {
  const { data } = await api.put<Project>(`/projects/${id}`, input);
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}
