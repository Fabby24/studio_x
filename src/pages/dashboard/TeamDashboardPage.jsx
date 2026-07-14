import { motion } from 'framer-motion';
import {
    ClipboardList,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboardApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const TeamDashboardPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard', 'team'],
        queryFn: dashboardApi.getTeamStats,
    });

    const stats = data?.data || {};
    const tasks = stats.recentTasks || [];
    const deadlines = stats.upcomingDeadlines || [];

    const statCards = [
        { title: 'Assigned Tasks', value: stats.assignedTasks || 0, icon: ClipboardList, color: 'text-[#2563EB]' },
        { title: 'Completed', value: stats.completedTasks || 0, icon: CheckCircle, color: 'text-green-400' },
        { title: 'In Progress', value: stats.inProgressTasks || 0, icon: Clock, color: 'text-[#7C3AED]' },
        { title: 'Overdue', value: stats.overdueTasks || 0, icon: AlertCircle, color: 'text-red-400' },
        { title: 'Hours Today', value: stats.timeLoggedToday || 0, icon: Clock, color: 'text-[#06B6D4]' },
    ];

    const getPriorityColor = (priority) => {
        const colors = {
            critical: 'bg-red-500/20 text-red-400 border-red-500/20',
            high: 'bg-orange-500/20 text-orange-400 border-orange-500/20',
            medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
            low: 'bg-green-500/20 text-green-400 border-green-500/20',
        };
        return colors[priority] || colors.medium;
    };

    const getStatusColor = (status) => {
        const colors = {
            todo: 'text-gray-400',
            in_progress: 'text-[#2563EB]',
            in_review: 'text-[#7C3AED]',
            completed: 'text-green-400',
            blocked: 'text-red-400',
        };
        return colors[status] || 'text-gray-400';
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400">
                Failed to load dashboard data
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 font-poppins"
        >
            <div>
                <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">My Overview</p>
                <h1 className="text-3xl font-bold tracking-tight text-white">Team Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Track your tasks, deadlines, and productivity
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                                </div>
                                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Upcoming Deadlines */}
            <Card className="border-white/5 bg-white/[0.02]">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Upcoming Deadlines</CardTitle>
                    <p className="text-sm text-muted-foreground">Tasks due in the next 7 days</p>
                </CardHeader>
                <CardContent>
                    {deadlines.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-8 text-center">No upcoming deadlines</p>
                    ) : (
                        <div className="space-y-3">
                            {deadlines.map((task) => (
                                <div key={task.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                                    <div>
                                        <p className="font-medium text-white">{task.title}</p>
                                        <p className="text-sm text-muted-foreground">{task.project?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge className={getPriorityColor(task.priority)}>
                                            {task.priority}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Due: {new Date(task.due_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Tasks */}
            <Card className="border-white/5 bg-white/[0.02]">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Recent Tasks</CardTitle>
                    <p className="text-sm text-muted-foreground">Your most recently updated tasks</p>
                </CardHeader>
                <CardContent>
                    {tasks.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-8 text-center">No recent tasks</p>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                                    <div>
                                        <p className="font-medium text-white">{task.title}</p>
                                        <p className="text-sm text-muted-foreground">{task.project?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                                            {task.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default TeamDashboardPage;