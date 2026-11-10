import { Injectable, signal } from '@angular/core';

/**
 * Global search shared by the navbar and the lists (admin CRUDs, organizer events, my tickets).
 * The navbar writes the term and each list filters its own data with `matches()`.
 */
@Injectable({
  providedIn: 'root',
})
export class Search {
  private readonly term = signal('');

  setSearchTerm(term: string) {
    this.term.set(term);
  }

  getSearchTerm() {
    return this.term();
  }

  clear() {
    this.term.set('');
  }

  /** True when the search is empty or any of the given values contains the term (case-insensitive). */
  matches(...values: (string | number | null | undefined)[]): boolean {
    const term = this.term().trim().toLowerCase();
    if (!term) return true;
    return values.some((v) => v !== null && v !== undefined && String(v).toLowerCase().includes(term));
  }
}
