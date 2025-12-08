export type TableStatus = 'available' | 'reserved' | 'occupied';
export type Section = 'VIP' | 'Premium' | 'Standard';

export type TableItem = {
  id: string;
  label: string;
  section: Section;
  capacity: number;
  status: TableStatus;
  x: number;
  y: number;
  w?: number;
  h?: number;
};

