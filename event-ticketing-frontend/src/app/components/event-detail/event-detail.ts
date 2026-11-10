import { Component, OnInit, Inject, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EventResponse, EventService } from '../../services/event';
import { TicketReserveResponse, TicketService } from '../../services/ticket';
import { AdminEventsService } from '../../services/admin-events';
import { Auth } from '../../services/auth';
import { isLowStock, isSoldOut, soldPercent, spotsLeft } from '../../services/event-spots';
import { EventForm } from '../event-form/event-form';
import { EventImagePipe } from '../../pipes/event-image.pipe';

@Component({
  selector: 'app-event-detail',
  imports: [DatePipe, RouterLink, MatIconModule, EventImagePipe],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetail implements OnInit {
  readonly event = signal<EventResponse | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  readonly ticket = signal<TicketReserveResponse | null>(null);
  readonly busy = signal(false);
  readonly actionError = signal('');

  /** Embedded Google Maps for the event's location (built once per load so the iframe doesn't reload). */
  readonly mapEmbedUrl = signal<SafeResourceUrl | null>(null);
  readonly shareMessage = signal('');
  /** Set when the image URL fails to load, so the placeholder is shown instead. */
  readonly imageFailed = signal(false);

  readonly spotsLeft = spotsLeft;
  readonly soldPercent = soldPercent;
  readonly isSoldOut = isSoldOut;
  readonly isLowStock = isLowStock;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ticketService: TicketService,
    private adminEventsService: AdminEventsService,
    private router: Router,
    private auth: Auth,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadEvent();
  }

  private loadEvent() {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe({
      next: (response) => {
        this.event.set(response);
        this.mapEmbedUrl.set(
          response.location
            ? this.sanitizer.bypassSecurityTrustResourceUrl(
                `https://www.google.com/maps?q=${encodeURIComponent(response.location)}&output=embed`,
              )
            : null,
        );
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }

  mapsLink(location: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  }

  // ---------- Role logic ----------

  getRole(): string | null {
    return this.auth.getRole();
  }

  /** Guests also see the reserve button; clicking it sends them to the login. */
  canReserve(): boolean {
    const role = this.getRole();
    return role === null || role === 'User';
  }

  isOwner(event: EventResponse): boolean {
    return this.getRole() === 'Organizer' && event.organizerId === this.auth.getUserId();
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  showImage(event: EventResponse): boolean {
    return !!event.imageUrl && !this.imageFailed();
  }

  onImageError() {
    this.imageFailed.set(true);
  }

  // ---------- Actions ----------

  /** Native share sheet on phones; copies the link elsewhere. */
  async share() {
    const event = this.event();
    if (!event) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      this.flashShareMessage('Link copied!');
    } catch (err) {
      // The user closing the share sheet is not an error
      if ((err as DOMException)?.name !== 'AbortError') this.flashShareMessage('Could not copy the link');
    }
  }

  private flashShareMessage(message: string) {
    this.shareMessage.set(message);
    setTimeout(() => this.shareMessage.set(''), 2000);
  }

  reserve() {
    const event = this.event();
    if (!event) return;
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.busy.set(true);
    this.actionError.set('');
    this.ticketService.reserve(event.id).subscribe({
      next: (response) => {
        this.ticket.set(response);
        this.busy.set(false);
        // A reservation takes a spot, so refresh the counter
        this.event.update((e) => (e ? { ...e, ticketsSold: (e.ticketsSold ?? 0) + 1 } : e));
      },
      error: (err: HttpErrorResponse) => this.fail(err, 'We could not reserve your ticket. Please try again.'),
    });
  }

  purchase() {
    const ticket = this.ticket();
    if (!ticket) return;
    this.busy.set(true);
    this.actionError.set('');
    this.ticketService.purchase(ticket.id).subscribe({
      next: () => this.router.navigate(['/tickets', ticket.id]),
      error: (err: HttpErrorResponse) => this.fail(err, 'We could not complete the purchase. Your reservation may have expired.'),
    });
  }

  /** Organizer edits their own event on the existing edit page. */
  editAsOrganizer() {
    const event = this.event();
    if (event) this.router.navigate(['/edit-event', event.id]);
  }

  /** Admin edits with the same dialog used in Admin › Events (keeps the event's approval status). */
  editAsAdmin() {
    const event = this.event();
    if (!event) return;
    this.adminEventsService.getEvent(event.id).subscribe((adminEvent) => {
      const dialogRef = this.dialog.open(EventForm, { width: '500px' });
      dialogRef.componentInstance.event = adminEvent;
      dialogRef.componentInstance.ngOnInit();
      dialogRef.componentInstance.formSubmit.subscribe((eventData: any) => {
        this.adminEventsService.updateEvent(event.id, eventData).subscribe(() => {
          dialogRef.close();
          this.loadEvent();
        });
      });
    });
  }

  private fail(err: HttpErrorResponse, fallback: string) {
    const message = typeof err.error === 'string' && err.error.length < 200 ? err.error : fallback;
    this.actionError.set(message);
    this.busy.set(false);
  }
}
