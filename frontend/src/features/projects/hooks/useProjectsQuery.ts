import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from '../projects.api';
import type { PaginatedProjects, ProjectInput } from '../projects.types';

export const projectsKeys = {
  all: ['projects'] as const,
  list: (page: number, limit: number) => [...projectsKeys.all, 'list', page, limit] as const,
};

export function useProjectsQuery(page = 1, limit = 50) {
  return useQuery<PaginatedProjects>({
    queryKey: projectsKeys.list(page, limit),
    queryFn: () => listProjects(page, limit),
    staleTime: 60_000,
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProjectInput) => createProject(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectsKeys.all }),
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProjectInput }) => updateProject(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectsKeys.all }),
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectsKeys.all }),
  });
}
