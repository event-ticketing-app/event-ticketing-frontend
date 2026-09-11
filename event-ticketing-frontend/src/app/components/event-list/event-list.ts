import { Component,OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { EventService } from '../../services/event';
import {EventResponse} from '../../services/event';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Search } from '../../services/search';

@Component({
  selector: 'app-event-list',
  imports: [MatCardModule,MatButtonModule,DatePipe,RouterLink],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})



export class EventList  implements OnInit
{
  events: EventResponse[] = [];
  get filteredEvents() {
    return this.events.filter(e => 
      e.name.toLowerCase().includes(this.searchService.getSearchTerm().toLowerCase())
    );
  }
  constructor(private eventService: EventService,@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef, private searchService: Search){}
  ngOnInit(){
    if (!isPlatformBrowser(this.platformId)) return;
     this.eventService.getEvents().subscribe(response => { 
      this.events = response;
      this.cdr.detectChanges();
    })
  }


}
