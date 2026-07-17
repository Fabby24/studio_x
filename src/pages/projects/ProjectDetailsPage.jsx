import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Edit,
    Archive,
    Trash2,
    RefreshCw,
    Users,
    Calendar,
    Clock,
    DollarSign,
    FileText,
    Activity,
    MessageSquare,
    Paperclip,
    User,
    Building2,
    Tag,
    AlertCircle,
    CheckCircle,
    Clock as ClockIcon,
    MoreVertical,
    Download,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { projectService } from '../../services/projectService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Skeleton } from '../../components/ui/skeleton';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuthStore } from '../../store/authStore';
import {
    STATUS_LABELS,
    STATUS_COLORS,
    PRIORITY_LABELS,
    PRIORITY_COLORS,
    HEALTH_LABELS,
    HEALTH_COLORS,
    TYPE_LABELS,
    DEPARTMENT_LABELS,
} from '../../config/projectConstants';
import EditProjectDialog from './components/EditProjectDialog';
import toast from 'react-hot-toast';

// Sub-components
const ProjectOverview = ({ project }) => {
    const statusColor = STATUS_COLORS[project.status] || 'bg-muted text-muted-foreground';
    const priorityColor = PRIORITY_COLORS[project.priority] || 'bg-muted text-muted-foreground';
    const healthColor = HEALTH_COLORS[project.health_status] || 'bg-muted text-muted-foreground';

    const getHealthIcon = (status) => {
        switch (status) {
            case 'on_track':
                return <CheckCircle className="h-4 w-4" />;
            case 'at_risk':
                return <AlertCircle className="h-4 w-4" />;
            case 'delayed':
                return <ClockIcon className="h-4 w-4" />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Project Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div
                            className="h-4 w-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: project.color || '#2563EB' }}
                        />
                        <h2 className="text-2xl font-bold text-foreground">{project.name}</h2>
                        <Badge className={statusColor}>{STATUS_LABELS[project.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {project.project_code} • Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                    </p>
                </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg p-2 bg-primary/10">
                                <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Progress</p>
                                <p className="text-lg font-bold text-foreground">{project.completion_percentage || 0}%</p>
                            </div>
                        </div>
                        <Progress value={project.completion_percentage || 0} className="h-1.5 bg-muted mt-2" />
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg p-2 bg-green-500/10">
                                <DollarSign className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Budget</p>
                                <p className="text-lg font-bold text-foreground">
                                    {project.budget ? `$${project.budget.toLocaleString()}` : '—'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg p-2 bg-purple-500/10">
                                <Clock className="h-4 w-4 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Hours</p>
                                <p className="text-lg font-bold text-foreground">
                                    {project.estimated_hours || 0}h
                                    {project.actual_hours && (
                                        <span className="text-sm text-muted-foreground font-normal ml-1">
                                            / {project.actual_hours}h actual
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg p-2 bg-orange-500/10">
                                <Calendar className="h-4 w-4 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Due Date</p>
                                <p className="text-lg font-bold text-foreground">
                                    {project.due_date ? format(new Date(project.due_date), 'MMM d, yyyy') : '—'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Type</span>
                            <span className="text-foreground">{TYPE_LABELS[project.project_type] || project.project_type}</span>
                        </div>
                        <Separator className="bg-border" />
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Department</span>
                            <span className="text-foreground">{DEPARTMENT_LABELS[project.department] || project.department}</span>
                        </div>
                        <Separator className="bg-border" />
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Priority</span>
                            <Badge className={priorityColor}>{PRIORITY_LABELS[project.priority]}</Badge>
                        </div>
                        <Separator className="bg-border" />
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Health</span>
                            <Badge className={healthColor}>
                                <span className="flex items-center gap-1">
                                    {getHealthIcon(project.health_status)}
                                    {HEALTH_LABELS[project.health_status]}
                                </span>
                            </Badge>
                        </div>
                        <Separator className="bg-border" />
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Billable</span>
                            <span className="text-foreground">{project.billable ? 'Yes' : 'No'}</span>
                        </div>
                        <Separator className="bg-border" />
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Internal</span>
                            <span className="text-foreground">{project.is_internal ? 'Yes' : 'No'}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">Team</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Project Manager</p>
                            {project.manager ? (
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={project.manager.profile_image} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {project.manager.first_name?.[0]}{project.manager.last_name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-foreground">
                                        {project.manager.first_name} {project.manager.last_name}
                                    </span>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No manager assigned</p>
                            )}
                        </div>
                        <Separator className="bg-border" />
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Team Members ({project.team_members?.length || 0})</p>
                            {project.team_members?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.team_members.map((member) => (
                                        <div key={member.user_id} className="flex items-center gap-1.5 bg-accent/10 px-2 py-1 rounded-md">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                                    {member.user.first_name?.[0]}{member.user.last_name?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-foreground">
                                                {member.user.first_name} {member.user.last_name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No team members assigned</p>
                            )}
                        </div>
                        <Separator className="bg-border" />
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Client</p>
                            {project.client ? (
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-foreground">{project.client.name}</span>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No client assigned</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Description */}
            {project.description && (
                <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.description}</p>
                    </CardContent>
                </Card>
            )}

            {/* Notes */}
            {project.notes && (
                <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

const ProjectActivity = ({ activities }) => {
    if (!activities || activities.length === 0) {
        return (
            <div className="py-8 text-center">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No activity recorded yet</p>
            </div>
        );
    }

    const getActionColor = (action) => {
        if (action.includes('created')) return 'text-green-400';
        if (action.includes('updated')) return 'text-blue-400';
        if (action.includes('archived')) return 'text-orange-400';
        if (action.includes('deleted')) return 'text-red-400';
        if (action.includes('restored')) return 'text-purple-400';
        return 'text-muted-foreground';
    };

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm">
                            <span className="font-medium text-foreground">
                                {activity.user ? `${activity.user.first_name} ${activity.user.last_name}` : 'System'}
                            </span>
                            <span className={`text-muted-foreground ml-1 ${getActionColor(activity.action)}`}>
                                {activity.action.replace(/_/g, ' ')}
                            </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </p>
                        {activity.description && (
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const isOrgAdmin = user?.role === 'org_admin';

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['project', id],
        queryFn: () => projectService.getById(id),
        enabled: !!id,
    });

    const project = data;

    // Archive mutation
    const archiveMutation = useMutation({
        mutationFn: () => projectService.archive(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['project', id]);
            queryClient.invalidateQueries(['projects']);
            queryClient.invalidateQueries(['project-stats']);
            toast.success('Project archived successfully');
            setIsArchiveDialogOpen(false);
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to archive project');
        },
    });

    // Restore mutation
    const restoreMutation = useMutation({
        mutationFn: () => projectService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['project', id]);
            queryClient.invalidateQueries(['projects']);
            queryClient.invalidateQueries(['project-stats']);
            toast.success('Project restored successfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to restore project');
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: () => projectService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
            queryClient.invalidateQueries(['project-stats']);
            toast.success('Project deleted successfully');
            navigate('/projects');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete project');
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-6 font-poppins">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-24 bg-muted/50" />
                    <Skeleton className="h-10 w-64 bg-muted/50" />
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24 bg-muted/50" />
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Skeleton className="h-64 bg-muted/50" />
                    <Skeleton className="h-64 bg-muted/50" />
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400">Failed to load project details</p>
                    <p className="text-sm text-muted-foreground mt-1">{error?.message || 'Project not found'}</p>
                    <Button
                        variant="outline"
                        className="mt-4 border-border text-foreground hover:bg-accent"
                        onClick={() => navigate('/projects')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                </div>
            </div>
        );
    }

    const isArchived = project.archived;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 font-poppins"
        >
            {/* Header with Actions */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/projects')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                </Button>

                <div className="flex items-center gap-2">
                    {isArchived && (
                        <Badge variant="outline" className="border-border text-muted-foreground">
                            Archived
                        </Badge>
                    )}
                    {isOrgAdmin && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-card border-border text-foreground" align="end">
                                {isArchived ? (
                                    <DropdownMenuItem
                                        className="cursor-pointer hover:bg-accent"
                                        onClick={() => restoreMutation.mutate()}
                                        disabled={restoreMutation.isPending}
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4 text-green-400" />
                                        Restore Project
                                    </DropdownMenuItem>
                                ) : (
                                    <>
                                        <DropdownMenuItem
                                            className="cursor-pointer hover:bg-accent"
                                            onClick={() => setIsEditDialogOpen(true)}
                                        >
                                            <Edit className="mr-2 h-4 w-4 text-primary" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer hover:bg-accent"
                                            onClick={() => setIsArchiveDialogOpen(true)}
                                        >
                                            <Archive className="mr-2 h-4 w-4 text-orange-400" />
                                            Archive
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem
                                    className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Project Content */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-card border-border">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Activity
                    </TabsTrigger>
                    <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Team
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <ProjectOverview project={project} />
                </TabsContent>

                <TabsContent value="activity">
                    <Card className="border-border bg-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-foreground">Activity Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProjectActivity activities={project.activities} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team">
                    <Card className="border-border bg-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-foreground">Team Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {project.team_members?.length > 0 ? (
                                <div className="space-y-3">
                                    {project.team_members.map((member) => (
                                        <div key={member.user_id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={member.user.profile_image} />
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                        {member.user.first_name?.[0]}{member.user.last_name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {member.user.first_name} {member.user.last_name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{member.user.email}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="border-border text-muted-foreground">
                                                {member.role || 'Member'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No team members assigned</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <EditProjectDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                project={project}
                onSuccess={() => {
                    setIsEditDialogOpen(false);
                    refetch();
                }}
            />

            {/* Archive Dialog */}
            <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
                <DialogContent className="bg-card border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>Archive Project</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Are you sure you want to archive "{project.name}"? The project can be restored later.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-accent"
                            onClick={() => setIsArchiveDialogOpen(false)}
                            disabled={archiveMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={() => archiveMutation.mutate()}
                            disabled={archiveMutation.isPending}
                        >
                            {archiveMutation.isPending ? 'Archiving...' : 'Archive Project'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-card border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>Delete Project</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Are you sure you want to permanently delete "{project.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-accent"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => deleteMutation.mutate()}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete Project'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default ProjectDetailsPage;