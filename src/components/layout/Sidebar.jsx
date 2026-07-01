import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ClipboardList,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  Briefcase,
  Clock,
} from 'lucide-react'
import { useState } from 'react'

import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { ROUTES, USER_ROLES } from '../../config/routes'
import { authService } from '../../services/authService'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { theme } = useThemeStore()
  const [expandedItems, setExpandedItems] = useState(['main'])

  const isAdmin = user?.role === USER_ROLES.ADMIN

  const toggleExpand = (item) => {
    setExpandedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    )
  }

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname.startsWith('/dashboard')
    }
    return location.pathname === path
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate(ROUTES.LOGIN)
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API fails
      logout()
      navigate(ROUTES.LOGIN)
    }
  }

  // Navigation items based on role
  const mainNavItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.TEAM_DASHBOARD,
    },
    ...(isAdmin
      ? [
          {
            title: 'Users',
            icon: Users,
            path: '/users',
          },
          {
            title: 'Clients',
            icon: Briefcase,
            path: '/clients',
          },
        ]
      : []),
    {
      title: 'Projects',
      icon: FolderKanban,
      path: '/projects',
    },
    {
      title: 'Tasks',
      icon: ClipboardList,
      path: '/tasks',
    },
    ...(isAdmin
      ? [
          {
            title: 'Traffic Board',
            icon: Calendar,
            path: '/traffic-board',
          },
          {
            title: 'Reports',
            icon: BarChart3,
            path: '/reports',
          },
        ]
      : [
          {
            title: 'My Tasks',
            icon: Clock,
            path: '/my-tasks',
          },
        ]),
  ]

  const bottomNavItems = [
    {
      title: 'Profile',
      icon: User,
      path: ROUTES.PROFILE,
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ]

  const NavItem = ({ item, isBottom = false }) => {
    const active = isActive(item.path)
    
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={item.path}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                ${
                  active
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }
                ${isBottom ? 'mt-1' : ''}
              `}
            >
              <item.icon className={`h-5 w-5 ${active ? 'text-primary' : ''}`} />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="lg:hidden">
            {item.title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex h-full w-[280px] flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link to={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.TEAM_DASHBOARD} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-lg font-bold text-primary">ST</span>
          </div>
          <span className="text-lg font-bold tracking-tight">Studio Traffic</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-accent/50 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {user?.status}
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} item={item} isBottom />
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="border-t border-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}

export { Sidebar }