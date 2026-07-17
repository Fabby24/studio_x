import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Loader2 } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useProjects, useProjectStats, useBulkProjectAction } from '../../hooks/useProjects';
import { useAuthStore } from '../../store/authStore';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import ProjectStats from './components/ProjectStats';
import ProjectFilters from './components/ProjectFilters';
import ProjectTable from './components/ProjectTable';
import BulkActions from './components/BulkActions';
import CreateProjectDialog from './components/CreateProjectDialog';
import EditProjectDialog from './components/EditProjectDialog';

const ProjectsPage = () => {
    const { user } = useAuthStore();
    const isOrgAdmin = user?.role === 'org_admin';
    const isTeamMember = user?.role === 'team_member';

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [projectTypeFilter, setProjectTypeFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [healthFilter, setHealthFilter] = useState('');
    const [showArchived, setShowArchived] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedProjects, setSelectedProjects] = useState([]);

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const debouncedSearch = useDebounce(searchTerm, 500);

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useProjects({
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        projectType: projectTypeFilter,
        department: departmentFilter,
        healthStatus: healthFilter,
        includeArchived: showArchived,
    });

    const { data: stats, isLoading: statsLoading } = useProjectStats();
    const bulkAction = useBulkProjectAction();

    const hasFilters = searchTerm || statusFilter || priorityFilter || projectTypeFilter || departmentFilter || healthFilter || showArchived;

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter, priorityFilter, projectTypeFilter, departmentFilter, healthFilter, showArchived]);

    const handleEditProject = (project) => {
        setSelectedProject(project);
        setIsEditDialogOpen(true);
    };

    const handleArchiveProject = async (project) => {
        // Use the archive mutation
        const { useArchiveProject } = await import('../../hooks/useProjects');
        const { mutate } = useArchiveProject();
        mutate(project.id);
    };

    const handleRestoreProject = async (project) => {
        const { useRestoreProject } = await import('../../hooks/useProjects');
        const { mutate } = useRestoreProject();
        mutate(project.id);
    };

    const handleDeleteProject = async (project) => {
        const { useDeleteProject } = await import('../../hooks/useProjects');
        const { mutate } = useDeleteProject();
        mutate(project.id);
    };

    const handleBulkAction = async (action) => {
        if (selectedProjects.length === 0) return;
        await bulkAction.mutateAsync({
            projectIds: selectedProjects,
            action,
        });
        setSelectedProjects([]);
    };

    const totalProjects = data?.pagination?.total || 0;
    const totalPages = data?.pagination?.totalPages || 0;

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setPriorityFilter('');
        setProjectTypeFilter('');
        setDepartmentFilter('');
        setHealthFilter('');
        setShowArchived(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 font-poppins"
        >
            {/* Page Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">Projects</p>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all your projects and track their progress
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    {isOrgAdmin && (
                        <Button
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Project
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <ProjectStats stats={stats} isLoading={statsLoading} />

            {/* Filters */}
            <ProjectFilters
                search={searchTerm}
                onSearchChange={setSearchTerm}
                status={statusFilter}
                onStatusChange={setStatusFilter}
                priority={priorityFilter}
                onPriorityChange={setPriorityFilter}
                projectType={projectTypeFilter}
                onProjectTypeChange={setProjectTypeFilter}
                department={departmentFilter}
                onDepartmentChange={setDepartmentFilter}
                healthStatus={healthFilter}
                onHealthStatusChange={setHealthFilter}
                showArchived={showArchived}
                onShowArchivedChange={setShowArchived}
                onClearFilters={handleClearFilters}
                hasFilters={hasFilters}
            />

            {/* Bulk Actions */}
            {selectedProjects.length > 0 && (
                <BulkActions
                    selectedCount={selectedProjects.length}
                    onAction={handleBulkAction}
                    onClear={() => setSelectedProjects([])}
                />
            )}

            {/* Project Table */}
            <Card className="border-border bg-card">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="space-y-2 p-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full bg-muted/50" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="p-8 text-center">
                            <p className="text-red-400">Error loading projects: {error?.message}</p>
                            <Button
                                variant="outline"
                                className="mt-4 border-border text-foreground hover:bg-accent"
                                onClick={() => refetch()}
                            >
                                Retry
                            </Button>
                        </div>
                    ) : (
                        <ProjectTable
                            projects={data?.projects || []}
                            selectedProjects={selectedProjects}
                            onSelectProject={(projectId) => {
                                setSelectedProjects(prev =>
                                    prev.includes(projectId)
                                        ? prev.filter(id => id !== projectId)
                                        : [...prev, projectId]
                                );
                            }}
                            onSelectAll={(projectIds) => {
                                setSelectedProjects(
                                    selectedProjects.length === projectIds.length ? [] : projectIds
                                );
                            }}
                            onEdit={handleEditProject}
                            onArchive={handleArchiveProject}
                            onRestore={handleRestoreProject}
                            onDelete={handleDeleteProject}
                            isOrgAdmin={isOrgAdmin}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {!isLoading && totalPages > 0 && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalProjects)} of {totalProjects} projects
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-border text-foreground hover:bg-accent"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex gap-1">
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <Button
                                        key={i}
                                        variant={page === pageNum ? 'default' : 'outline'}
                                        size="sm"
                                        className={
                                            page === pageNum
                                                ? 'bg-primary hover:bg-primary/90'
                                                : 'border-border text-foreground hover:bg-accent'
                                        }
                                        onClick={() => setPage(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                            {totalPages > 5 && (
                                <>
                                    <span className="flex items-center px-2 text-muted-foreground">...</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-border text-foreground hover:bg-accent"
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
                            className="border-border text-foreground hover:bg-accent"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                        <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                            <SelectTrigger className="w-[100px] bg-card border-border text-foreground">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                <SelectItem value="10">10 / page</SelectItem>
                                <SelectItem value="25">25 / page</SelectItem>
                                <SelectItem value="50">50 / page</SelectItem>
                                <SelectItem value="100">100 / page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Dialogs */}
            <CreateProjectDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSuccess={() => {
                    setIsCreateDialogOpen(false);
                    refetch();
                }}
            />

            <EditProjectDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                project={selectedProject}
                onSuccess={() => {
                    setIsEditDialogOpen(false);
                    setSelectedProject(null);
                    refetch();
                }}
            />
        </motion.div>
    );
};

export default ProjectsPage;