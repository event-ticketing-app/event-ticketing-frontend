import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventResponse, EventService } from '../../services/event';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-event-detail',
  imports: [DatePipe],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})


export class EventDetail implements OnInit
{constructor(private activatedRoute: ActivatedRoute, private eventService: EventService){}

  event: EventResponse | null=null;
  
  ngOnInit(){
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe(response => {
      this.event = response;
    })
  }
}
