import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Download, Upload, Users, UserPlus } from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'

import { useUsers, useDeleteUser, useBulkAction } from '../../hooks/useUsers'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { Skeleton } from '../../components/ui/skeleton'
import { UserTable } from './components/UserTable'
import { CreateUserModal } from './components/CreateUserModal'
import { EditUserModal } from './components/EditUserModal'
import { InviteUserModal } from './components/InviteUserModal'
import { BulkActions } from './components/BulkActions'

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)

  const debouncedSearch = useDebounce(searchTerm, 500)

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useUsers({
    page,
    limit,
    search: debouncedSearch,
    role: roleFilter,
    status: statusFilter,
  })

  const deleteUser = useDeleteUser()
  const bulkAction = useBulkAction()

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, roleFilter, statusFilter])

  const handleDeleteUser = async () => {
    if (userToDelete) {
      await deleteUser.mutateAsync(userToDelete.id)
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
      setSelectedUsers([])
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return
    await bulkAction.mutateAsync({
      userIds: selectedUsers,
      action,
    })
    setSelectedUsers([])
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  // Pagination calculations
  const totalPages = data?.pagination?.totalPages || 0
  const totalUsers = data?.pagination?.total || 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 font-poppins"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-4xs font-semibold text-[#7C3AED] tracking-wide uppercase">Team Management</p>
          <h1 className="text-2xl font-bold tracking-tight">Creative Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team members and their access permissions
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5"
            onClick={() => setIsInviteModalOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
          <Button
            className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  <Card className="border-white/5 bg-white/[0.02]">
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">Total Users</p>
      <p className="text-2xl font-bold text-white">{data?.pagination?.total || 0}</p>
    </CardContent>
  </Card>
  <Card className="border-white/5 bg-white/[0.02]">
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">Active</p>
      <p className="text-2xl font-bold text-green-400">
        {data?.users?.filter(u => u.status === 'active').length || 0}
      </p>
    </CardContent>
  </Card>
  <Card className="border-white/5 bg-white/[0.02]">
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">Inactive</p>
      <p className="text-2xl font-bold text-red-400">
        {data?.users?.filter(u => u.status === 'inactive').length || 0}
      </p>
    </CardContent>
  </Card>
  <Card className="border-white/5 bg-white/[0.02]">
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">Admins</p>
      <p className="text-2xl font-bold text-[#7C3AED]">
        {data?.users?.filter(u => u.role === 'admin').length || 0}
      </p>
    </CardContent>
  </Card>
</div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-9 bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px] bg-white/[0.02] border-white/10 text-white">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B132B] border-white/10">
              <SelectItem value="">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="team_member">Team Member</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-white/[0.02] border-white/10 text-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B132B] border-white/10">
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <BulkActions
          selectedCount={selectedUsers.length}
          onAction={handleBulkAction}
          onClear={() => setSelectedUsers([])}
        />
      )}

      {/* User Table */}
      <Card className="border-white/5 bg-white/[0.02]">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-white/5" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <p className="text-red-400">Error loading users: {error?.message}</p>
              <Button
                variant="outline"
                className="mt-4 border-white/10 hover:bg-white/5"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <UserTable
              users={data?.users || []}
              selectedUsers={selectedUsers}
              onSelectUser={(userId) => {
                setSelectedUsers(prev =>
                  prev.includes(userId)
                    ? prev.filter(id => id !== userId)
                    : [...prev, userId]
                )
              }}
              onSelectAll={(userIds) => {
                setSelectedUsers(
                  selectedUsers.length === userIds.length
                    ? []
                    : userIds
                )
              }}
              onEdit={handleEditUser}
              onDelete={handleDeleteClick}
              onStatusChange={async (user, newStatus) => {
                // Use the update status hook
                const { useUpdateUserStatus } = await import('../../hooks/useUsers')
                const { mutate } = useUpdateUserStatus()
                mutate({ id: user.id, status: newStatus })
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && totalPages > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalUsers)} of {totalUsers} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 hover:bg-white/5"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={i}
                    variant={page === pageNum ? 'default' : 'outline'}
                    size="sm"
                    className={
                      page === pageNum
                        ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED]'
                        : 'border-white/10 hover:bg-white/5'
                    }
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              {totalPages > 5 && (
                <>
                  <span className="flex items-center px-2 text-muted-foreground">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 hover:bg-white/5"
                    onClick={() => setPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 hover:bg-white/5"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
            <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
              <SelectTrigger className="w-[100px] bg-white/[0.02] border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0B132B] border-white/10">
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          refetch()
        }}
      />

      <EditUserModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={selectedUser}
        onSuccess={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
          refetch()
        }}
      />

      <InviteUserModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onSuccess={() => {
          setIsInviteModalOpen(false)
          refetch()
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#0B132B] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete {userToDelete?.first_name} {userToDelete?.last_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteUser}
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default UsersPage