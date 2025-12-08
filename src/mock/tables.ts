import type { TableItem } from '@/types/table';

export const tables: TableItem[] = [
  { id: 'V01', label: 'V01', section: 'VIP', capacity: 8, status: 'available', x: 40, y: 60 },
  { id: 'A05', label: 'A05', section: 'Standard', capacity: 4, status: 'reserved', x: 260, y: 40 },
  { id: 'P03', label: 'P03', section: 'Premium', capacity: 6, status: 'available', x: 520, y: 50 },
  { id: 'V02', label: 'V02', section: 'VIP', capacity: 10, status: 'available', x: 60, y: 180 },
  { id: 'B11', label: 'B11', section: 'Standard', capacity: 6, status: 'reserved', x: 240, y: 180 },
  { id: 'C08', label: 'C08', section: 'Standard', capacity: 4, status: 'available', x: 40, y: 360 },
  { id: 'V04', label: 'V04', section: 'VIP', capacity: 12, status: 'occupied', x: 520, y: 360 },
  { id: 'P08', label: 'P08', section: 'Premium', capacity: 8, status: 'occupied', x: 360, y: 320 },
];
