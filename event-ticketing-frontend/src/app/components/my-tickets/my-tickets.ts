import { Component,OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { TicketService } from '../../services/ticket';
import {TicketResponse} from '../../services/ticket';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TicketPurchaseResponse } from '../../services/ticket';

@Component({
  selector: 'app-my-tickets',
  imports: [MatCardModule,MatButtonModule,DatePipe,RouterLink],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css'
})





export class MyTickets implements OnInit
{
  tickets: TicketPurchaseResponse[] = [];
  constructor(private ticketService: TicketService,@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef){}
  ngOnInit(){
    if (!isPlatformBrowser(this.platformId)) return;
     this.ticketService.getMyTickets().subscribe(response => { 
      this.tickets = response;
      this.cdr.detectChanges();
    })
  }
}
