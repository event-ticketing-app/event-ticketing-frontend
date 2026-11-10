import { EventResponse } from './event';

/** Below this number of spots left the UI shows the "Only X left" alert. */
export const LOW_STOCK_LIMIT = 10;

type SpotsInfo = Pick<EventResponse, 'ticketCapacity' | 'ticketsSold'>;

/** ticketCapacity is the event's TOTAL capacity; reserved + purchased tickets are subtracted. */
export function spotsLeft(event: SpotsInfo): number {
  return Math.max(0, event.ticketCapacity - (event.ticketsSold ?? 0));
}

/** Percentage of the capacity already taken (0-100), for the progress bar. */
export function soldPercent(event: SpotsInfo): number {
  if (event.ticketCapacity <= 0) return 100;
  return Math.min(100, Math.round(((event.ticketsSold ?? 0) / event.ticketCapacity) * 100));
}

export function isSoldOut(event: SpotsInfo): boolean {
  return spotsLeft(event) <= 0;
}

export function isLowStock(event: SpotsInfo): boolean {
  const left = spotsLeft(event);
  return left > 0 && left <= LOW_STOCK_LIMIT;
}
