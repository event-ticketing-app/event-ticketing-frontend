import { Component, DestroyRef, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild, computed, inject, signal } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { Stripe, StripeElements, StripePaymentElement, loadStripe } from '@stripe/stripe-js';
import { TicketPurchaseResponse, TicketService } from '../../services/ticket';
import { TicketStatus } from '../../services/ticket-status';
import { ConfirmService } from '../../services/confirm';
import { EventImagePipe } from '../../pipes/event-image.pipe';

/** Must match TicketRules.ReservationMinutes in the backend. Only used to draw the progress bar. */
const RESERVATION_MS = 10 * 60 * 1000;

@Component({
  selector: 'app-purchase',
  imports: [DatePipe, RouterLink, MatIconModule, EventImagePipe],
  templateUrl: './purchase.html',
  styleUrl: './purchase.css',
})
export class Purchase implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly ticket = signal<TicketPurchaseResponse | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal('');

  /** Current time, updated every second to drive the countdown. */
  private readonly now = signal(Date.now());
  private timerId: ReturnType<typeof setInterval> | null = null;
  readonly expired = signal(false);

  readonly paymentReady = signal(false);
  readonly paymentSetupError = signal('');
  readonly processing = signal(false);
  readonly paymentError = signal('');

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private paymentElement: StripePaymentElement | null = null;
  private paymentHost: HTMLElement | null = null;

  /** The Stripe form is mounted as soon as both the container and Stripe are ready. */
  @ViewChild('paymentHost') set paymentHostRef(ref: ElementRef<HTMLElement> | undefined) {
    this.paymentHost = ref?.nativeElement ?? null;
    this.mountPaymentElement();
  }

  readonly remainingMs = computed(() => {
    const t = this.ticket();
    if (!t) return 0;
    return Math.max(0, new Date(t.expiresAt).getTime() - this.now());
  });

  readonly countdown = computed(() => {
    const totalSeconds = Math.ceil(this.remainingMs() / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  readonly lastMinute = computed(() => this.remainingMs() <= 60_000);
  readonly remainingPercent = computed(() => Math.min(100, (this.remainingMs() / RESERVATION_MS) * 100));
  readonly isFree = computed(() => (this.ticket()?.price ?? 0) <= 0);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private confirm: ConfirmService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.destroyRef.onDestroy(() => {
      this.stopTimer();
      this.paymentElement?.destroy();
    });
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.ticketService.getTicket(id).subscribe({
      next: (ticket) => {
        if (ticket.status === TicketStatus.Purchased) {
          this.router.navigate(['/tickets', ticket.id], { replaceUrl: true });
          return;
        }
        this.ticket.set(ticket);
        this.loading.set(false);

        if (ticket.status !== TicketStatus.Reserved || new Date(ticket.expiresAt).getTime() <= Date.now()) {
          this.expired.set(true);
          return;
        }

        this.startTimer();
        if (ticket.price > 0) this.setUpPayment(ticket.id);
      },
      error: (err: HttpErrorResponse) => {
        this.loadError.set(err.status === 403 || err.status === 404 ? 'This reservation was not found.' : 'We could not load your reservation.');
        this.loading.set(false);
      },
    });
  }

  // ---------- Timer ----------

  private startTimer() {
    this.timerId = setInterval(() => {
      this.now.set(Date.now());
      if (this.remainingMs() <= 0) this.onExpired();
    }, 1000);
  }

  private stopTimer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private onExpired() {
    // A payment that is already being confirmed is allowed to finish (the backend gives a short grace period)
    if (this.processing()) return;

    this.stopTimer();
    this.expired.set(true);
    this.paymentElement?.destroy();
    this.paymentElement = null;

    // Free the spot right away instead of waiting for the backend job
    const ticket = this.ticket();
    if (ticket) this.ticketService.cancelTicket(ticket.id).subscribe({ error: () => {} });
  }

  // ---------- Stripe ----------

  private setUpPayment(ticketId: number) {
    forkJoin({
      config: this.ticketService.getPaymentConfig(),
      intent: this.ticketService.createPaymentIntent(ticketId),
    }).subscribe({
      next: async ({ config, intent }) => {
        try {
          this.stripe = await loadStripe(config.publishableKey);
          if (!this.stripe) throw new Error('Stripe.js could not be loaded');

          this.elements = this.stripe.elements({
            clientSecret: intent.clientSecret,
            appearance: {
              theme: 'night',
              variables: {
                colorPrimary: '#55d8e1',
                colorBackground: '#010f1f',
                colorText: '#d4e4fa',
                colorTextSecondary: '#c5c6cd',
                colorDanger: '#ffb4ab',
                fontFamily: 'Inter, Roboto, system-ui, sans-serif',
                borderRadius: '8px',
              },
            },
          });
          this.paymentElement = this.elements.create('payment', { layout: 'tabs' });
          this.paymentElement.on('ready', () => this.paymentReady.set(true));
          this.mountPaymentElement();
        } catch {
          this.paymentSetupError.set('The payment form could not be loaded. Check your connection and reload the page.');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.paymentSetupError.set(this.apiMessage(err, 'The payment could not be started. Please reload the page.'));
      },
    });
  }

  private mountPaymentElement() {
    if (this.paymentElement && this.paymentHost && !this.expired()) {
      this.paymentElement.mount(this.paymentHost);
    }
  }

  async pay() {
    const ticket = this.ticket();
    if (!ticket || !this.stripe || !this.elements || this.processing() || this.expired()) return;

    this.processing.set(true);
    this.paymentError.set('');

    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,
      redirect: 'if_required',
      confirmParams: { return_url: window.location.href },
    });

    if (error) {
      this.paymentError.set(error.message ?? 'The payment failed. Please try again.');
      this.processing.set(false);
      if (this.remainingMs() <= 0) this.onExpired();
      return;
    }

    if (paymentIntent?.status !== 'succeeded') {
      this.paymentError.set('The payment was not completed. Please try again.');
      this.processing.set(false);
      return;
    }

    this.completePurchase(ticket.id, paymentIntent.id);
  }

  /** Free tickets skip Stripe. */
  claimFree() {
    const ticket = this.ticket();
    if (!ticket || this.processing() || this.expired()) return;
    this.processing.set(true);
    this.paymentError.set('');
    this.completePurchase(ticket.id);
  }

  private completePurchase(ticketId: number, paymentIntentId?: string) {
    this.ticketService.purchase(ticketId, paymentIntentId).subscribe({
      next: () => {
        this.stopTimer();
        this.router.navigate(['/tickets', ticketId]);
      },
      error: (err: HttpErrorResponse) => {
        this.paymentError.set(this.apiMessage(err, 'We could not confirm your purchase. Please contact support.'));
        this.processing.set(false);
      },
    });
  }

  cancelReservation() {
    const ticket = this.ticket();
    if (!ticket || this.processing()) return;
    this.confirm
      .ask({
        title: 'Cancel reservation',
        message: `Do you want to release your spot for "${ticket.eventName}"?`,
        confirmText: 'Release spot',
        cancelText: 'Keep reservation',
      })
      .subscribe(() => {
        this.stopTimer();
        this.ticketService.cancelTicket(ticket.id).subscribe({
          next: () => this.router.navigate(['/events', ticket.eventId]),
          error: () => this.router.navigate(['/events', ticket.eventId]),
        });
      });
  }

  /** The API sends errors as { message } or as a plain string. */
  private apiMessage(err: HttpErrorResponse, fallback: string): string {
    const message = typeof err.error === 'string' ? err.error : err.error?.message;
    return typeof message === 'string' && message.length < 200 ? message : fallback;
  }
}
