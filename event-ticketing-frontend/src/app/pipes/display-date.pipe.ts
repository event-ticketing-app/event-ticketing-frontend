import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

/**
 * Formats a date for tables. Shows "—" when there is no real date,
 * e.g. the C# default "0001-01-01T00:00:00" sent for tickets not purchased yet.
 */
@Pipe({ name: 'displayDate' })
export class DisplayDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format = 'dd/MM/yyyy HH:mm'): string {
    if (!value) return '—';
    const date = new Date(value);
    if (isNaN(date.getTime()) || date.getFullYear() <= 1) return '—';
    return formatDate(date, format, 'en-US');
  }
}
