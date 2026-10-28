// Mirrors the backend enum Access.API.Enums.TicketStatus (sent as a number in the JSON).
export enum TicketStatus {
  Reserved = 0,
  Cancelled = 1,
  Purchased = 2,
}

export const TICKET_STATUS_OPTIONS = [
  { value: TicketStatus.Reserved, label: 'Reserved' },
  { value: TicketStatus.Purchased, label: 'Purchased' },
  { value: TicketStatus.Cancelled, label: 'Cancelled' },
];

export function getTicketStatusLabel(status: number): string {
  switch (status) {
    case TicketStatus.Reserved: return 'Reserved';
    case TicketStatus.Cancelled: return 'Cancelled';
    case TicketStatus.Purchased: return 'Purchased';
    default: return 'Unknown';
  }
}

/** Tailwind classes for the colored status badge. */
export function getTicketStatusClasses(status: number): string {
  switch (status) {
    case TicketStatus.Reserved: return 'bg-amber-100 text-amber-800 border-amber-200';
    case TicketStatus.Cancelled: return 'bg-red-100 text-red-700 border-red-200';
    case TicketStatus.Purchased: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

/** Only reserved (not yet paid) tickets can be cancelled, same rule as the backend. */
export function canCancelTicket(status: number): boolean {
  return status === TicketStatus.Reserved;
}
