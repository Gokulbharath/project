export interface TableData {
  id: string;
  label: string;
  section: 'VIP' | 'Premium' | 'Standard';
  capacity: number;
  status: 'available' | 'reserved' | 'occupied';
  x: number;
  y: number;
  w?: number;
  h?: number;
  guestName?: string;
  arrivalTime?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  subcodes?: string[];
}

// Design-space coordinates (1200×800 floor plan)
export const tables: TableData[] = [
  {
    id: 'V01',
    label: 'V01',
    section: 'VIP',
    capacity: 8,
    status: 'available',
    x: 100,
    y: 100,
    w: 96,
    h: 128,
  },
  {
    id: 'A05',
    label: 'A05',
    section: 'Standard',
    capacity: 4,
    status: 'reserved',
    x: 350,
    y: 150,
    w: 96,
    h: 128,
    guestName: 'Sarah Johnson',
    arrivalTime: '22:30',
    paymentStatus: 'pending',
    subcodes: ['K1', 'K3'],
  },
  {
    id: 'P03',
    label: 'P03',
    section: 'Premium',
    capacity: 6,
    status: 'available',
    x: 750,
    y: 120,
    w: 96,
    h: 128,
  },
  {
    id: 'V02',
    label: 'V02',
    section: 'VIP',
    capacity: 10,
    status: 'available',
    x: 120,
    y: 320,
    w: 96,
    h: 128,
  },
  {
    id: 'B11',
    label: 'B11',
    section: 'Standard',
    capacity: 6,
    status: 'reserved',
    x: 380,
    y: 350,
    w: 96,
    h: 128,
    guestName: 'Michael Chen',
    arrivalTime: '23:00',
    paymentStatus: 'paid',
    subcodes: ['K2', 'K4', 'K5'],
  },
  {
    id: 'C08',
    label: 'C08',
    section: 'Standard',
    capacity: 4,
    status: 'available',
    x: 100,
    y: 550,
    w: 96,
    h: 128,
  },
  {
    id: 'V04',
    label: 'V04',
    section: 'VIP',
    capacity: 12,
    status: 'occupied',
    x: 800,
    y: 550,
    w: 96,
    h: 128,
    guestName: 'The Martinez Group',
    arrivalTime: '21:45',
    paymentStatus: 'paid',
    subcodes: ['K1', 'K6', 'K7'],
  },
  {
    id: 'P08',
    label: 'P08',
    section: 'Premium',
    capacity: 8,
    status: 'occupied',
    x: 500,
    y: 500,
    w: 96,
    h: 128,
    guestName: 'Emma Wilson',
    arrivalTime: '22:15',
    paymentStatus: 'paid',
    subcodes: ['K3', 'K5'],
  },
];
