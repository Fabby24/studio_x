import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    Briefcase,
    FolderKanban,
    ClipboardList,
    TrendingUp,
    Plus,
    UserPlus,
    FileText,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboardApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Link } from 'react-router-dom';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { formatDistanceToNow, format } from 'date-fns';

const StatCard = ({ title, value, delta, icon: Icon }) => {
    const isPositive = delta >= 0;
    const deltaText = isPositive ? `+${delta}` : `${delta}`;

    return (
        <Card className="border-border bg-card">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            {title}
                        </p>
                        <p className="text-2xl font-bold text-foreground mt-1">{value.toLocaleString()}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            {delta !== 0 && (
                                <>
                                    {isPositive ? (
                                        <ArrowUp className="h-3 w-3 text-green-400" />
                                    ) : (
                                        <ArrowDown className="h-3 w-3 text-red-400" />
                                    )}
                                    <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                        {deltaText}
                                    </span>
                                    <span className="text-xs text-muted-foreground">this month</span>
                                </>
                            )}
                            {delta === 0 && (
                                <span className="text-xs text-muted-foreground">No change this month</span>
                            )}
                        </div>
                    </div>
                    <div className="rounded-lg p-2.5 bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const StatusBadge = ({ status }) => {
    const config = {
        active: { color: 'bg-green-400', text: 'Active' },
        suspended: { color: 'bg-red-400', text: 'Suspended' },
        pending: { color: 'bg-yellow-400', text: 'Pending' },
    };
    const { color, text } = config[status] || config.pending;

    return (
        <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
            <span className="text-xs text-muted-foreground">{text}</span>
        </div>
    );
};

const ActivityDot = ({ action }) => {
    const colors = {
        login: 'bg-primary',
        user_login: 'bg-primary',
        google_login: 'bg-primary',
        created: 'bg-green-400',
        deleted: 'bg-red-400',
        updated: 'bg-yellow-400',
        user_invited: 'bg-violet-400',
        invitation_accepted: 'bg-cyan-400',
        user_created: 'bg-green-400',
        user_deleted: 'bg-red-400',
        bulk_users_deleted: 'bg-red-400',
        user_logout: 'bg-gray-400',
    };

    const defaultColor = 'bg-muted-foreground';
    const matchedKey = Object.keys(colors).find(key => action.includes(key));
    const color = matchedKey ? colors[matchedKey] : defaultColor;

    return <span className={`h-2 w-2 rounded-full ${color} flex-shrink-0 mt-1`} />;
};

const getActionDisplay = (action) => {
    return action
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const SuperAdminDashboardPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard', 'super-admin'],
        queryFn: dashboardApi.getSuperAdminStats,
        staleTime: 2 * 60 * 1000,
    });

    // ✅ FIX: Correct data extraction - data.data.data
    const stats = data?.data?.data || {};
    const recentOrgs = stats.recentOrganizations || [];
    const growthData = stats.growthData || [];
    const activity = stats.recentActivity || [];

    // Calculate deltas
    const orgDelta = (stats.organizations?.thisMonth || 0) - (stats.organizations?.lastMonth || 0);
    const userDelta = (stats.users?.thisMonth || 0) - (stats.users?.lastMonth || 0);
    const clientDelta = (stats.clients?.thisMonth || 0) - (stats.clients?.lastMonth || 0);
    const projectDelta = (stats.projects?.thisMonth || 0) - (stats.projects?.lastMonth || 0);
    const taskDelta = (stats.tasks?.thisMonth || 0) - (stats.tasks?.lastMonth || 0);

    if (isLoading) {
        return (
            <div className="space-y-6 font-poppins">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Super Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Monitor platform activity and growth</p>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-24 bg-muted/50" />
                    ))}
                </div>
                <Skeleton className="h-12 bg-muted/50" />
                <Skeleton className="h-64 bg-muted/50" />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Skeleton className="h-80 bg-muted/50 lg:col-span-2" />
                    <Skeleton className="h-80 bg-muted/50" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400">Failed to load dashboard data</p>
                    <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 font-poppins"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Monitor Platform activity and growth</h1>
                <p className="text-muted-foreground mt-1">Track key metrics and performance indicators</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                <StatCard
                    title="Organizations"
                    value={stats.organizations?.total || 0}
                    delta={orgDelta}
                    icon={Building2}
                />
                <StatCard
                    title="Total Users"
                    value={stats.users?.total || 0}
                    delta={userDelta}
                    icon={Users}
                />
                <StatCard
                    title="Total Clients"
                    value={stats.clients?.total || 0}
                    delta={clientDelta}
                    icon={Briefcase}
                />
                <StatCard
                    title="Total Projects"
                    value={stats.projects?.total || 0}
                    delta={projectDelta}
                    icon={FolderKanban}
                />
                <StatCard
                    title="Total Tasks"
                    value={stats.tasks?.total || 0}
                    delta={taskDelta}
                    icon={ClipboardList}
                />
                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    Active Orgs
                                </p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {stats.activeOrganizations || 0}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {stats.organizations?.total || 0} total
                                </p>
                            </div>
                            <div className="rounded-lg p-2.5 bg-primary/10">
                                <TrendingUp className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
                <Link to="/organizations">
                    <Button variant="outline" className="border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
                        <Plus className="mr-2 h-4 w-4" />
                        New Organization
                    </Button>
                </Link>
                <Link to="/platform-users">
                    <Button variant="outline" className="border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Platform Users
                    </Button>
                </Link>
                <Link to="/dashboard/super-admin/audit-logs">
                    <Button variant="outline" className="border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
                        <FileText className="mr-2 h-4 w-4" />
                        View Audit Logs
                    </Button>
                </Link>
            </div>

            {/* Growth Chart */}
            <Card className="border-border bg-card">
                <CardHeader className="pb-0">
                    <CardTitle className="text-foreground text-base font-medium">Platform Growth</CardTitle>
                    <p className="text-sm text-muted-foreground">New organizations per day (last 30 days)</p>
                </CardHeader>
                <CardContent className="pt-4">
                    {growthData.length === 0 ? (
                        <div className="flex h-48 items-center justify-center text-muted-foreground">
                            No organization growth data available
                        </div>
                    ) : (
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(value) => format(new Date(value), 'MMM d')}
                                        stroke="hsl(var(--border))"
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        stroke="hsl(var(--border))"
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '6px',
                                        }}
                                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                                        itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
                                        formatter={(value) => [`${value} organizations`, 'New']}
                                        labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        dot={{ fill: 'hsl(var(--primary))', r: 2 }}
                                        activeDot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Organizations & Activity Feed */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent Organizations Table */}
                <Card className="border-border bg-card lg:col-span-2">
                    <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-foreground text-base font-medium">Recent Organizations</CardTitle>
                            <Link to="/organizations">
                                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                                    View all
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {recentOrgs.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No organizations have been created yet
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="pb-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Organization
                                            </th>
                                            <th className="pb-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Plan
                                            </th>
                                            <th className="pb-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Users
                                            </th>
                                            <th className="pb-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="pb-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="pb-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrgs.map((org, index) => (
                                            <tr
                                                key={org.id}
                                                className={`border-b border-border hover:bg-accent/5 transition-colors ${index === recentOrgs.length - 1 ? 'border-0' : ''}`}
                                            >
                                                <td className="py-2.5">
                                                    <div>
                                                        <p className="font-medium text-foreground">{org.name}</p>
                                                        <p className="text-xs text-muted-foreground">{org.slug}</p>
                                                    </div>
                                                </td>
                                                <td className="py-2.5">
                                                    <span className="text-xs text-muted-foreground capitalize">{org.plan || 'free'}</span>
                                                </td>
                                                <td className="py-2.5">
                                                    <span className="text-xs text-muted-foreground">{org.userCount || 0}</span>
                                                </td>
                                                <td className="py-2.5">
                                                    <StatusBadge status={org.status} />
                                                </td>
                                                <td className="py-2.5">
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(org.createdAt), { addSuffix: true })}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 text-right">
                                                    <Link to={`/organizations/${org.id}`}>
                                                        <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-primary hover:text-primary/80 hover:bg-primary/10">
                                                            View
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Platform Activity Feed */}
                <Card className="border-border bg-card">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-foreground text-base font-medium">Platform Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {activity.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No recent activity
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                                {activity.map((item) => {
                                    const userName = item.user
                                        ? `${item.user.firstName} ${item.user.lastName}`.trim()
                                        : 'System';
                                    const actionDisplay = getActionDisplay(item.action);

                                    return (
                                        <div key={item.id} className="flex items-start gap-2.5 border-b border-border pb-2.5 last:border-0">
                                            <ActivityDot action={item.action} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground/90 truncate">
                                                    <span className="font-medium">{userName}</span>
                                                    <span className="text-muted-foreground"> {actionDisplay}</span>
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default SuperAdminDashboardPage;