import { z } from 'zod';

export const BookingStatus = z.enum(['CONFIRMED', 'PENDING', 'ARRIVED', 'NO_SHOW', 'CANCELLED']);
export const PaymentStatus = z.enum(['PAID', 'PENDING', 'FAILED', 'PARTIAL']);

export const Booking = z.object({
  id: z.string(),
  code: z.string(),
  guestName: z.string(),
  phone: z.string(),
  groupSize: z.number().int().min(1),
  date: z.string(), // ISO
  time: z.string(), // "HH:mm"
  tableId: z.string().nullable(),
  tableLabel: z.string().nullable(),
  category: z.enum(['VIP', 'Premium', 'Standard']),
  paymentStatus: PaymentStatus,
  bookingStatus: BookingStatus,
  notes: z.string().optional(),
  qrRef: z.string().optional(),
  arrivalSubcodes: z.array(z.enum(['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7'])).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const BookingCreate = Booking.pick({
  guestName: true,
  phone: true,
  groupSize: true,
  date: true,
  time: true,
  category: true,
  notes: true,
}).extend({
  tableId: z.string().optional(),
  minSpend: z.number().int().optional(),
});

export const NotificationItem = z.object({
  id: z.string(),
  type: z.enum(['SYSTEM', 'PAYMENT', 'ARRIVAL', 'NO_SHOW', 'BOT']),
  title: z.string(),
  body: z.string(),
  severity: z.enum(['INFO', 'WARN', 'ERROR']),
  createdAt: z.string(),
  readAt: z.string().nullable(),
  link: z.string().nullable(),
});

export const Preferences = z.object({
  theme: z.enum(['dark', 'black']).default('dark'),
  density: z.enum(['comfortable', 'compact']).default('comfortable'),
  sounds: z.boolean().default(false),
  language: z.string().default('en'),
  timeFormat: z.enum(['12h', '24h']).default('24h'),
  reducedMotion: z.boolean().default(false),
});

export const UserProfile = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  role: z.enum(['STAFF', 'ADMIN']),
  venues: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  preferences: Preferences.default({}),
});

export type TBooking = z.infer<typeof Booking>;
export type TBookingCreate = z.infer<typeof BookingCreate>;
export type TNotificationItem = z.infer<typeof NotificationItem>;
export type TUserProfile = z.infer<typeof UserProfile>;
export type TPreferences = z.infer<typeof Preferences>;

