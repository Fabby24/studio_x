import { motion } from 'framer-motion'
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Filter,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Separator } from '../../components/ui/separator'
import { Progress } from '../../components/ui/progress'

// Mock data - replace with real data from API
const statsData = [
  {
    title: 'My Tasks',
    value: '24',
    subtitle: '8 in progress',
    icon: ClipboardList,
    color: 'text-[#2563EB]',
    bgColor: 'bg-[#2563EB]/10',
  },
  {
    title: 'Completed',
    value: '142',
    subtitle: 'This month',
    icon: CheckCircle,
    color: 'text-[#06B6D4]',
    bgColor: 'bg-[#06B6D4]/10',
  },
  {
    title: 'Due This Week',
    value: '12',
    subtitle: '3 overdue',
    icon: Clock,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    title: 'Upcoming',
    value: '18',
    subtitle: 'Next 7 days',
    icon: Calendar,
    color: 'text-[#7C3AED]',
    bgColor: 'bg-[#7C3AED]/10',
  },
]

const upcomingTasks = [
  {
    id: 1,
    title: 'Design Homepage Layout',
    project: 'Website Redesign',
    priority: 'High',
    dueDate: '2024-01-15',
    status: 'In Progress',
    progress: 75,
  },
  {
    id: 2,
    title: 'Fix Navigation Bug',
    project: 'Mobile App',
    priority: 'Medium',
    dueDate: '2024-01-16',
    status: 'To Do',
    progress: 0,
  },
  {
    id: 3,
    title: 'Create Documentation',
    project: 'API Development',
    priority: 'Low',
    dueDate: '2024-01-18',
    status: 'In Review',
    progress: 90,
  },
  {
    id: 4,
    title: 'User Testing Session',
    project: 'Dashboard Redesign',
    priority: 'High',
    dueDate: '2024-01-20',
    status: 'To Do',
    progress: 0,
  },
  {
    id: 5,
    title: 'Optimize Database Queries',
    project: 'Backend Services',
    priority: 'Medium',
    dueDate: '2024-01-22',
    status: 'In Progress',
    progress: 40,
  },
]

const recentNotifications = [
  {
    id: 1,
    title: 'Task assigned: "Update User Profiles"',
    from: 'Sarah Johnson',
    time: '10 min ago',
    read: false,
  },
  {
    id: 2,
    title: 'Project deadline approaching: "Mobile App"',
    from: 'System',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    title: 'Comment on: "Design System Components"',
    from: 'Mike Chen',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 4,
    title: 'Task completed: "Fix Login Issues"',
    from: 'Emily Davis',
    time: '5 hours ago',
    read: true,
  },
]

const getPriorityColor = (priority) => {
  const colors = {
    High: 'bg-red-500/10 text-red-400 border-red-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Low: 'bg-green-500/10 text-green-400 border-green-500/20',
  }
  return colors[priority] || colors.Medium
}

const getStatusColor = (status) => {
  const colors = {
    'In Progress': 'text-[#2563EB]',
    'To Do': 'text-muted-foreground',
    'In Review': 'text-[#7C3AED]',
    Completed: 'text-[#06B6D4]',
  }
  return colors[status] || colors['To Do']
}

const TeamDashboardPage = () => {
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
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your overview for today
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity">
            <Plus className="mr-2 h-4 w-4" />
            New Task
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
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
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

      {/* Upcoming Tasks */}
      <Card className="border-white/5 bg-white/[0.02]">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-white">Upcoming Tasks</CardTitle>
              <CardDescription className="text-muted-foreground">
                Your tasks for the next 7 days
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="h-9 w-[150px] pl-9 sm:w-[200px] bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                />
              </div>
              <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={task.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{task.title}</h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.project}</p>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24">
                      <Progress value={task.progress} className="h-2 bg-white/5" />
                    </div>
                    <span className="text-sm font-medium text-white">{task.progress}%</span>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {index < upcomingTasks.length - 1 && (
                  <Separator className="mt-4 bg-white/5" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Notifications */}
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Recent Notifications</CardTitle>
              <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#2563EB]/80 hover:bg-[#2563EB]/10">
                Mark all read
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${
                        notification.read ? 'bg-muted' : 'bg-[#2563EB]'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white">{notification.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {notification.from}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < recentNotifications.length - 1 && (
                    <Separator className="mt-4 bg-white/5" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-muted-foreground">
              Common tasks to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 py-6 border-white/10 hover:bg-white/5 hover:border-[#2563EB]/50 transition-all"
              >
                <ClipboardList className="h-6 w-6 text-[#2563EB]" />
                <span className="text-sm text-white">New Task</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 py-6 border-white/10 hover:bg-white/5 hover:border-[#7C3AED]/50 transition-all"
              >
                <Calendar className="h-6 w-6 text-[#7C3AED]" />
                <span className="text-sm text-white">View Calendar</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 py-6 border-white/10 hover:bg-white/5 hover:border-[#06B6D4]/50 transition-all"
              >
                <Clock className="h-6 w-6 text-[#06B6D4]" />
                <span className="text-sm text-white">Timesheet</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 py-6 border-white/10 hover:bg-white/5 hover:border-orange-500/50 transition-all"
              >
                <TrendingUp className="h-6 w-6 text-orange-500" />
                <span className="text-sm text-white">My Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export default TeamDashboardPage