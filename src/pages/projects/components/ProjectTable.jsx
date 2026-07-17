import { MoreHorizontal, Edit, Archive, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { Progress } from '../../../components/ui/progress';
import {
    STATUS_LABELS,
    STATUS_COLORS,
    PRIORITY_LABELS,
    PRIORITY_COLORS,
    HEALTH_LABELS,
    HEALTH_COLORS,
} from '../../../config/projectConstants';
import { format } from 'date-fns';

const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

const ProjectTable = ({
    projects,
    selectedProjects,
    onSelectProject,
    onSelectAll,
    onEdit,
    onArchive,
    onDelete,
    onRestore,
    isOrgAdmin = false,
}) => {
    const allIds = projects.map(p => p.id);
    const allSelected = selectedProjects.length === projects.length && projects.length > 0;

    if (projects.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-foreground font-medium">No projects found</p>
                <p className="text-sm text-muted-foreground mt-1">
                    {isOrgAdmin
                        ? 'Create your first project to start tracking work'
                        : 'No projects have been assigned to you yet'}
                </p>
                {isOrgAdmin && (
                    <Button className="mt-4 bg-primary hover:bg-primary/90">
                        Create Project
                    </Button>
                )}
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[40px]">
                        <Checkbox
                            checked={allSelected}
                            onCheckedChange={() => onSelectAll(allIds)}
                            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                    </TableHead>
                    <TableHead className="text-muted-foreground">Project</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">Client</TableHead>
                    <TableHead className="text-muted-foreground hidden lg:table-cell">Manager</TableHead>
                    <TableHead className="text-muted-foreground">Priority</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground hidden lg:table-cell">Progress</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">Due Date</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projects.map((project) => {
                    const isArchived = project.archived;
                    const statusLabel = STATUS_LABELS[project.status] || project.status;
                    const priorityLabel = PRIORITY_LABELS[project.priority] || project.priority;
                    const healthLabel = HEALTH_LABELS[project.health_status] || project.health_status;

                    return (
                        <TableRow
                            key={project.id}
                            className={`border-border hover:bg-accent/5 transition-colors ${isArchived ? 'opacity-60' : ''}`}
                        >
                            <TableCell>
                                <Checkbox
                                    checked={selectedProjects.includes(project.id)}
                                    onCheckedChange={() => onSelectProject(project.id)}
                                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    disabled={isArchived}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-3 w-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: project.color || '#2563EB' }}
                                    />
                                    <div>
                                        <Link
                                            to={`/projects/${project.id}`}
                                            className="font-medium text-foreground hover:text-primary transition-colors"
                                        >
                                            {project.name}
                                        </Link>
                                        <p className="text-xs text-muted-foreground">
                                            {project.project_code}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                                {project.client?.name || '—'}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                {project.manager ? (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={project.manager.profile_image} />
                                            <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                                {getInitials(project.manager.first_name, project.manager.last_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-foreground">
                                            {project.manager.first_name} {project.manager.last_name}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground">—</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge className={PRIORITY_COLORS[project.priority] || 'bg-muted text-muted-foreground'}>
                                    {priorityLabel}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Badge className={STATUS_COLORS[project.status] || 'bg-muted text-muted-foreground'}>
                                        {statusLabel}
                                    </Badge>
                                    {project.health_status && (
                                        <Badge
                                            className={`${HEALTH_COLORS[project.health_status] || 'bg-muted text-muted-foreground'} text-[10px] px-1.5 py-0.5 hidden md:inline-flex`}
                                        >
                                            {healthLabel}
                                        </Badge>
                                    )}
                                    {isArchived && (
                                        <Badge variant="outline" className="border-border text-muted-foreground text-[10px]">
                                            Archived
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                <div className="flex items-center gap-2 min-w-[80px]">
                                    <Progress value={project.completion_percentage || 0} className="h-2 bg-muted flex-1" />
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {project.completion_percentage || 0}%
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                {project.due_date ? format(new Date(project.due_date), 'MMM d, yyyy') : '—'}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-card border-border text-foreground" align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-border" />
                                        <DropdownMenuItem asChild>
                                            <Link to={`/projects/${project.id}`}>
                                                <ExternalLink className="mr-2 h-4 w-4 text-primary" />
                                                View Details
                                            </Link>
                                        </DropdownMenuItem>
                                        {isOrgAdmin && !isArchived && (
                                            <>
                                                <DropdownMenuItem
                                                    className="cursor-pointer hover:bg-accent"
                                                    onClick={() => onEdit(project)}
                                                >
                                                    <Edit className="mr-2 h-4 w-4 text-primary" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer hover:bg-accent"
                                                    onClick={() => onArchive(project)}
                                                >
                                                    <Archive className="mr-2 h-4 w-4 text-orange-400" />
                                                    Archive
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {isOrgAdmin && isArchived && (
                                            <DropdownMenuItem
                                                className="cursor-pointer hover:bg-accent"
                                                onClick={() => onRestore(project)}
                                            >
                                                <Archive className="mr-2 h-4 w-4 text-green-400" />
                                                Restore
                                            </DropdownMenuItem>
                                        )}
                                        {isOrgAdmin && (
                                            <>
                                                <DropdownMenuSeparator className="bg-border" />
                                                <DropdownMenuItem
                                                    className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                                                    onClick={() => onDelete(project)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default ProjectTable;