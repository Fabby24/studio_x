import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Briefcase,
    FolderKanban,
    ClipboardList,
    CheckCircle,
    Clock,
    TrendingUp,
    UserPlus,
    Plus,
    Loader2,
    ArrowUpRight,
    BarChart3,
    PieChart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboardApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { useAuthStore } from '../../store/authStore';
import { useProjectStats } from '../../hooks/useProjects';

const AdminDashboardPage = () => {
    const { user } = useAuthStore();
    const { data: projectStats, isLoading: projectStatsLoading } = useProjectStats();

    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard', 'admin'],
        queryFn: dashboardApi.getAdminStats,
    });

    const stats = data?.data || {};
    const activities = stats.recentActivity || [];

    const kpiCards = [
        {
            title: 'Active Team Members',
            value: stats.totalUsers || 0,
            icon: Users,
            color: 'text-[#2563EB]',
            bgColor: 'bg-[#2563EB]/10',
            change: '+2 this month'
        },
        {
            title: 'Active Clients',
            value: stats.totalClients || 0,
            icon: Briefcase,
            color: 'text-[#7C3AED]',
            bgColor: 'bg-[#7C3AED]/10',
            change: '+5 this month'
        },
        {
            title: 'Active Projects',
            value: projectStats?.active || 0,
            icon: FolderKanban,
            color: 'text-[#06B6D4]',
            bgColor: 'bg-[#06B6D4]/10',
            change: `${projectStats?.active || 0} in progress`
        },
        {
            title: 'Tasks Due Today',
            value: '0',
            icon: Clock,
            color: 'text-orange-400',
            bgColor: 'bg-orange-400/10',
            change: 'No overdue tasks'
        },
        {
            title: 'Overdue Tasks',
            value: projectStats?.overdue || 0,
            icon: TrendingUp,
            color: 'text-red-400',
            bgColor: 'bg-red-400/10',
            change: projectStats?.overdue > 0 ? 'Urgent attention needed' : 'All on track'
        },
        {
            title: 'Hours This Week',
            value: stats.totalTimeLogged || 0,
            icon: Clock,
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
            change: 'This week'
        },
    ];

    const taskStatus = [
        { label: 'Completed', value: 45, color: '#22C55E' },
        { label: 'In Progress', value: 30, color: '#2563EB' },
        { label: 'In Review', value: 15, color: '#7C3AED' },
        { label: 'Blocked', value: 10, color: '#EF4444' },
    ];

    const weeklyData = [
        { day: 'Mon', hours: 6 },
        { day: 'Tue', hours: 8 },
        { day: 'Wed', hours: 7 },
        { day: 'Thu', hours: 9 },
        { day: 'Fri', hours: 5 },
    ];

    const maxHours = Math.max(...weeklyData.map(d => d.hours));

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 py-8">
                Failed to load dashboard data. Please refresh the page.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 font-poppins pb-8"
        >
            {/* Welcome Header */}
            <div>
                <p className="text-sm font-medium text-[#7C3AED]">Welcome back, {user?.first_name} 👋</p>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Organization Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Here's what's happening across your organization today
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {kpiCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="border-border bg-card hover:bg-accent/5 transition-colors">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className={`rounded-lg p-1.5 ${stat.bgColor}`}>
                                        <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                                </div>
                                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.change}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Link to="/users">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite User
                    </Button>
                </Link>
                <Link to="/clients/new">
                    <Button className="w-full border-border bg-card text-foreground hover:bg-accent">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Add Client
                    </Button>
                </Link>
                <Link to="/projects/new">
                    <Button className="w-full border-border bg-card text-foreground hover:bg-accent">
                        <FolderKanban className="mr-2 h-4 w-4" />
                        New Project
                    </Button>
                </Link>
                <Link to="/tasks/new">
                    <Button className="w-full border-border bg-card text-foreground hover:bg-accent">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Task
                    </Button>
                </Link>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Task Progress Chart */}
                <Card className="border-border bg-card">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-foreground text-lg">Task Progress</CardTitle>
                                <p className="text-sm text-muted-foreground">Distribution by status</p>
                            </div>
                            <BarChart3 className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {taskStatus.map((status) => (
                                <div key={status.label}>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground">{status.label}</span>
                                        <span className="text-foreground font-medium">{status.value}%</span>
                                    </div>
                                    <div className="relative h-2 w-full rounded-full bg-muted">
                                        <div 
                                            className="absolute h-full rounded-full transition-all duration-500"
                                            style={{ 
                                                width: `${status.value}%`,
                                                backgroundColor: status.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Weekly Productivity */}
                <Card className="border-border bg-card">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-foreground text-lg">Weekly Productivity</CardTitle>
                                <p className="text-sm text-muted-foreground">Hours worked this week</p>
                            </div>
                            <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {weeklyData.map((day) => (
                                <div key={day.day}>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground">{day.day}</span>
                                        <span className="text-foreground font-medium">{day.hours}h</span>
                                    </div>
                                    <div className="relative h-2 w-full rounded-full bg-muted">
                                        <div 
                                            className="absolute h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
                                            style={{ width: `${(day.hours / maxHours) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-border bg-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-foreground text-lg">Recent Activity</CardTitle>
                            <p className="text-sm text-muted-foreground">Latest actions from your team</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                            View all
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {activities.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-3">📋</div>
                            <p className="text-foreground font-medium">No recent activity</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Team actions will appear here as work gets done
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {activities.slice(0, 8).map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                            {activity.user?.first_name?.charAt(0) || 'U'}
                                            {activity.user?.last_name?.charAt(0) || ''}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm text-foreground">
                                            <span className="font-medium">
                                                {activity.user?.first_name || 'Unknown'} {activity.user?.last_name || ''}
                                            </span>
                                            <span className="text-muted-foreground"> {activity.action}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {new Date(activity.created_at).toLocaleString()}
                                        </p>
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

export default AdminDashboardPage;