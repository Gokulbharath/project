export const registry = {
  // Sidebar / nav
  dashboard:     'solar:widget-5-bold-duotone',
  'table-map':   'solar:map-point-wave-bold-duotone',
  arrivals:      'solar:users-group-two-rounded-bold-duotone',
  payments:      'solar:wallet-money-bold-duotone',
  walkins:       'solar:user-plus-rounded-bold-duotone',

  admin:         'solar:settings-bold-duotone',
  onboarding:    'solar:login-2-bold-duotone',
  layout:        'solar:layout-cells-bold-duotone',
  analytics:     'solar:chart-2-bold-duotone',
  logs:          'solar:clipboard-list-bold-duotone',

  settings:      'solar:settings-minimalistic-bold-duotone',
  profile:       'solar:user-rounded-bold-duotone',
  notifications: 'solar:bell-bing-bold-duotone',
  search:        'solar:magnifier-bold-duotone',
  logout:        'solar:logout-2-bold-duotone',

  // Domain / status
  vip:           'solar:crown-bold-duotone',
  premium:       'solar:diamond-bold-duotone',
  standard:      'solar:ticket-bold-duotone',
  guest:         'solar:user-rounded-bold-duotone',
  group:         'solar:users-group-rounded-bold-duotone',
  qr:            'solar:qr-code-bold-duotone',
  money:         'solar:banknote-bold-duotone',
  calendar:      'solar:calendar-bold-duotone',
  clock:         'solar:clock-circle-bold-duotone',

  // Actions
  check:         'solar:check-read-bold-duotone',
  close:         'solar:close-circle-bold-duotone',
  edit:          'solar:pen-2-bold-duotone',
  delete:        'solar:trash-bin-trash-bold-duotone',
  download:      'solar:download-bold-duotone',
  upload:        'solar:upload-bold-duotone',
  'arrow-right': 'solar:arrow-right-bold-duotone',
  'arrow-left':  'solar:arrow-left-bold-duotone',
  filter:        'solar:tuning-2-bold-duotone',
  plus:          'solar:add-bold-duotone',
  save:          'solar:download-bold-duotone',

  // Feedback / states
  info:          'solar:info-circle-bold-duotone',
  warning:       'solar:danger-triangle-bold-duotone',
  error:         'solar:danger-circle-bold-duotone',
  success:       'solar:check-circle-bold-duotone',
  bell:          'solar:bell-bing-bold-duotone',

  // Map utilities
  'zoom-in':     'solar:zoom-in-bold-duotone',
  'zoom-out':    'solar:zoom-out-bold-duotone',
  fit:           'solar:fullscreen-bold-duotone',
  map:           'solar:map-point-bold-duotone',
  seat:          'solar:seat-bold-duotone',
  chart:         'solar:chart-bold-duotone',

  // Extras
  mail:          'solar:mail-bold-duotone',
  lock:          'solar:lock-bold-duotone',
  sparkles:      'solar:star-bold-duotone',
  tag:           'solar:tag-bold-duotone',
} as const;

export type IconName = keyof typeof registry;

export default registry;
