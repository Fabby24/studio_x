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
  User,
  Briefcase,
  Clock,
  Building2,
  Shield,
  Timer,
  FileText,
} from 'lucide-react'
import { useState } from 'react'

import { useAuthStore } from '../../store/authStore'
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
  const [expandedItems, setExpandedItems] = useState(['main'])

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
    if (path === '/dashboard/admin' || path === '/dashboard/super-admin' || path === '/dashboard/team') {
      return location.pathname === path
    }
    return location.pathname === path
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      logout()
      navigate('/login')
    }
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return 'U'
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
  }

  // Get role display name
  const getRoleDisplay = (role) => {
    const roles = {
      super_admin: 'Super Admin',
      org_admin: 'Organization Admin',
      team_member: 'Team Member',
    }
    return roles[role] || role
  }

  // Navigation items based on role
  const getNavItems = () => {
    const role = user?.role

    // Super Admin Navigation
    if (role === 'super_admin') {
      return {
        main: [
          {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/dashboard/super-admin',
          },
          {
            title: 'Organizations',
            icon: Building2,
            path: '/organizations',
          },
          {
            title: 'Platform Users',
            icon: Shield,
            path: '/platform-users',
          },
          {
            title: 'System Settings',
            icon: Settings,
            path: '/platform-settings',
          },
        ],
        bottom: [
          {
            title: 'Profile',
            icon: User,
            path: '/profile',
          },
        ],
      }
    }

    // Organization Admin Navigation
    if (role === 'org_admin') {
      return {
        main: [
          {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/dashboard/admin',
          },
          {
            title: 'Team Members',
            icon: Users,
            path: '/users',
          },
          {
            title: 'Clients',
            icon: Briefcase,
            path: '/clients',
          },
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
          {
            title: 'Traffic Board',
            icon: Calendar,
            path: '/traffic-board',
          },
          {
            title: 'Time Tracking',
            icon: Timer,
            path: '/time-tracking',
          },
          {
            title: 'Reports',
            icon: FileText,
            path: '/reports',
          },
        ],
        bottom: [
          {
            title: 'Organization Settings',
            icon: Settings,
            path: '/settings',
          },
          {
            title: 'Profile',
            icon: User,
            path: '/profile',
          },
        ],
      }
    }

    // Team Member Navigation
    return {
      main: [
        {
          title: 'Dashboard',
          icon: LayoutDashboard,
          path: '/dashboard/team',
        },
        {
          title: 'My Tasks',
          icon: ClipboardList,
          path: '/my-tasks',
        },
        {
          title: 'Time Tracking',
          icon: Timer,
          path: '/time-tracking',
        },
        {
          title: 'Projects',
          icon: FolderKanban,
          path: '/projects',
        },
      ],
      bottom: [
        {
          title: 'Profile',
          icon: User,
          path: '/profile',
        },
        {
          title: 'Settings',
          icon: Settings,
          path: '/settings',
        },
      ],
    }
  }

  const navItems = getNavItems()

  const NavItem = ({ item }) => {
    const active = isActive(item.path)
    
    return (
      <TooltipProvider delayDuration={0} key={item.path}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={item.path}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                ${
                  active
                    ? 'bg-gradient-to-r from-[#2563EB]/20 to-[#7C3AED]/20 text-white shadow-sm border border-white/5'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <item.icon className={`h-5 w-5 ${active ? 'text-[#2563EB]' : 'text-muted-foreground'}`} />
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
    <div className="flex h-full w-[280px] flex-col bg-[#0B132B] border-r border-white/5">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/5 px-6">
        <Link to={navItems.main[0]?.path || '/'} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">
            <span className="text-sm font-bold text-white">SX</span>
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white">STUDIO X</span>
            <p className="text-[6px] text-white/40 tracking-[0.2em]">TRAFFIC MANAGEMENT</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b border-white/5 px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 border border-white/5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white font-semibold text-sm">
            {getInitials()}
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-white truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-white/40 capitalize">{getRoleDisplay(user?.role)}</p>
          </div>
          <Badge variant="outline" className="text-xs border-white/10 text-white/60">
            {user?.status || 'Active'}
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-0.5">
          {navItems.main.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {navItems.bottom.length > 0 && (
          <>
            <Separator className="my-4 bg-white/5" />
            <div className="space-y-0.5">
              {navItems.bottom.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Logout Button */}
      <div className="border-t border-white/5 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
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