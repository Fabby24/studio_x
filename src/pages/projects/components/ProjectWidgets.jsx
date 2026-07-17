import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FolderKanban,
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    ArrowUpRight,
} from 'lucide-react';
import { useProjectStats } from '../../../hooks/useProjects';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Skeleton } from '../../../components/ui/skeleton';
import { Badge } from '../../../components/ui/badge';
import {
    STATUS_LABELS,
    STATUS_COLORS,
    PRIORITY_LABELS,
    PRIORITY_COLORS,
} from '../../../config/projectConstants';
import { format } from 'date-fns';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
    return (
        <Card className="border-border bg-card">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            {title}
                        </p>
                        <p className="text-2xl font-bold text-foreground mt-1">
                            {value !== undefined && value !== null ? value.toLocaleString() : '-'}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                        )}
                    </div>
                    <div className={`rounded-lg p-2.5 bg-${color}/10`}>
                        <Icon className={`h-4 w-4 text-${color}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Status Distribution Chart
const StatusDistribution = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <FolderKanban className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No projects yet</p>
            </div>
        );
    }

    const total = data.reduce((sum, item) => sum + item._count, 0);

    return (
        <div className="space-y-3">
            {data.map((item) => {
                const percentage = total > 0 ? Math.round((item._count / total) * 100) : 0;
                const statusColor = STATUS_COLORS[item.status] || 'bg-muted text-muted-foreground';

                return (
                    <div key={item.status}>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <Badge className={statusColor}>
                                    {STATUS_LABELS[item.status] || item.status}
                                </Badge>
                                <span className="text-muted-foreground text-xs">{item._count}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-1.5 bg-muted mt-1" />
                    </div>
                );
            })}
        </div>
    );
};

// Priority Distribution
const PriorityDistribution = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <p className="text-sm">No projects with priority data</p>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {data.map((item) => {
                const priorityColor = PRIORITY_COLORS[item.priority] || 'bg-muted text-muted-foreground';
                return (
                    <Badge key={item.priority} className={`${priorityColor} text-xs px-2 py-1`}>
                        {PRIORITY_LABELS[item.priority] || item.priority}: {item._count}
                    </Badge>
                );
            })}
        </div>
    );
};

// Recent Projects Table
const RecentProjects = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <FolderKanban className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent projects</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
                <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block hover:bg-accent/5 transition-colors rounded-lg p-2 -m-2"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: project.color || '#2563EB' }}
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {project.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {project.project_code}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className={STATUS_COLORS[project.status] || 'bg-muted text-muted-foreground'}>
                                {STATUS_LABELS[project.status] || project.status}
                            </Badge>
                            <div className="w-16">
                                <Progress value={project.completion_percentage || 0} className="h-1.5 bg-muted" />
                            </div>
                            <span className="text-xs text-muted-foreground w-8 text-right">
                                {project.completion_percentage || 0}%
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
            {projects.length > 5 && (
                <div className="text-center mt-2">
                    <Link to="/projects" className="text-sm text-primary hover:underline">
                        View all projects
                    </Link>
                </div>
            )}
        </div>
    );
};

// Upcoming Deadlines
const UpcomingDeadlines = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming deadlines</p>
            </div>
        );
    }

    const now = new Date();
    const upcoming = projects
        .filter(p => p.due_date && new Date(p.due_date) >= now && p.status !== 'completed')
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5);

    if (upcoming.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming deadlines</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {upcoming.map((project) => {
                const daysUntil = Math.ceil(
                    (new Date(project.due_date) - now) / (1000 * 60 * 60 * 24)
                );
                const isUrgent = daysUntil <= 7;

                return (
                    <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="block hover:bg-accent/5 transition-colors rounded-lg p-2 -m-2"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: project.color || '#2563EB' }}
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {project.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Due {format(new Date(project.due_date), 'MMM d, yyyy')}
                                    </p>
                                </div>
                            </div>
                            <Badge className={isUrgent ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-muted text-muted-foreground'}>
                                {isUrgent ? `${daysUntil}d left` : `${daysUntil}d`}
                            </Badge>
                        </div>
                    </Link>
                );
            })}
            {projects.filter(p => p.due_date && new Date(p.due_date) >= now).length > 5 && (
                <div className="text-center mt-2">
                    <Link to="/projects" className="text-sm text-primary hover:underline">
                        View all deadlines
                    </Link>
                </div>
            )}
        </div>
    );
};

// Monthly Creation Chart (Simple)
const MonthlyCreation = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No project creation data</p>
            </div>
        );
    }

    const maxCount = Math.max(...data.map(d => d.count));

    return (
        <div className="space-y-2">
            {data.map((item) => {
                const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                const monthLabel = format(new Date(item.month), 'MMM yyyy');

                return (
                    <div key={item.month}>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground text-xs">{monthLabel}</span>
                            <div className="flex items-center gap-2 flex-1 ml-4">
                                <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-[#7C3AED] rounded transition-all duration-500"
                                        style={{ width: `${Math.max(percentage, 2)}%` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground w-6 text-right">
                                    {item.count}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Main Component
const ProjectWidgets = () => {
    const { data: stats, isLoading } = useProjectStats();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {[...Array(6)].map((_, i) => (
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

    if (!stats) {
        return (
            <Card className="border-border bg-card">
                <CardContent className="p-8 text-center">
                    <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No project data available</p>
                    <Link to="/projects">
                        <Button variant="outline" className="mt-4 border-border text-foreground hover:bg-accent">
                            Go to Projects
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                <StatCard
                    title="Total Projects"
                    value={stats.total}
                    icon={FolderKanban}
                    color="primary"
                />
                <StatCard
                    title="Active"
                    value={stats.active}
                    icon={TrendingUp}
                    color="green-500"
                />
                <StatCard
                    title="Completed"
                    value={stats.completed}
                    icon={CheckCircle}
                    color="purple-500"
                />
                <StatCard
                    title="Overdue"
                    value={stats.overdue}
                    icon={AlertCircle}
                    color="red-500"
                />
                <StatCard
                    title="Avg Progress"
                    value={stats.averageProgress}
                    icon={TrendingUp}
                    color="blue-500"
                    subtitle={`${stats.averageProgress || 0}% complete`}
                />
                <StatCard
                    title="Total Budget"
                    value={stats.totalBudget}
                    icon={TrendingUp}
                    color="cyan-500"
                    subtitle={`$${stats.totalBudget?.toLocaleString() || 0}`}
                />
            </div>

            {/* Charts and Lists */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Status Distribution */}
                <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">Project Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StatusDistribution data={stats.statusDistribution} />
                    </CardContent>
                </Card>

                {/* Priority Distribution */}
                <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">Priority Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PriorityDistribution data={stats.priorityDistribution} />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Projects */}
                <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-foreground">Recent Projects</CardTitle>
                            <Link to="/projects">
                                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                                    View all
                                    <ArrowUpRight className="ml-1 h-3 w-3" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <RecentProjects projects={stats.recentProjects} />
                    </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UpcomingDeadlines projects={stats.recentProjects} />
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Creation */}
            <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">Projects Created Per Month</CardTitle>
                </CardHeader>
                <CardContent>
                    <MonthlyCreation data={stats.monthlyCreation} />
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectWidgets;