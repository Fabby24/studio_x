import { motion } from 'framer-motion';
import {
    FolderKanban,
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    DollarSign,
} from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';

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

const ProjectStats = ({ stats, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-24 bg-muted/50" />
                ))}
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Projects',
            value: stats?.total || 0,
            icon: FolderKanban,
            color: 'primary',
        },
        {
            title: 'Active Projects',
            value: stats?.active || 0,
            icon: TrendingUp,
            color: 'green-500',
        },
        {
            title: 'Completed',
            value: stats?.completed || 0,
            icon: CheckCircle,
            color: 'purple-500',
        },
        {
            title: 'Overdue',
            value: stats?.overdue || 0,
            icon: AlertCircle,
            color: 'red-500',
            subtitle: 'Needs attention',
        },
        {
            title: 'Avg Progress',
            value: stats?.averageProgress || 0,
            icon: TrendingUp,
            color: 'blue-500',
            subtitle: `${stats?.averageProgress || 0}% complete`,
        },
        {
            title: 'Total Budget',
            value: stats?.totalBudget || 0,
            icon: DollarSign,
            color: 'cyan-500',
            subtitle: 'Allocated',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
        >
            {statCards.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <StatCard {...stat} />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ProjectStats;