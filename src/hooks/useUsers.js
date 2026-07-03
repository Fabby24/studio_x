import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'

export const useUsers = (params) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAll(params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, 
  })
}

export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['users'])
      queryClient.invalidateQueries(['user', id])
    },
  })
}

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }) => userService.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['users'])
      queryClient.invalidateQueries(['user', id])
    },
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, role }) => userService.updateRole(id, role),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['users'])
      queryClient.invalidateQueries(['user', id])
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    },
  })
}

export const useInviteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: userService.invite,
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    },
  })
}

export const useBulkAction = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userIds, action }) => {
      if (action === 'delete') {
        return userService.bulkDelete(userIds)
      }
      const status = action === 'activate' ? 'active' : 'inactive'
      return userService.bulkStatus(userIds, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    },
  })
}