import { Component, OnInit, Inject, PLATFORM_ID,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketPurchaseResponse, TicketReserveResponse, TicketService } from '../../services/ticket';
import { DatePipe, isPlatformBrowser } from '@angular/common';



@Component({
  selector: 'app-ticket-detail',
  imports: [DatePipe],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css',
})
export class TicketDetail implements OnInit
{constructor(private activatedRoute: ActivatedRoute, private ticketService: TicketService, @Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef){}
  ticket: TicketPurchaseResponse | null = null
  
  ngOnInit(){
    if (!isPlatformBrowser(this.platformId)) return;

    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.ticketService.getTicket(id).subscribe(response => {
      this.ticket = response;
      this.cdr.detectChanges();
    })
  }
}
