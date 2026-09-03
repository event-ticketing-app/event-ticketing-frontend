import { Component,OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventResponse, EventService } from '../../services/event';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TicketPurchaseResponse, TicketReserveResponse, TicketService } from '../../services/ticket';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';



@Component({
  selector: 'app-event-detail',
  imports: [DatePipe,MatButtonModule],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})


export class EventDetail implements OnInit
{constructor(private activatedRoute: ActivatedRoute, private eventService: EventService,@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef, private ticketService: TicketService, private router: Router, private auth: Auth ){}

  event: EventResponse | null=null;
  ticket: TicketReserveResponse | null=null;
  reservationSuccess = false;
  purchasedTicket: TicketPurchaseResponse | null=null;
  
  
  ngOnInit(){
    if (!isPlatformBrowser(this.platformId)) return;

    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe(response => {
      this.event = response;
      this.cdr.detectChanges();
    })
  }
  reserve(){
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.ticketService.reserve(this.event!.id).subscribe(response =>{
      this.reservationSuccess = true;
      this.ticket = response;
      this.cdr.detectChanges();

    })
  }
    purchase(){
      this.ticketService.purchase(this.ticket!.id).subscribe(response => {
        this.router.navigate(['/tickets', this.ticket!.id]);
        this.cdr.detectChanges();
      })
  }
}
