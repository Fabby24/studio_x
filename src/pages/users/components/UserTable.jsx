import { MoreHorizontal, Edit, Trash2, UserCheck, UserX, Building2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Checkbox } from '../../../components/ui/checkbox';
import { useAuthStore } from '../../../store/authStore';

const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

const getStatusColor = (status) => {
    return status === 'active'
        ? 'bg-green-500/10 text-green-400 border-green-500/20'
        : 'bg-red-500/10 text-red-400 border-red-500/20';
};

const getRoleColor = (role) => {
    const colors = {
        super_admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        org_admin: 'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20',
        team_member: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20',
    };
    return colors[role] || colors.team_member;
};

const getRoleLabel = (role) => {
    const labels = {
        super_admin: 'Super Admin',
        org_admin: 'Org Admin',
        team_member: 'Team Member',
    };
    return labels[role] || role;
};

export const UserTable = ({
    users,
    selectedUsers,
    onSelectUser,
    onSelectAll,
    onEdit,
    onStatusChange,
}) => {
    const { user: currentUser } = useAuthStore();
    const isSuperAdmin = currentUser?.role === 'super_admin';

    const allIds = users.map(u => u.id);
    const allSelected = selectedUsers.length === users.length && users.length > 0;

    if (users.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="text-4xl mb-3">👥</div>
                <p className="text-white font-medium">No team members yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                    {isSuperAdmin 
                        ? 'No users registered on the platform yet.'
                        : 'Invite your first team member to start collaborating.'}
                </p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="w-[40px]">
                        <Checkbox
                            checked={allSelected}
                            onCheckedChange={() => onSelectAll(allIds)}
                            className="border-white/20 data-[state=checked]:bg-[#2563EB]"
                        />
                    </TableHead>
                    <TableHead className="text-muted-foreground">User</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    {isSuperAdmin && (
                        <TableHead className="text-muted-foreground">Organization</TableHead>
                    )}
                    <TableHead className="text-muted-foreground">Role</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02]">
                        <TableCell>
                            <Checkbox
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={() => onSelectUser(user.id)}
                                className="border-white/20 data-[state=checked]:bg-[#2563EB]"
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
                                        {user.first_name || 'Pending'} {user.last_name || ''}
                                    </p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                            {user.email}
                        </TableCell>
                        {isSuperAdmin && (
                            <TableCell className="text-sm text-white/60">
                                {user.organization?.name || 'N/A'}
                            </TableCell>
                        )}
                        <TableCell>
                            <Badge className={getRoleColor(user.role)}>
                                {getRoleLabel(user.role)}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`} />
                                {user.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
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
                                    {user.role !== 'super_admin' && (
                                        <>
                                            <DropdownMenuItem
                                                className="cursor-pointer hover:bg-white/5"
                                                onClick={() => onEdit(user)}
                                            >
                                                <Edit className="mr-2 h-4 w-4 text-[#2563EB]" />
                                                Edit
                                            </DropdownMenuItem>
                                            {user.status === 'active' ? (
                                                <DropdownMenuItem
                                                    className="cursor-pointer hover:bg-white/5"
                                                    onClick={() => onStatusChange(user, 'inactive')}
                                                >
                                                    <UserX className="mr-2 h-4 w-4 text-orange-400" />
                                                    Deactivate
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem
                                                    className="cursor-pointer hover:bg-white/5"
                                                    onClick={() => onStatusChange(user, 'active')}
                                                >
                                                    <UserCheck className="mr-2 h-4 w-4 text-green-400" />
                                                    Activate
                                                </DropdownMenuItem>
                                            )}
                                        </>
                                    )}
                                    {user.role === 'super_admin' && (
                                        <DropdownMenuItem disabled className="text-muted-foreground">
                                            Super Admin actions restricted
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};