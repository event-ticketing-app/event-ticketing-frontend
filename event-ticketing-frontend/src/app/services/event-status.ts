// Mirrors the backend enum Access.API.Enums.EventStatus (sent as a number in the JSON).
export enum EventStatus {
  Pending = 0,
  Active = 1,
  Rejected = 2,
}

export function getEventStatusLabel(status: number): string {
  switch (status) {
    case EventStatus.Pending: return 'Pending';
    case EventStatus.Active: return 'Active';
    case EventStatus.Rejected: return 'Rejected';
    default: return 'Unknown';
  }
}

/** Tailwind classes for the colored status badge. */
export function getEventStatusClasses(status: number): string {
  switch (status) {
    case EventStatus.Pending: return 'bg-amber-100 text-amber-800 border-amber-200';
    case EventStatus.Active: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case EventStatus.Rejected: return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

/** Short explanation shown to organizers under the badge. */
export function getEventStatusHint(status: number): string {
  switch (status) {
    case EventStatus.Pending: return 'Waiting for admin approval. It is not public yet.';
    case EventStatus.Active: return 'Approved and visible to everyone.';
    case EventStatus.Rejected: return 'Rejected by an admin. Edit it to send it for review again.';
    default: return '';
  }
}
