import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    Briefcase,
    FolderKanban,
    ClipboardList,
    TrendingUp,
    Loader2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboardApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const SuperAdminDashboardPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard', 'super-admin'],
        queryFn: dashboardApi.getSuperAdminStats,
    });

    const stats = data?.data || {};
    const recentOrgs = stats.recentOrganizations || [];

    const statCards = [
        { title: 'Organizations', value: stats.totalOrganizations || 0, icon: Building2, color: 'text-[#2563EB]' },
        { title: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'text-[#7C3AED]' },
        { title: 'Total Clients', value: stats.totalClients || 0, icon: Briefcase, color: 'text-[#06B6D4]' },
        { title: 'Total Projects', value: stats.totalProjects || 0, icon: FolderKanban, color: 'text-green-400' },
        { title: 'Total Tasks', value: stats.totalTasks || 0, icon: ClipboardList, color: 'text-orange-400' },
        { title: 'Active Orgs', value: stats.activeOrganizations || 0, icon: TrendingUp, color: 'text-green-400' },
    ];

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
                <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">Platform Overview</p>
                <h1 className="text-3xl font-bold tracking-tight text-white">Super Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Monitor all organizations and platform activity
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
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

            {/* Recent Organizations */}
            <Card className="border-white/5 bg-white/[0.02]">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Recent Organizations</CardTitle>
                    <p className="text-sm text-muted-foreground">Latest organizations that joined the platform</p>
                </CardHeader>
                <CardContent>
                    {recentOrgs.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-8 text-center">No organizations yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentOrgs.map((org) => (
                                <div key={org.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                                    <div>
                                        <p className="font-medium text-white">{org.name}</p>
                                        <p className="text-sm text-muted-foreground">{org.slug}</p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <span className="mr-3">👤 {org._count?.users || 0} users</span>
                                        <span>📁 {org._count?.projects || 0} projects</span>
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

export default SuperAdminDashboardPage;