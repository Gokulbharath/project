import {
  Booking,
  BookingCreate,
  NotificationItem,
  UserProfile,
  TBooking,
  TBookingCreate,
  TNotificationItem,
  TUserProfile,
} from '@/types/staff';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data storage
let mockBookings: TBooking[] = [
  {
    id: 'B001',
    code: 'BK-2024-001',
    guestName: 'Sarah Johnson',
    phone: '+1-555-0101',
    groupSize: 6,
    date: new Date().toISOString().split('T')[0],
    time: '22:30',
    tableId: 'T05',
    tableLabel: 'A05',
    category: 'Premium',
    paymentStatus: 'PENDING',
    bookingStatus: 'CONFIRMED',
    notes: 'VIP guest, prefers corner table',
    qrRef: 'qr_001',
    arrivalSubcodes: ['K1', 'K3'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'B002',
    code: 'BK-2024-002',
    guestName: 'Michael Chen',
    phone: '+1-555-0102',
    groupSize: 4,
    date: new Date().toISOString().split('T')[0],
    time: '23:00',
    tableId: 'T11',
    tableLabel: 'B11',
    category: 'Standard',
    paymentStatus: 'PAID',
    bookingStatus: 'ARRIVED',
    notes: '',
    qrRef: 'qr_002',
    arrivalSubcodes: ['K2', 'K4'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'B003',
    code: 'BK-2024-003',
    guestName: 'Emma Wilson',
    phone: '+1-555-0103',
    groupSize: 8,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '21:00',
    tableId: 'T03',
    tableLabel: 'V03',
    category: 'VIP',
    paymentStatus: 'PARTIAL',
    bookingStatus: 'PENDING',
    notes: 'Birthday celebration',
    qrRef: 'qr_003',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'B004',
    code: 'BK-2024-004',
    guestName: 'David Brown',
    phone: '+1-555-0104',
    groupSize: 2,
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    tableId: null,
    tableLabel: null,
    category: 'Standard',
    paymentStatus: 'FAILED',
    bookingStatus: 'NO_SHOW',
    notes: '',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'B005',
    code: 'BK-2024-005',
    guestName: 'Lisa Anderson',
    phone: '+1-555-0105',
    groupSize: 5,
    date: new Date().toISOString().split('T')[0],
    time: '22:00',
    tableId: 'T08',
    tableLabel: 'P08',
    category: 'Premium',
    paymentStatus: 'PAID',
    bookingStatus: 'CANCELLED',
    notes: 'Cancelled due to weather',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

let mockNotifications: TNotificationItem[] = [
  {
    id: 'N001',
    type: 'PAYMENT',
    title: 'Payment Received',
    body: 'Sarah Johnson paid $500 for booking BK-2024-001',
    severity: 'INFO',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    readAt: null,
    link: '/staff/bookings/B001',
  },
  {
    id: 'N002',
    type: 'ARRIVAL',
    title: 'Guest Arrived',
    body: 'Michael Chen arrived at table B11',
    severity: 'INFO',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    readAt: null,
    link: '/staff/bookings/B002',
  },
  {
    id: 'N003',
    type: 'NO_SHOW',
    title: 'No Show Alert',
    body: 'David Brown did not arrive for booking BK-2024-004',
    severity: 'WARN',
    createdAt: new Date(Date.now() - 900000).toISOString(),
    readAt: new Date(Date.now() - 600000).toISOString(),
    link: '/staff/bookings/B004',
  },
  {
    id: 'N004',
    type: 'SYSTEM',
    title: 'System Update',
    body: 'New features available in the dashboard',
    severity: 'INFO',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    readAt: null,
    link: null,
  },
  {
    id: 'N005',
    type: 'BOT',
    title: 'Automated Reminder',
    body: 'Reminder: 3 bookings scheduled for tonight',
    severity: 'INFO',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    readAt: null,
    link: '/staff/bookings',
  },
];

const mockProfile: TUserProfile = {
  id: 'user-001',
  name: 'John Staff',
  email: 'staff@nightscene.com',
  phone: '+1-555-0001',
  role: 'STAFF',
  venues: [
    { id: 'venue-001', name: 'AURA Nightclub' },
    { id: 'venue-002', name: 'Midnight Lounge' },
  ],
  preferences: {
    theme: 'dark',
    density: 'comfortable',
    sounds: false,
    language: 'en',
    timeFormat: '24h',
    reducedMotion: false,
  },
};

let mockTickets: Array<{
  id: string;
  subject: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
}> = [
  {
    id: 'T001',
    subject: 'Payment mismatch on booking BK-2024-001',
    category: 'Payments',
    severity: 'MEDIUM',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'T002',
    subject: 'QR code not scanning',
    category: 'Technical',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

// Bookings
export async function listBookings(params: {
  q?: string;
  date?: string;
  status?: string;
  payment?: string;
  page?: number;
}): Promise<{ items: TBooking[]; total: number }> {
  await delay(300 + Math.random() * 300);

  let filtered = [...mockBookings];

  if (params.q) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.guestName.toLowerCase().includes(query) ||
        b.code.toLowerCase().includes(query) ||
        b.phone.includes(query)
    );
  }

  if (params.date) {
    filtered = filtered.filter((b) => b.date === params.date);
  }

  if (params.status) {
    filtered = filtered.filter((b) => b.bookingStatus === params.status);
  }

  if (params.payment) {
    filtered = filtered.filter((b) => b.paymentStatus === params.payment);
  }

  const page = params.page || 1;
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const items = filtered.slice(start, end);
  const validated = items.map((b) => Booking.parse(b));

  return {
    items: validated,
    total: filtered.length,
  };
}

export async function getBooking(id: string): Promise<TBooking> {
  await delay(300 + Math.random() * 300);
  const booking = mockBookings.find((b) => b.id === id);
  if (!booking) {
    throw new Error('Booking not found');
  }
  return Booking.parse(booking);
}

export async function createBooking(input: TBookingCreate): Promise<TBooking> {
  await delay(400 + Math.random() * 200);
  const newBooking: TBooking = {
    id: `B${String(mockBookings.length + 1).padStart(3, '0')}`,
    code: `BK-2024-${String(mockBookings.length + 1).padStart(3, '0')}`,
    guestName: input.guestName,
    phone: input.phone,
    groupSize: input.groupSize,
    date: input.date,
    time: input.time,
    tableId: input.tableId || null,
    tableLabel: input.tableId ? `T${input.tableId.slice(-2)}` : null,
    category: input.category,
    paymentStatus: 'PENDING',
    bookingStatus: 'PENDING',
    notes: input.notes || '',
    qrRef: `qr_${mockBookings.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockBookings.push(newBooking);
  return Booking.parse(newBooking);
}

export async function updateBooking(id: string, patch: Partial<TBooking>): Promise<TBooking> {
  await delay(300 + Math.random() * 300);
  const index = mockBookings.findIndex((b) => b.id === id);
  if (index === -1) {
    throw new Error('Booking not found');
  }
  mockBookings[index] = { ...mockBookings[index], ...patch, updatedAt: new Date().toISOString() };
  return Booking.parse(mockBookings[index]);
}

export async function markPaid(id: string): Promise<{ ok: true }> {
  await delay(300 + Math.random() * 200);
  await updateBooking(id, { paymentStatus: 'PAID' });
  return { ok: true };
}

export async function markArrived(id: string): Promise<{ ok: true }> {
  await delay(300 + Math.random() * 200);
  await updateBooking(id, { bookingStatus: 'ARRIVED' });
  return { ok: true };
}

// Notifications
export async function listNotifications(params: {
  onlyUnread?: boolean;
  type?: string;
  page?: number;
}): Promise<{ items: TNotificationItem[]; total: number }> {
  await delay(300 + Math.random() * 300);

  let filtered = [...mockNotifications];

  if (params.onlyUnread) {
    filtered = filtered.filter((n) => !n.readAt);
  }

  if (params.type) {
    filtered = filtered.filter((n) => n.type === params.type);
  }

  const page = params.page || 1;
  const pageSize = 20;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const items = filtered.slice(start, end);
  const validated = items.map((n) => NotificationItem.parse(n));

  return {
    items: validated,
    total: filtered.length,
  };
}

export async function markNotificationRead(id: string): Promise<{ ok: true }> {
  await delay(200 + Math.random() * 200);
  const notification = mockNotifications.find((n) => n.id === id);
  if (notification) {
    notification.readAt = new Date().toISOString();
  }
  return { ok: true };
}

// Profile
export async function getProfile(): Promise<TUserProfile> {
  await delay(300 + Math.random() * 300);
  const stored = localStorage.getItem('ns.preferences');
  if (stored) {
    try {
      const prefs = JSON.parse(stored);
      mockProfile.preferences = { ...mockProfile.preferences, ...prefs };
    } catch {
      // ignore
    }
  }
  return UserProfile.parse(mockProfile);
}

export async function updatePreferences(prefs: TUserProfile['preferences']): Promise<TUserProfile> {
  await delay(300 + Math.random() * 300);
  mockProfile.preferences = { ...mockProfile.preferences, ...prefs };
  localStorage.setItem('ns.preferences', JSON.stringify(prefs));
  return UserProfile.parse(mockProfile);
}

// Support tickets
export async function listTickets(): Promise<
  Array<{
    id: string;
    subject: string;
    category: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
    createdAt: string;
    updatedAt: string;
  }>
> {
  await delay(300 + Math.random() * 300);
  return [...mockTickets];
}

export async function createTicket(input: {
  subject: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  attachmentUrl?: string;
}): Promise<{ ok: true }> {
  await delay(400 + Math.random() * 200);
  const newTicket = {
    id: `T${String(mockTickets.length + 1).padStart(3, '0')}`,
    subject: input.subject,
    category: input.category,
    severity: input.severity,
    status: 'OPEN' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTickets.push(newTicket);
  return { ok: true };
}

// Export mock data for testing/development
export function getMockBookings() {
  return mockBookings;
}

export function addMockNotification(notification: TNotificationItem) {
  mockNotifications.unshift(notification);
}

