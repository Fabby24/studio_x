import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/projectService';

export const useProjects = (params) => {
    return useQuery({
        queryKey: ['projects', params],
        queryFn: () => projectService.getAll(params),
        keepPreviousData: true,
        staleTime: 2 * 60 * 1000,
    });
};

export const useProject = (id) => {
    return useQuery({
        queryKey: ['project', id],
        queryFn: () => projectService.getById(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};

export const useProjectStats = () => {
    return useQuery({
        queryKey: ['project-stats'],
        queryFn: projectService.getStats,
        staleTime: 2 * 60 * 1000,
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectService.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
            queryClient.invalidateQueries(['project-stats']);
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => projectService.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries(['projects']);
            queryClient.invalidateQueries(['project', id]);
            queryClient.invalidateQueries(['project-stats']);
        },
    });
};

export const useArchiveProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectService.archive,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries(['projects']);
            queryClient.invalidateQueries(['project', id]);
            queryClient.invalidateQueries(['project-stats']);
        },
    });
};

export const useRestoreProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectService.restore,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries(['projects']);
            queryClient.invalidateQueries(['project', id]);
            queryClient.invalidateQueries(['project-stats']);
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectService.delete,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries(['projects']);
            queryClient.invalidateQueries(['project', id]);
            queryClient.invalidateQueries(['project-stats']);
        },
    });
};

export const useBulkProjectAction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectIds, action }) => {
            if (action === 'archive') {
                return projectService.bulkArchive(projectIds);
            }
            if (action === 'delete') {
                return projectService.bulkDelete(projectIds);
            }
            throw new Error('Invalid action');
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
            queryClient.invalidateQueries(['project-stats']);
        },
    });
};