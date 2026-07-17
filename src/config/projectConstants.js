export const PROJECT_STATUS = {
    PLANNING: 'planning',
    ACTIVE: 'active',
    ON_HOLD: 'on_hold',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

export const PROJECT_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
};

export const PROJECT_TYPE = {
    BRANDING: 'branding',
    WEB_DESIGN: 'web_design',
    SOCIAL_MEDIA: 'social_media',
    VIDEO_PRODUCTION: 'video_production',
    PRINT: 'print',
    MARKETING_CAMPAIGN: 'marketing_campaign',
    UI_UX: 'ui_ux',
    PHOTOGRAPHY: 'photography',
    CONTENT_CREATION: 'content_creation',
    OTHER: 'other',
};

export const DEPARTMENT = {
    DESIGN: 'design',
    DEVELOPMENT: 'development',
    MARKETING: 'marketing',
    CONTENT: 'content',
    STRATEGY: 'strategy',
    OTHER: 'other',
};

export const HEALTH_STATUS = {
    ON_TRACK: 'on_track',
    AT_RISK: 'at_risk',
    DELAYED: 'delayed',
};

export const STATUS_LABELS = {
    [PROJECT_STATUS.PLANNING]: 'Planning',
    [PROJECT_STATUS.ACTIVE]: 'Active',
    [PROJECT_STATUS.ON_HOLD]: 'On Hold',
    [PROJECT_STATUS.COMPLETED]: 'Completed',
    [PROJECT_STATUS.CANCELLED]: 'Cancelled',
};

export const PRIORITY_LABELS = {
    [PROJECT_PRIORITY.LOW]: 'Low',
    [PROJECT_PRIORITY.MEDIUM]: 'Medium',
    [PROJECT_PRIORITY.HIGH]: 'High',
    [PROJECT_PRIORITY.CRITICAL]: 'Critical',
};

export const TYPE_LABELS = {
    [PROJECT_TYPE.BRANDING]: 'Branding',
    [PROJECT_TYPE.WEB_DESIGN]: 'Web Design',
    [PROJECT_TYPE.SOCIAL_MEDIA]: 'Social Media',
    [PROJECT_TYPE.VIDEO_PRODUCTION]: 'Video Production',
    [PROJECT_TYPE.PRINT]: 'Print',
    [PROJECT_TYPE.MARKETING_CAMPAIGN]: 'Marketing Campaign',
    [PROJECT_TYPE.UI_UX]: 'UI/UX',
    [PROJECT_TYPE.PHOTOGRAPHY]: 'Photography',
    [PROJECT_TYPE.CONTENT_CREATION]: 'Content Creation',
    [PROJECT_TYPE.OTHER]: 'Other',
};

export const DEPARTMENT_LABELS = {
    [DEPARTMENT.DESIGN]: 'Design',
    [DEPARTMENT.DEVELOPMENT]: 'Development',
    [DEPARTMENT.MARKETING]: 'Marketing',
    [DEPARTMENT.CONTENT]: 'Content',
    [DEPARTMENT.STRATEGY]: 'Strategy',
    [DEPARTMENT.OTHER]: 'Other',
};

export const HEALTH_LABELS = {
    [HEALTH_STATUS.ON_TRACK]: 'On Track',
    [HEALTH_STATUS.AT_RISK]: 'At Risk',
    [HEALTH_STATUS.DELAYED]: 'Delayed',
};

export const STATUS_COLORS = {
    [PROJECT_STATUS.PLANNING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    [PROJECT_STATUS.ACTIVE]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    [PROJECT_STATUS.ON_HOLD]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    [PROJECT_STATUS.COMPLETED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    [PROJECT_STATUS.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export const PRIORITY_COLORS = {
    [PROJECT_PRIORITY.LOW]: 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400',
    [PROJECT_PRIORITY.MEDIUM]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    [PROJECT_PRIORITY.HIGH]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    [PROJECT_PRIORITY.CRITICAL]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export const HEALTH_COLORS = {
    [HEALTH_STATUS.ON_TRACK]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    [HEALTH_STATUS.AT_RISK]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    [HEALTH_STATUS.DELAYED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export const PROJECT_COLORS = [
    '#2563EB', '#7C3AED', '#06B6D4', '#22C55E', '#F59E0B',
    '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
    '#6366F1', '#84CC16', '#D946EF', '#0EA5E9',
];

export const DEFAULT_PROJECT_COLOR = '#2563EB';