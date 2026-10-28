import { Component,OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { TicketService } from '../../services/ticket';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TicketPurchaseResponse } from '../../services/ticket';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmService } from '../../services/confirm';
import { TICKET_STATUS_OPTIONS, canCancelTicket, getTicketStatusClasses, getTicketStatusLabel } from '../../services/ticket-status';

@Component({
  selector: 'app-my-tickets',
  imports: [MatCardModule, MatButtonModule, DatePipe, RouterLink, FormsModule, MatSelectModule],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css'
})





export class MyTickets implements OnInit
{
  tickets: TicketPurchaseResponse[] = [];
  constructor(private ticketService: TicketService,@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef, private confirm: ConfirmService){}
  selectedStatus: number | null = null;
  readonly statusOptions = TICKET_STATUS_OPTIONS;
  readonly statusClasses = getTicketStatusClasses;
  readonly canCancel = canCancelTicket;

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
  cancel(id: number, eventName: string){
    if (!isPlatformBrowser(this.platformId)) return;
    this.confirm.ask({
      title: 'Cancel ticket',
      message: `Are you sure you want to cancel your ticket for "${eventName}"?`,
      confirmText: 'Cancel ticket',
      cancelText: 'Keep ticket',
    }).subscribe(() => {
      this.ticketService.cancelTicket(id).subscribe(() => {
        this.ticketService.getMyTickets().subscribe(response => {
          this.tickets = response;
          this.cdr.detectChanges();
        });
      });
    });
  }
  getStatusLabel(status: number): string {
    return getTicketStatusLabel(status);
  }
}
