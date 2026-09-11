import { Component,OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { TicketService } from '../../services/ticket';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TicketPurchaseResponse } from '../../services/ticket';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-my-tickets',
  imports: [MatCardModule, MatButtonModule, DatePipe, RouterLink, FormsModule, MatSelectModule],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css'
})





export class MyTickets implements OnInit
{
  tickets: TicketPurchaseResponse[] = [];
  constructor(private ticketService: TicketService,@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef){}
  selectedStatus: number | null = null;

  get filteredTickets() {
    if (this.selectedStatus === null) return this.tickets;
    return this.tickets.filter(t => t.status === this.selectedStatus);
  }
  ngOnInit(){
    if (!isPlatformBrowser(this.platformId)) return;
     this.ticketService.getMyTickets().subscribe(response => { 
      this.tickets = response;
      this.cdr.detectChanges();
    })
  }
  cancel(id: number){
    if (!isPlatformBrowser(this.platformId)) return;
    this.ticketService.cancelTicket(id).subscribe(() => {
      this.ticketService.getMyTickets().subscribe(response => {
        this.tickets = response;
        this.cdr.detectChanges();
      });
    });
  }
  getStatusLabel(status: number): string {
    switch(status) {
      case 0: return 'Reserved';
      case 1: return 'Cancelled';
      case 2: return 'Purchased';
      default: return 'Unknown';
    }
  }
}
