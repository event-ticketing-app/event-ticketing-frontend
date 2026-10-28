import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AdminTicketsService, AdminTicketResponse } from '../../services/admin-tickets';
import { Search } from '../../services/search';
import { ConfirmService } from '../../services/confirm';

@Component({
  selector: 'app-admin-tickets',
  imports: [MatButtonModule],
  templateUrl: './admin-tickets.html',
  styleUrl: './admin-tickets.css',
})
export class AdminTickets implements OnInit {
  tickets: AdminTicketResponse[] = [];

  get filteredTickets() {
    return this.tickets.filter(t =>
      t.eventName.toLowerCase().includes(this.searchService.getSearchTerm().toLowerCase()) ||
      t.userName.toLowerCase().includes(this.searchService.getSearchTerm().toLowerCase())
    );
  }

  constructor(
    private adminTicketsService: AdminTicketsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private searchService: Search,
    private confirm: ConfirmService,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadTickets();
  }

  loadTickets() {
    this.adminTicketsService.getTickets().subscribe(response => {
      this.tickets = response;
      this.cdr.detectChanges();
    });
  }

  cancelTicket(id: number, eventName: string) {
    this.confirm.ask({
      title: 'Cancel ticket',
      message: `Are you sure you want to cancel this ticket for "${eventName}"?`,
      confirmText: 'Cancel ticket',
      cancelText: 'Keep ticket',
    }).subscribe(() => {
      this.adminTicketsService.cancelTicket(id).subscribe(() => {
        this.loadTickets();
      });
    });
  }

  deleteTicket(id: number, eventName: string) {
    this.confirm.ask({
      title: 'Delete ticket',
      message: `Are you sure you want to delete this ticket for "${eventName}"? This action cannot be undone.`,
    }).subscribe(() => {
      this.adminTicketsService.deleteTicket(id).subscribe(() => {
        this.loadTickets();
      });
    });
  }
}
