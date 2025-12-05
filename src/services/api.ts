import type {
  Table,
  BookingDetail,
  Arrival,
  Payment,
  Analytics,
  Log,
  WalkInBookingForm,
  VenueOnboarding,
  User,
  AuthResponse,
  UserRole,
} from '@/types';
import { API_DELAY } from '@/utils/constants';

import tablesData from '@/mock/tables.json';
import bookingsData from '@/mock/bookings.json';
import arrivalsData from '@/mock/arrivals.json';
import paymentsData from '@/mock/payments.json';
import analyticsData from '@/mock/analytics.json';
import logsData from '@/mock/logs.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock users for demo
const mockUsers: Record<string, { password: string; user: User }> = {
  'staff@nightscene.com': {
    password: 'any',
    user: {
      id: 'staff-001',
      email: 'staff@nightscene.com',
      name: 'John Staff',
      role: 'staff',
    },
  },
  'admin@nightscene.com': {
    password: 'any',
    user: {
      id: 'admin-001',
      email: 'admin@nightscene.com',
      name: 'Jane Admin',
      role: 'admin',
    },
  },
};

export const api = {
  auth: {
    login: async (email: string, _password: string): Promise<AuthResponse> => {
      await delay(API_DELAY);
      const userCreds = mockUsers[email.toLowerCase()];
      if (userCreds) {
        return {
          token: `token_${userCreds.user.id}`,
          user: userCreds.user,
        };
      }
      // For any other email/password combination, create a staff user
      return {
        token: `token_${Date.now()}`,
        user: {
          id: `user_${Date.now()}`,
          email,
          name: email.split('@')[0],
          role: 'staff' as UserRole,
        },
      };
    },

    logout: async (): Promise<void> => {
      await delay(API_DELAY);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  tables: {
    getAll: async (): Promise<Table[]> => {
      await delay(API_DELAY);
      return tablesData as Table[];
    },

    getById: async (id: string): Promise<Table | null> => {
      await delay(API_DELAY);
      const table = tablesData.find((t) => t.id === id);
      return table as Table | null;
    },

    updateStatus: async (id: string, status: Table['status']): Promise<Table> => {
      await delay(API_DELAY);
      const table = tablesData.find((t) => t.id === id);
      if (table) {
        (table as any).status = status;
      }
      return table as Table;
    },

    updateLayout: async (tables: Table[]): Promise<void> => {
      await delay(API_DELAY);
      console.log('Layout updated:', tables);
    },
  },

  bookings: {
    getAll: async (): Promise<BookingDetail[]> => {
      await delay(API_DELAY);
      return bookingsData as BookingDetail[];
    },

    getById: async (id: string): Promise<BookingDetail | null> => {
      await delay(API_DELAY);
      const booking = bookingsData.find((b) => b.id === id);
      return booking as BookingDetail | null;
    },

    create: async (booking: WalkInBookingForm): Promise<BookingDetail> => {
      await delay(API_DELAY);
      const newBooking: BookingDetail = {
        id: `B${String(bookingsData.length + 1).padStart(3, '0')}`,
        guestName: booking.guestName,
        phone: booking.phone,
        tableId: booking.tableId,
        groupSize: booking.groupSize,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5),
        status: 'confirmed',
        subCode: 'K1',
        minSpend: booking.minSpend,
        paymentStatus: 'pending',
        notes: booking.notes,
      };
      return newBooking;
    },
  },

  arrivals: {
    getAll: async (): Promise<Arrival[]> => {
      await delay(API_DELAY);
      return arrivalsData as Arrival[];
    },

    getToday: async (): Promise<Arrival[]> => {
      await delay(API_DELAY);
      const today = new Date().toISOString().split('T')[0];
      return arrivalsData.filter((a) => a.timestamp.startsWith(today)) as Arrival[];
    },
  },

  payments: {
    getAll: async (): Promise<Payment[]> => {
      await delay(API_DELAY);
      return paymentsData as Payment[];
    },

    getPending: async (): Promise<Payment[]> => {
      await delay(API_DELAY);
      return paymentsData.filter((p) => p.status === 'pending') as Payment[];
    },

    getOverdue: async (): Promise<Payment[]> => {
      await delay(API_DELAY);
      return paymentsData.filter((p) => p.status === 'overdue') as Payment[];
    },

    updateStatus: async (id: string, status: Payment['status']): Promise<Payment> => {
      await delay(API_DELAY);
      const payment = paymentsData.find((p) => p.id === id);
      if (payment) {
        (payment as any).status = status;
      }
      return payment as Payment;
    },
  },

  analytics: {
    get: async (): Promise<Analytics> => {
      await delay(API_DELAY);
      return analyticsData as Analytics;
    },
  },

  logs: {
    getAll: async (): Promise<Log[]> => {
      await delay(API_DELAY);
      return logsData as Log[];
    },
  },

  venue: {
    onboard: async (data: VenueOnboarding): Promise<void> => {
      await delay(API_DELAY);
      console.log('Venue onboarded:', data);
    },
  },
};
