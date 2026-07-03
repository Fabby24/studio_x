import { MoreHorizontal, Edit, Trash2, UserCheck, UserX } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Checkbox } from '../../../components/ui/checkbox'

const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
}

const getStatusColor = (status) => {
  return status === 'active'
    ? 'bg-green-500/10 text-green-400 border-green-500/20'
    : 'bg-red-500/10 text-red-400 border-red-500/20'
}

const getRoleColor = (role) => {
  return role === 'admin'
    ? 'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20'
    : 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20'
}

export const UserTable = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const allIds = users.map(u => u.id)
  const allSelected = selectedUsers.length === users.length && users.length > 0

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead className="w-[40px]">
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => onSelectAll(allIds)}
              className="border-white/20 data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB]"
            />
          </TableHead>
          <TableHead className="text-muted-foreground">User</TableHead>
          <TableHead className="text-muted-foreground">Email</TableHead>
          <TableHead className="text-muted-foreground">Role</TableHead>
          <TableHead className="text-muted-foreground">Status</TableHead>
          <TableHead className="text-muted-foreground">Joined</TableHead>
          <TableHead className="text-right text-muted-foreground">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02]">
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => onSelectUser(user.id)}
                  className="border-white/20 data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB]"
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarImage src={user.profile_image} />
                    <AvatarFallback className="bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white text-xs font-semibold">
                      {getInitials(user.first_name, user.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                <Badge className={getRoleColor(user.role)}>
                  {user.role === 'admin' ? 'Admin' : 'Team Member'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(user.status)}>
                  <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`} />
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#0B132B] border-white/10 text-white" align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                      onClick={() => onEdit(user)}
                    >
                      <Edit className="mr-2 h-4 w-4 text-[#2563EB]" />
                      Edit
                    </DropdownMenuItem>
                    {user.status === 'active' ? (
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                        onClick={() => onStatusChange(user, 'inactive')}
                      >
                        <UserX className="mr-2 h-4 w-4 text-orange-400" />
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                        onClick={() => onStatusChange(user, 'active')}
                      >
                        <UserCheck className="mr-2 h-4 w-4 text-green-400" />
                        Activate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                      onClick={() => onDelete(user)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}