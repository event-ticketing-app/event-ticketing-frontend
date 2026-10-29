import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { AdminEventsService } from '../../services/admin-events';
import { AdminUsersService } from '../../services/admin-users';
import { AdminEventDetails } from '../admin-event-details/admin-event-details';
import { AdminUserDetails } from '../admin-user-details/admin-user-details';
import { DisplayDatePipe } from '../../pipes/display-date.pipe';
import { AdminTicketsService, AdminTicketResponse } from '../../services/admin-tickets';
import { Search } from '../../services/search';
import { ConfirmService } from '../../services/confirm';
import { canCancelTicket, getTicketStatusClasses, getTicketStatusLabel } from '../../services/ticket-status';

@Component({
  selector: 'app-admin-tickets',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule, DisplayDatePipe],
  templateUrl: './admin-tickets.html',
  styleUrl: './admin-tickets.css',
})
export class AdminTickets implements OnInit {
  tickets: AdminTicketResponse[] = [];

  readonly statusLabel = getTicketStatusLabel;
  readonly statusClasses = getTicketStatusClasses;
  readonly canCancel = canCancelTicket;

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
    private dialog: MatDialog,
    private adminEventsService: AdminEventsService,
    private adminUsersService: AdminUsersService,
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

  viewEventDetails(eventId: number) {
    if (!eventId) return;
    this.adminEventsService.getEvent(eventId).subscribe(event => {
      this.dialog.open(AdminEventDetails, { width: '560px', data: event });
    });
  }

  viewUserDetails(userId: number) {
    if (!userId) return;
    this.adminUsersService.getUser(userId).subscribe(user => {
      this.dialog.open(AdminUserDetails, { width: '500px', data: user });
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
