import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientService } from '../services/clientService'

export const useClients = (params) => {
    return useQuery({
        queryKey: ['clients', params],
        queryFn: () => clientService.getAll(params),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, 
    })
}

export const useClient = (id) => {
    return useQuery({
        queryKey: ['client', id],
        queryFn: () => clientService.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    })
}

export const useClientStats = () => {
    return useQuery({
        queryKey: ['client-stats'],
        queryFn: () => clientService.getStats(),
        staleTime: 5 * 60 * 1000,
    })
}

export const useCreateClient = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: clientService.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['clients'])
            queryClient.invalidateQueries(['client-stats'])
        },
    })
}

export const useUpdateClient = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: ({ id, data }) => clientService.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries(['clients'])
            queryClient.invalidateQueries(['client', id])
            queryClient.invalidateQueries(['client-stats'])
        },
    })
}

export const useUpdateClientStatus = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: ({ id, status }) => clientService.updateStatus(id, status),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries(['clients'])
            queryClient.invalidateQueries(['client', id])
            queryClient.invalidateQueries(['client-stats'])
        },
    })
}

export const useArchiveClient = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: clientService.archive,
        onSuccess: () => {
            queryClient.invalidateQueries(['clients'])
            queryClient.invalidateQueries(['client-stats'])
        },
    })
}

export const useDeleteClient = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: clientService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['clients'])
            queryClient.invalidateQueries(['client-stats'])
        },
    })
}

export const useBulkClientAction = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: ({ ids, action, status }) => {
            switch (action) {
                case 'activate':
                    return clientService.bulkStatus(ids, 'active')
                case 'deactivate':
                    return clientService.bulkStatus(ids, 'inactive')
                case 'archive':
                    return clientService.bulkArchive(ids)
                case 'delete':
                    return clientService.bulkDelete(ids)
                default:
                    throw new Error('Invalid action')
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['clients'])
            queryClient.invalidateQueries(['client-stats'])
        },
    })
}