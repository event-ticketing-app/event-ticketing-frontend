import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { AdminEventsService, AdminEventResponse } from '../../services/admin-events';
import { Search } from '../../services/search';
import { isPlatformBrowser} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EventForm } from '../event-form/event-form';

@Component({
  selector: 'app-admin-events',
  imports: [MatButtonModule],
  templateUrl: './admin-events.html',
  styleUrl: './admin-events.css',
})
export class AdminEvents implements OnInit {
  events: AdminEventResponse[] = [];

  get filteredEvents() {
    return this.events.filter(e =>
      e.name.toLowerCase().includes(this.searchService.getSearchTerm().toLowerCase())
    );
  }

  constructor(
    private adminService: AdminEventsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private searchService: Search,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadEvents();
  }

  loadEvents() {
    this.adminService.getEvents().subscribe(response => {
      this.events = response;
      this.cdr.detectChanges();
    });
  }

  openCreateEvent() {
    const dialogRef = this.dialog.open(EventForm, { width: '500px' });
    dialogRef.componentInstance.event = null;

    dialogRef.componentInstance.formSubmit.subscribe((eventData: any) => {
      this.adminService.createEvent(eventData).subscribe(() => {
        dialogRef.close();
        this.loadEvents();
      });
    });
  }

  openEditEvent(event: AdminEventResponse) {
    const dialogRef = this.dialog.open(EventForm, { width: '500px' });

    dialogRef.componentInstance.event = event;
    dialogRef.componentInstance.ngOnInit();

    dialogRef.componentInstance.formSubmit.subscribe((eventData: any) => {
      this.adminService.updateEvent(event.id, eventData).subscribe(() => {
        dialogRef.close();
        this.loadEvents();
      });
    });
  }

  deleteEvent(id: number) {
    this.adminService.deleteEvent(id).subscribe(() => {
      this.loadEvents();
    });
  }
}
