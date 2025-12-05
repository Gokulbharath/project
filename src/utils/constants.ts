export const SUB_CODES = ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7'] as const;

export const TABLE_CATEGORIES = ['VIP', 'Premium', 'Standard'] as const;

export const SUBSCRIPTION_PLANS = ['basic', 'premium', 'enterprise'] as const;

export const STATUS_COLORS = {
  available: '#00FF90',
  reserved: '#4388FF',
  occupied: '#FF4466',
} as const;

export const SEVERITY_COLORS = {
  info: '#4A6CFF',
  warn: '#FFAA00',
  error: '#FF4466',
} as const;

export const SUB_CODE_COLORS: Record<string, string> = {
  K1: '#4A6CFF',
  K2: '#A56CFF',
  K3: '#00FF90',
  K4: '#4388FF',
  K5: '#FF4466',
  K6: '#FFD700',
  K7: '#FF8C00',
};

export const ROUTES = {
  LOGIN: '/login',
  STAFF_DASHBOARD: '/staff',
  STAFF_TABLE_MAP: '/staff/table-map',
  STAFF_ARRIVALS: '/staff/arrivals',
  STAFF_WALKINS: '/staff/walkins',
  STAFF_PAYMENTS: '/staff/payments',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ONBOARDING: '/admin/onboarding',
  ADMIN_LAYOUT: '/admin/layout',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_LOGS: '/admin/logs',
} as const;

export const API_DELAY = 500;
