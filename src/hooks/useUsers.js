import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';

export const useUsers = (params) => {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => userService.getAll(params),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });
};

export const useUser = (id) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => userService.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useInviteUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: userService.invite,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }) => userService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        },
    });
};

export const useUpdateUserStatus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, status }) => userService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: userService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        },
    });
};

export const useBulkUserAction = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ userIds, action, status }) => {
            if (action === 'delete') {
                return userService.bulkDelete(userIds);
            }
            return userService.bulkStatus(userIds, status);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        },
    });
};