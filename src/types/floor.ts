/**
 * Floor Plan Types - Design-space coordinates for table positioning
 */

export type TableStatus = 'available' | 'reserved' | 'occupied';

export interface TableItem {
  id: string;
  label: string;
  section: 'VIP' | 'Premium' | 'Standard';
  capacity: number;
  status: TableStatus;
  x: number; // design-space X coordinate
  y: number; // design-space Y coordinate
  w?: number; // design-space width (default 96)
  h?: number; // design-space height (default 128)
  guestName?: string;
  arrivalTime?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  subcodes?: string[];
}

export interface Viewport {
  scale: number; // zoom level
  tx: number; // screen-space translate X
  ty: number; // screen-space translate Y
}

export interface FitOpts {
  padding: number; // margin around bbox in screen space
  minScale: number; // minimum zoom (e.g., 0.5)
  maxScale: number; // maximum zoom (e.g., 2)
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface DesignPoint {
  x: number;
  y: number;
}
