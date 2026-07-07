export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Protected Routes
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/dashboard/admin',
  TEAM_DASHBOARD: '/dashboard/team',
  PROFILE: '/profile',
  
  // Future Routes
  CLIENTS: '/clients',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  TRAFFIC_BOARD: '/traffic-board',
  REPORTS: '/reports',
  
  // Error Routes
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/403',

  USERS: '/users',

  CLIENTS: '/clients',
}

export const USER_ROLES = {
  ADMIN: 'admin',
  TEAM_MEMBER: 'team_member',
}

export const ROLE_ROUTES = {
  [USER_ROLES.ADMIN]: {
    default: ROUTES.ADMIN_DASHBOARD,
    allowed: [
      ROUTES.ADMIN_DASHBOARD,
      ROUTES.USERS,
      ROUTES.CLIENTS,
      ROUTES.PROJECTS,
      ROUTES.REPORTS,
    ],
  },
  [USER_ROLES.TEAM_MEMBER]: {
    default: ROUTES.TEAM_DASHBOARD,
    allowed: [
      ROUTES.TEAM_DASHBOARD,
      ROUTES.TASKS,
      ROUTES.TRAFFIC_BOARD,
    ],
  },
}