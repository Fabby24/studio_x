import { MoreHorizontal, Edit, Archive, Trash2, UserCheck, UserX, Building2 } from 'lucide-react'
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

const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C'
}

const getStatusColor = (status) => {
    return status === 'active'
        ? 'bg-green-500/10 text-green-400 border-green-500/20'
        : 'bg-red-500/10 text-red-400 border-red-500/20'
}

const getPriorityColor = (priority) => {
    const colors = {
        high: 'bg-red-500/10 text-red-400 border-red-500/20',
        medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    }
    return colors[priority] || colors.medium
}

const getPriorityLabel = (priority) => {
    const labels = {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
    }
    return labels[priority] || priority
}

export const ClientTable = ({
    clients,
    selectedClients,
    onSelectClient,
    onSelectAll,
    onEdit,
    onArchive,
    onStatusChange,
}) => {
    const allIds = clients.map(c => c.id)
    const allSelected = selectedClients.length === clients.length && clients.length > 0

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
                    <TableHead className="text-muted-foreground">Client</TableHead>
                    <TableHead className="text-muted-foreground">Industry</TableHead>
                    <TableHead className="text-muted-foreground">Assigned To</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Priority</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {clients.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            No clients found
                        </TableCell>
                    </TableRow>
                ) : (
                    clients.map((client) => (
                        <TableRow key={client.id} className="border-white/5 hover:bg-white/[0.02]">
                            <TableCell>
                                <Checkbox
                                    checked={selectedClients.includes(client.id)}
                                    onCheckedChange={() => onSelectClient(client.id)}
                                    className="border-white/20 data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB]"
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border border-white/10">
                                        <AvatarImage src={client.logo} />
                                        <AvatarFallback className="bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white text-xs font-semibold">
                                            {getInitials(client.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {client.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {client.company || client.email}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="border-white/10 text-muted-foreground">
                                    {client.industry || 'N/A'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {client.assigned_first_name && client.assigned_last_name
                                    ? `${client.assigned_first_name} ${client.assigned_last_name}`
                                    : 'Unassigned'
                                }
                            </TableCell>
                            <TableCell>
                                <Badge className={getStatusColor(client.status)}>
                                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${client.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`} />
                                    {client.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={getPriorityColor(client.priority)}>
                                    {getPriorityLabel(client.priority)}
                                </Badge>
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
                                            onClick={() => onEdit(client)}
                                        >
                                            <Edit className="mr-2 h-4 w-4 text-[#2563EB]" />
                                            Edit
                                        </DropdownMenuItem>
                                        {client.status === 'active' ? (
                                            <DropdownMenuItem
                                                className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                                                onClick={() => onStatusChange(client, 'inactive')}
                                            >
                                                <UserX className="mr-2 h-4 w-4 text-orange-400" />
                                                Deactivate
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                                                onClick={() => onStatusChange(client, 'active')}
                                            >
                                                <UserCheck className="mr-2 h-4 w-4 text-green-400" />
                                                Activate
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                                            onClick={() => onArchive(client)}
                                        >
                                            <Archive className="mr-2 h-4 w-4 text-orange-400" />
                                            Archive
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