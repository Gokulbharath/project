export type TableStatus = 'available' | 'reserved' | 'occupied';
export type TableShape = 'square' | 'round';
export type TableCategory = 'VIP' | 'Premium' | 'Standard';
export type BookingStatus = 'confirmed' | 'arrived' | 'completed' | 'cancelled' | 'no-show';
export type PaymentStatus = 'pending' | 'paid' | 'overdue';
export type LogSeverity = 'info' | 'warn' | 'error';
export type SubCode = 'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6' | 'K7';

export interface Position {
  x: number;
  y: number;
}

export interface Booking {
  name: string;
  groupSize: number;
  subCode: SubCode;
  paymentStatus: PaymentStatus;
}

export interface Table {
  id: string;
  capacity: number;
  category: TableCategory;
  shape: TableShape;
  status: TableStatus;
  position: Position;
  minSpend: number;
  booking?: Booking;
}

export interface BookingDetail {
  id: string;
  guestName: string;
  phone: string;
  tableId: string;
  groupSize: number;
  date: string;
  time: string;
  status: BookingStatus;
  subCode: SubCode;
  minSpend: number;
  paymentStatus: PaymentStatus;
  notes: string;
}

export interface Arrival {
  id: string;
  guestName: string;
  tableId: string;
  subCode: SubCode;
  timestamp: string;
  groupSize: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  guestName: string;
  tableId: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  method: string | null;
}

export interface Log {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  severity: LogSeverity;
}

export interface KPIs {
  totalBookings: number;
  monthlyRevenue: number;
  peakHours: string;
  tableOccupancy: number;
}

export interface Analytics {
  kpis: KPIs;
  dailyBookings: Array<{ date: string; bookings: number }>;
  hourlyOccupancy: Array<{ hour: string; occupied: number; total: number }>;
  categoryUsage: Array<{ category: string; bookings: number; revenue: number }>;
}

export interface WalkInBookingForm {
  guestName: string;
  phone: string;
  tableId: string;
  groupSize: number;
  minSpend: number;
  notes: string;
}

export type UserRole = 'staff' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface VenueOnboarding {
  venueName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  openingHours: string;
  closingHours: string;
  tableCategories: string[];
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
}
