import { Component, OnInit, Inject, PLATFORM_ID, computed, signal } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TicketPurchaseResponse, TicketService } from '../../services/ticket';
import { ConfirmService } from '../../services/confirm';
import { Search } from '../../services/search';
import { EventImagePipe } from '../../pipes/event-image.pipe';
import { TicketStatus, canCancelTicket, getTicketStatusLabel } from '../../services/ticket-status';

type SortOption = 'upcoming' | 'recent' | 'price-desc' | 'price-asc';

@Component({
  selector: 'app-my-tickets',
  imports: [DatePipe, RouterLink, MatIconModule, EventImagePipe],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css',
})
export class MyTickets implements OnInit {
  readonly TicketStatus = TicketStatus;

  readonly tickets = signal<TicketPurchaseResponse[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  /** Id of the ticket being cancelled, to disable its button meanwhile. */
  readonly cancellingId = signal<number | null>(null);
  readonly actionError = signal('');

  readonly selectedStatus = signal<TicketStatus | null>(null);
  readonly sortBy = signal<SortOption>('upcoming');

  readonly statusTabs: { value: TicketStatus | null; label: string }[] = [
    { value: null, label: 'All' },
    { value: TicketStatus.Purchased, label: 'Purchased' },
    { value: TicketStatus.Reserved, label: 'Reserved' },
    { value: TicketStatus.Cancelled, label: 'Cancelled' },
  ];

  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'upcoming', label: 'Event date' },
    { value: 'recent', label: 'Recently purchased' },
    { value: 'price-desc', label: 'Highest price' },
    { value: 'price-asc', label: 'Lowest price' },
  ];

  readonly canCancel = canCancelTicket;
  readonly statusLabel = getTicketStatusLabel;

  /** Tickets matching the navbar search (before the status tab), used for the tab counters. */
  private readonly searched = computed(() =>
    this.tickets().filter((t) =>
      this.searchService.matches(t.eventName, t.eventDescription, getTicketStatusLabel(t.status)),
    ),
  );

  readonly filteredTickets = computed(() => {
    const status = this.selectedStatus();
    const list = this.searched().filter((t) => status === null || t.status === status);

    return [...list].sort((a, b) => {
      switch (this.sortBy()) {
        case 'recent': return this.activityTime(b) - this.activityTime(a);
        case 'price-desc': return b.price - a.price;
        case 'price-asc': return a.price - b.price;
        default: return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      }
    });
  });

  /** Purchased tickets for events that haven't happened yet. */
  readonly upcomingCount = computed(
    () => this.tickets().filter((t) => t.status === TicketStatus.Purchased && !this.isPast(t)).length,
  );

  readonly hasActiveFilters = computed(
    () => this.selectedStatus() !== null || this.searchService.getSearchTerm().trim() !== '',
  );

  constructor(
    private ticketService: TicketService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private confirm: ConfirmService,
    private searchService: Search,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadTickets();
  }

  private loadTickets() {
    this.ticketService.getMyTickets().subscribe({
      next: (response) => {
        this.tickets.set(response);
        this.loadError.set(false);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }

  countFor(status: TicketStatus | null): number {
    return status === null ? this.searched().length : this.searched().filter((t) => t.status === status).length;
  }

  /** Purchase date, or the reservation time for tickets that were never paid. */
  private activityTime(ticket: TicketPurchaseResponse): number {
    return new Date(ticket.purchaseAt ?? ticket.expiresAt).getTime();
  }

  isPast(ticket: TicketPurchaseResponse): boolean {
    return new Date(ticket.eventDate).getTime() < Date.now();
  }

  onSortChange(value: string) {
    this.sortBy.set(value as SortOption);
  }

  clearFilters() {
    this.selectedStatus.set(null);
    this.searchService.clear();
  }

  cancel(ticket: TicketPurchaseResponse) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.confirm
      .ask({
        title: 'Cancel ticket',
        message: `Are you sure you want to cancel your ticket for "${ticket.eventName}"?`,
        confirmText: 'Cancel ticket',
        cancelText: 'Keep ticket',
      })
      .subscribe(() => {
        this.cancellingId.set(ticket.id);
        this.actionError.set('');
        this.ticketService.cancelTicket(ticket.id).subscribe({
          next: () => {
            this.cancellingId.set(null);
            this.loadTickets();
          },
          error: () => {
            this.cancellingId.set(null);
            this.actionError.set(`We could not cancel your ticket for "${ticket.eventName}". Please try again.`);
          },
        });
      });
  }

  /** Hide broken images so the placeholder behind them shows. */
  onImageError(event: globalThis.Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
