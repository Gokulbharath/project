/**
 * Table Map Canvas Types
 * Design space coordinates are floor-plan pixels (e.g., 1200×800).
 * Screen space coordinates are viewport pixels after transform.
 */

export type TableStatus = 'available' | 'reserved' | 'occupied';

export interface TableItem {
  id: string;
  label: string;
  section: 'VIP' | 'Premium' | 'Standard';
  capacity: number;
  status: TableStatus;
  x: number; // design-space X
  y: number; // design-space Y
  w?: number; // design-space width (default 96)
  h?: number; // design-space height (default 128)
  guestName?: string;
  arrivalTime?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  subcodes?: string[];
}

export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface FitConfig {
  padding: number; // margin around bbox in screen space
  minScale: number; // minimum zoom level
  maxScale: number; // maximum zoom level
  grid: number; // grid size for snapping (design space)
}

export interface CanvasState {
  scale: number;
  offset: Point; // screen-space translation
}

export interface TransformParams {
  scale: number;
  offset: Point;
}
