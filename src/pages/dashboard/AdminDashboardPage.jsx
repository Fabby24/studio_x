import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
    Users,
    Briefcase,
    FolderKanban,
    ClipboardList,
    CheckCircle,
    Clock,
    AlertCircle,
    Calendar,
    TrendingUp,
    UserPlus,
    Plus,
    Loader2,
    ArrowUpRight,
    BarChart3,
    PieChart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';

const AdminDashboardPage = () => {
    const [timeRange, setTimeRange] = useState('week');
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard', 'admin'],
        queryFn: dashboardApi.getAdminStats,
    });

    const stats = data?.data || {};
    const activities = stats.recentActivity || [];
    const taskStatus = stats.taskStatusDistribution || [];

    // Mock data for components (replace with real data from API)
    const upcomingDeadlines = [
        { id: 1, title: 'Project Alpha', dueDate: 'Tomorrow', priority: 'high' },
        { id: 2, title: 'Website Redesign', dueDate: 'Friday', priority: 'medium' },
        { id: 3, title: 'Brand Identity', dueDate: 'Next Monday', priority: 'high' },
        { id: 4, title: 'Mobile App Design', dueDate: 'Next Wednesday', priority: 'low' },
    ];

    const recentProjects = [
        { id: 1, name: 'Website Redesign', client: 'Acme Ltd', progress: 75, dueDate: '24 Jul' },
        { id: 2, name: 'Branding Package', client: 'Pixel Co', progress: 40, dueDate: '29 Jul' },
        { id: 3, name: 'Mobile App', client: 'Vision Media', progress: 90, dueDate: '15 Jul' },
    ];

    const teamWorkload = [
        { name: 'Fabian', tasks: 18, maxTasks: 25, color: '#2563EB' },
        { name: 'John', tasks: 8, maxTasks: 25, color: '#7C3AED' },
        { name: 'Grace', tasks: 3, maxTasks: 25, color: '#06B6D4' },
        { name: 'Sarah', tasks: 12, maxTasks: 25, color: '#F59E0B' },
    ];

    const topClients = [
        { name: 'Studio X', projects: 12, color: '#2563EB' },
        { name: 'Pixel Agency', projects: 8, color: '#7C3AED' },
        { name: 'Vision Media', projects: 5, color: '#06B6D4' },
    ];

    const weeklyData = [
        { day: 'Mon', hours: 6, tasks: 4 },
        { day: 'Tue', hours: 8, tasks: 6 },
        { day: 'Wed', hours: 7, tasks: 5 },
        { day: 'Thu', hours: 9, tasks: 7 },
        { day: 'Fri', hours: 5, tasks: 3 },
    ];

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
            value: stats.totalProjects || 0, 
            icon: FolderKanban, 
            color: 'text-[#06B6D4]',
            bgColor: 'bg-[#06B6D4]/10',
            change: '8 in progress'
        },
        { 
            title: 'Tasks Due Today', 
            value: '12', 
            icon: Clock, 
            color: 'text-orange-400',
            bgColor: 'bg-orange-400/10',
            change: '3 overdue'
        },
        { 
            title: 'Overdue Tasks', 
            value: '3', 
            icon: AlertCircle, 
            color: 'text-red-400',
            bgColor: 'bg-red-400/10',
            change: 'Urgent attention needed'
        },
        { 
            title: 'Hours This Week', 
            value: '47', 
            icon: TrendingUp, 
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
            change: '+12% vs last week'
        },
    ];
    // getting the name of the logged in user from local storage
    const user = JSON.parse(localStorage.getItem('user'));

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
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-medium text-[#7C3AED]">Welcome back, {user?.name} </p>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Organization Overview</h1>
                    <p className="text-muted-foreground mt-1">
                        Here's what's happening across your organization today
                    </p>
                </div>
                <div className="flex gap-2">
                    <select 
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
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
                        <Card className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className={`rounded-lg p-1.5 ${stat.bgColor}`}>
                                        <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                                </div>
                                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.change}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Link to="/clients/new">
                    <Button className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite User
                    </Button>
                </Link>
                <Link to="/clients/new">
                    <Button className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Add Client
                    </Button>
                </Link>
                <Link to="/projects/new">
                    <Button className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                        <FolderKanban className="mr-2 h-4 w-4" />
                        New Project
                    </Button>
                </Link>
                <Link to="/tasks/new">
                    <Button className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Task
                    </Button>
                </Link>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Task Progress Chart */}
                <Card className="border-white/5 bg-white/[0.02]">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-white text-lg">Task Progress</CardTitle>
                                <p className="text-sm text-muted-foreground">Distribution by status</p>
                            </div>
                            <BarChart3 className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white">Completed</span>
                                    <span className="text-white font-medium">45%</span>
                                </div>
                                <Progress value={45} className="h-2 bg-white/5" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white">In Progress</span>
                                    <span className="text-white font-medium">30%</span>
                                </div>
                                <Progress value={30} className="h-2 bg-white/5" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white">In Review</span>
                                    <span className="text-white font-medium">15%</span>
                                </div>
                                <Progress value={15} className="h-2 bg-white/5" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white">Blocked</span>
                                    <span className="text-white font-medium">10%</span>
                                </div>
                                <Progress value={10} className="h-2 bg-white/5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Weekly Productivity */}
                <Card className="border-white/5 bg-white/[0.02]">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-white text-lg">Weekly Productivity</CardTitle>
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
                                        <span className="text-white">{day.day}</span>
                                        <span className="text-white font-medium">{day.hours}h</span>
                                    </div>
                                    <div className="relative h-2 w-full rounded-full bg-white/5">
                                        <div 
                                            className="absolute h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
                                            style={{ width: `${(day.hours / 10) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Mid Section */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Upcoming Deadlines */}
                <Card className="border-white/5 bg-white/[0.02] md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Upcoming Deadlines</CardTitle>
                        <p className="text-sm text-muted-foreground">Tasks due soon</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcomingDeadlines.map((task) => (
                                <div key={task.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                                    <div>
                                        <p className="font-medium text-white text-sm">{task.title}</p>
                                        <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                                    </div>
                                    <Badge className={
                                        task.priority === 'high' 
                                            ? 'bg-red-500/20 text-red-400 border-red-500/20'
                                            : task.priority === 'medium'
                                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
                                            : 'bg-green-500/20 text-green-400 border-green-500/20'
                                    }>
                                        {task.priority}
                                    </Badge>
                                </div>
                            ))}
                            <Button variant="ghost" size="sm" className="w-full text-[#2563EB] hover:text-[#2563EB]/80 hover:bg-[#2563EB]/10">
                                View all deadlines
                                <ArrowUpRight className="ml-2 h-3 w-3" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Projects */}
                <Card className="border-white/5 bg-white/[0.02] md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Recent Projects</CardTitle>
                        <p className="text-sm text-muted-foreground">Latest project updates</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentProjects.map((project) => (
                                <div key={project.id} className="border-b border-white/5 pb-3 last:border-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-white text-sm">{project.name}</p>
                                            <p className="text-xs text-muted-foreground">{project.client}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-white">{project.progress}%</p>
                                            <p className="text-xs text-muted-foreground">Due {project.dueDate}</p>
                                        </div>
                                    </div>
                                    <Progress value={project.progress} className="h-1.5 bg-white/5 mt-1" />
                                </div>
                            ))}
                            <Button variant="ghost" size="sm" className="w-full text-[#2563EB] hover:text-[#2563EB]/80 hover:bg-[#2563EB]/10">
                                View all projects
                                <ArrowUpRight className="ml-2 h-3 w-3" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Client Overview */}
                <Card className="border-white/5 bg-white/[0.02] md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Top Clients</CardTitle>
                        <p className="text-sm text-muted-foreground">Most active clients</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topClients.map((client, index) => (
                                <div key={client.name} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB]/20 to-[#7C3AED]/20 text-xs font-bold text-white">
                                            {client.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white text-sm">{client.name}</p>
                                            <p className="text-xs text-muted-foreground">{client.projects} projects</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="border-white/10 text-white/60">
                                        Active
                                    </Badge>
                                </div>
                            ))}
                            <Button variant="ghost" size="sm" className="w-full text-[#2563EB] hover:text-[#2563EB]/80 hover:bg-[#2563EB]/10">
                                View all clients
                                <ArrowUpRight className="ml-2 h-3 w-3" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Team Workload */}
                <Card className="border-white/5 bg-white/[0.02]">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Team Workload</CardTitle>
                        <p className="text-sm text-muted-foreground">Task distribution across team</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {teamWorkload.map((member) => (
                                <div key={member.name}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-white">{member.name}</span>
                                        <span className="text-white font-medium">{member.tasks} tasks</span>
                                    </div>
                                    <div className="relative h-2 w-full rounded-full bg-white/5">
                                        <div 
                                            className="absolute h-full rounded-full transition-all duration-500"
                                            style={{ 
                                                width: `${(member.tasks / member.maxTasks) * 100}%`,
                                                backgroundColor: member.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-white">6</p>
                                    <p className="text-xs text-muted-foreground">Available</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-[#2563EB]">3</p>
                                    <p className="text-xs text-muted-foreground">Busy</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-orange-400">1</p>
                                    <p className="text-xs text-muted-foreground">On Leave</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Feed */}
                <Card className="border-white/5 bg-white/[0.02]">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                        <p className="text-sm text-muted-foreground">Latest team actions</p>
                    </CardHeader>
                    <CardContent>
                        {activities.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-3">📋</div>
                                <p className="text-white font-medium">No recent activity</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Team actions will appear here as work gets done
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                {activities.slice(0, 8).map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3 border-b border-white/5 pb-3 last:border-0">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-gradient-to-br from-[#2563EB]/20 to-[#7C3AED]/20 text-xs font-bold text-white">
                                                {activity.user?.first_name?.charAt(0) || 'U'}
                                                {activity.user?.last_name?.charAt(0) || ''}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm text-white">
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
                        {activities.length > 0 && (
                            <Button variant="ghost" size="sm" className="w-full mt-4 text-[#2563EB] hover:text-[#2563EB]/80 hover:bg-[#2563EB]/10">
                                View all activity
                                <ArrowUpRight className="ml-2 h-3 w-3" />
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Organization Progress */}
            <Card className="border-white/5 bg-white/[0.02]">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Organization Progress</CardTitle>
                    <p className="text-sm text-muted-foreground">Overall completion across all areas</p>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                        <div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white">Projects</span>
                                <span className="text-white font-medium">82%</span>
                            </div>
                            <Progress value={82} className="h-2.5 bg-white/5" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white">Tasks</span>
                                <span className="text-white font-medium">74%</span>
                            </div>
                            <Progress value={74} className="h-2.5 bg-white/5" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white">Hours</span>
                                <span className="text-white font-medium">91%</span>
                            </div>
                            <Progress value={91} className="h-2.5 bg-white/5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AdminDashboardPage;