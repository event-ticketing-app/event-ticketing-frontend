import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketPurchaseResponse, TicketService } from '../../services/ticket';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EventImagePipe } from '../../pipes/event-image.pipe';
import { TicketStatus } from '../../services/ticket-status';

/** Space between barcode bars, in SVG units. */
const BAR_GAP = 2;

@Component({
  selector: 'app-ticket-detail',
  imports: [DatePipe, MatIconModule, EventImagePipe],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css',
})
export class TicketDetail implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private ticketService: TicketService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
  ) {}

  readonly TicketStatus = TicketStatus;

  ticket: TicketPurchaseResponse | null = null;
  barcode: number[] = Array.from({ length: 30 }, () => (Math.random() > 0.5 ? 3 : 1));

  /** Each bar with its x position, so the barcode can be drawn as SVG rects. */
  readonly barcodeBars = this.barcode.reduce<{ x: number; width: number }[]>((bars, width) => {
    const last = bars[bars.length - 1];
    const x = last ? last.x + last.width + BAR_GAP : 0;
    return [...bars, { x, width }];
  }, []);

  readonly barcodeWidth = this.barcode.reduce((sum, w) => sum + w, 0) + BAR_GAP * (this.barcode.length - 1);

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.ticketService.getTicket(id).subscribe(response => {
      this.ticket = response;
      this.cdr.detectChanges();
    });
  }

  /** Ticket id as a 12-digit code shown under the barcode. */
  barcodeNumber(id: number): string {
    return id.toString().padStart(12, '0');
  }
}
