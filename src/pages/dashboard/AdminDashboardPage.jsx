import { motion } from 'framer-motion'
import {
  Users,
  FolderKanban,
  ClipboardList,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  UserPlus,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Separator } from '../../components/ui/separator'

// Mock data - replace with real data from API
const statsData = [
  {
    title: 'Total Users',
    value: '1,284',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-[#2563EB]',
    bgColor: 'bg-[#2563EB]/10',
  },
  {
    title: 'Active Projects',
    value: '48',
    change: '+8.2%',
    trend: 'up',
    icon: FolderKanban,
    color: 'text-[#7C3AED]',
    bgColor: 'bg-[#7C3AED]/10',
  },
  {
    title: 'Tasks Completed',
    value: '2,847',
    change: '+23.1%',
    trend: 'up',
    icon: CheckCircle,
    color: 'text-[#06B6D4]',
    bgColor: 'bg-[#06B6D4]/10',
  },
  {
    title: 'Pending Tasks',
    value: '156',
    change: '-5.4%',
    trend: 'down',
    icon: Clock,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
]

const chartData = [
  { name: 'Mon', tasks: 12, completed: 8 },
  { name: 'Tue', tasks: 19, completed: 14 },
  { name: 'Wed', tasks: 15, completed: 10 },
  { name: 'Thu', tasks: 22, completed: 18 },
  { name: 'Fri', tasks: 18, completed: 15 },
  { name: 'Sat', tasks: 10, completed: 8 },
  { name: 'Sun', tasks: 8, completed: 5 },
]

const projectStatusData = [
  { name: 'In Progress', value: 45 },
  { name: 'Completed', value: 30 },
  { name: 'On Hold', value: 15 },
  { name: 'Not Started', value: 10 },
]

const COLORS = ['#2563EB', '#7C3AED', '#06B6D4', '#F59E0B']

const recentActivities = [
  {
    id: 1,
    user: { name: 'Sarah Johnson', avatar: '', initials: 'SJ' },
    action: 'completed task',
    target: 'Homepage Design',
    time: '2 min ago',
    type: 'completed',
  },
  {
    id: 2,
    user: { name: 'Mike Chen', avatar: '', initials: 'MC' },
    action: 'created project',
    target: 'Mobile App Redesign',
    time: '15 min ago',
    type: 'created',
  },
  {
    id: 3,
    user: { name: 'Emily Davis', avatar: '', initials: 'ED' },
    action: 'commented on',
    target: 'Backend API Documentation',
    time: '1 hour ago',
    type: 'commented',
  },
  {
    id: 4,
    user: { name: 'Alex Rivera', avatar: '', initials: 'AR' },
    action: 'assigned task',
    target: 'Database Migration',
    time: '2 hours ago',
    type: 'assigned',
  },
  {
    id: 5,
    user: { name: 'Lisa Park', avatar: '', initials: 'LP' },
    action: 'updated project status',
    target: 'Client Dashboard',
    time: '3 hours ago',
    type: 'updated',
  },
]

const AdminDashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 font-poppins"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">Dashboard</p>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your studio's performance and metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            <Calendar className="mr-2 h-4 w-4" />
            This Week
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                      <span
                        className={`text-xs ${
                          stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        from last month
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Tasks Chart */}
        <Card className="md:col-span-2 border-white/5 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-white">Weekly Tasks Overview</CardTitle>
            <CardDescription className="text-muted-foreground">
              Tasks created vs completed this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" className="text-xs text-muted-foreground" stroke="rgba(255,255,255,0.1)" />
                  <YAxis className="text-xs text-muted-foreground" stroke="rgba(255,255,255,0.1)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B132B',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                    }}
                  />
                  <Bar dataKey="tasks" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Status Chart */}
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-white">Project Status</CardTitle>
            <CardDescription className="text-muted-foreground">
              Distribution of project statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B132B',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {projectStatusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="ml-auto text-xs font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-white/5 bg-white/[0.02]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-muted-foreground">
                Latest actions from your team
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#2563EB]/80 hover:bg-[#2563EB]/10">
              View all
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start gap-4">
                  <Avatar className="h-9 w-9 border border-white/10">
                    <AvatarFallback className="bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white font-semibold">
                      {activity.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.user.name}</span>
                      <span className="text-muted-foreground">
                        {' '}
                        {activity.action}{' '}
                      </span>
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] capitalize border-white/10 text-muted-foreground"
                      >
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                {index < recentActivities.length - 1 && (
                  <Separator className="mt-4 bg-white/5" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default AdminDashboardPage