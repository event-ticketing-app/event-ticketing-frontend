import { Component, OnInit, Inject, PLATFORM_ID, signal, ElementRef, ViewChild, HostListener } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { EventService, EventResponse } from '../../services/event';
import { EventImagePipe } from '../../pipes/event-image.pipe';
import { isLowStock, isSoldOut, spotsLeft } from '../../services/event-spots';

type DateFilter = 'any' | 'weekend' | 'month';
type PriceFilter = 'any' | 'free' | 'under20' | '20-50' | 'vip';
type SortOption = 'upcoming' | 'price-asc' | 'price-desc' | 'name';


@Component({
  selector: 'app-event-list',
  imports: [DatePipe, RouterLink, MatIconModule, EventImagePipe],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventList implements OnInit {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  readonly events = signal<EventResponse[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  // Local, client-side filters (no backend calls)
  readonly searchTerm = signal('');
  readonly dateFilter = signal<DateFilter>('any');
  readonly priceFilter = signal<PriceFilter>('any');
  readonly sortBy = signal<SortOption>('upcoming');

  readonly dateOptions: { value: DateFilter; label: string }[] = [
    { value: 'any', label: 'Any Date' },
    { value: 'weekend', label: 'This Weekend' },
    { value: 'month', label: 'Next 30 Days' },
  ];

  readonly priceOptions: { value: PriceFilter; label: string }[] = [
    { value: 'any', label: 'All Prices' },
    { value: 'free', label: 'Free' },
    { value: 'under20', label: 'Under €20' },
    { value: '20-50', label: '€20 - €50' },
    { value: 'vip', label: 'Over €50' },
  ];

  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'price-asc', label: 'Lowest Price' },
    { value: 'price-desc', label: 'Highest Price' },
    { value: 'name', label: 'Name (A-Z)' },
  ];

  constructor(
    private eventService: EventService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.eventService.getEvents().subscribe({
      next: (response) => {
        this.events.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }

  /** Ctrl+K / ⌘K focuses the search box, like in the Stitch design. */
  @HostListener('window:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.searchInput?.nativeElement.focus();
    }
  }

  /** Events after applying the page search box, the date/price filters and the sort. */
  get filteredEvents(): EventResponse[] {
    const term = this.searchTerm().trim().toLowerCase();

    const filtered = this.events().filter(
      (e) =>
        (!term || e.name.toLowerCase().includes(term) || (e.description ?? '').toLowerCase().includes(term)) &&
        this.matchesPrice(e.price) &&
        this.matchesDate(new Date(e.date)),
    );

    return filtered.sort((a, b) => {
      switch (this.sortBy()) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        default: return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });
  }

  get hasActiveFilters(): boolean {
    return this.searchTerm().trim() !== '' || this.priceFilter() !== 'any' || this.dateFilter() !== 'any';
  }

  private matchesPrice(price: number): boolean {
    switch (this.priceFilter()) {
      case 'free': return price === 0;
      case 'under20': return price > 0 && price < 20;
      case '20-50': return price >= 20 && price <= 50;
      case 'vip': return price > 50;
      default: return true;
    }
  }

  private matchesDate(date: Date): boolean {
    const now = new Date();
    switch (this.dateFilter()) {
      case 'weekend': {
        // From now until the end of the coming Sunday
        const sunday = new Date(now);
        sunday.setDate(now.getDate() + ((7 - now.getDay()) % 7));
        sunday.setHours(23, 59, 59, 999);
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() - 1);
        saturday.setHours(0, 0, 0, 0);
        return date >= (now > saturday ? now : saturday) && date <= sunday;
      }
      case 'month': {
        const limit = new Date(now);
        limit.setDate(now.getDate() + 30);
        return date >= now && date <= limit;
      }
      default: return true;
    }
  }

  // Spots left = total capacity - reserved/purchased tickets
  readonly spotsLeft = spotsLeft;
  readonly isSoldOut = isSoldOut;
  readonly isLowStock = isLowStock;

  onSearch(value: string) {
    this.searchTerm.set(value);
  }

  onDateChange(value: string) {
    this.dateFilter.set(value as DateFilter);
  }

  onPriceChange(value: string) {
    this.priceFilter.set(value as PriceFilter);
  }

  onSortChange(value: string) {
    this.sortBy.set(value as SortOption);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.dateFilter.set('any');
    this.priceFilter.set('any');
  }

  /** Hide broken images so the placeholder background behind them shows. */
  onImageError(event: globalThis.Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
