import { Component,OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { EventService } from '../../services/event';
import {EventResponse} from '../../services/event';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Search } from '../../services/search';
import { EventImagePipe } from '../../pipes/event-image.pipe';
import { spotsLeft } from '../../services/event-spots';
import { getEventStatusClasses, getEventStatusHint, getEventStatusLabel } from '../../services/event-status';

@Component({
  selector: 'app-organizer-events',
  imports: [MatCardModule,MatButtonModule,DatePipe,RouterLink,EventImagePipe],
  templateUrl: './organizer-events.html',
  styleUrl: './organizer-events.css',
})



export class OrganizerEvents  implements OnInit
{
  events: EventResponse[] = [];
  readonly statusLabel = getEventStatusLabel;
  readonly statusClasses = getEventStatusClasses;
  readonly statusHint = getEventStatusHint;
  readonly spotsLeft = spotsLeft;
  constructor(private eventService: EventService,@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef, private searchService: Search){}
  get filteredEvents() {
    return this.events.filter(e =>
      this.searchService.matches(e.name, e.description, this.statusLabel(e.status))
    );
  }
  ngOnInit(){
    if (!isPlatformBrowser(this.platformId)) return;
     this.eventService.getMyEvents().subscribe(response => { 
      this.events = response;
      this.cdr.detectChanges();
    })
  }


}
