import { Component,OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventResponse, EventService } from '../../services/event';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'app-event-detail',
  imports: [DatePipe,MatButtonModule],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})


export class EventDetail implements OnInit
{constructor(private activatedRoute: ActivatedRoute, private eventService: EventService,@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef){}

  event: EventResponse | null=null;
  
  ngOnInit(){
    if (!isPlatformBrowser(this.platformId)) return;

    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe(response => {
      this.event = response;
      this.cdr.detectChanges();
    })
  }
}
