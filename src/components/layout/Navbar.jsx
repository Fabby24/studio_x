import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
  Users,
  FolderKanban,
  ClipboardList,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { authService } from '../../services/authService'
import { ROUTES } from '../../config/routes'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications] = useState([
    {
      id: 1,
      title: 'New task assigned',
      description: 'You have been assigned a new task',
      time: '5 min ago',
      read: false,
    },
    {
      id: 2,
      title: 'Project update',
      description: 'Project Alpha has been updated',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      title: 'Deadline approaching',
      description: 'Task "Design review" is due in 2 days',
      time: '3 hours ago',
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate(ROUTES.LOGIN)
    } catch (error) {
      console.error('Logout error:', error)
      logout()
      navigate(ROUTES.LOGIN)
    }
  }

  const getInitials = () => {
    if (!user) return 'U'
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
  }

  const quickActions = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Users', icon: Users, path: '/users' },
    { label: 'Projects', icon: FolderKanban, path: '/projects' },
    { label: 'Tasks', icon: ClipboardList, path: '/tasks' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="h-9 w-[200px] pl-9 lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px]">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs">
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex flex-col items-start gap-1 p-3 ${
                      !notification.read ? 'bg-accent/50' : ''
                    }`}
                  >
                    <div className="flex w-full items-start justify-between">
                      <span className="font-medium">{notification.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {notification.description}
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-center text-sm text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:flex"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profile_image} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm">
                  {user?.first_name} {user?.last_name}
                </span>
                <ChevronDown className="hidden md:block h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px]">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <Badge variant="outline" className="w-fit text-xs capitalize">
                    {user?.role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border px-4 py-3 md:hidden"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    navigate(action.path)
                    setSearchOpen(false)
                  }}
                >
                  <action.icon className="mr-2 h-3 w-3" />
                  {action.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export { Navbar }