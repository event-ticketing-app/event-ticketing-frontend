import { Component,OnInit } from '@angular/core';
import { EventService } from '../../services/event';
import {EventResponse} from '../../services/event';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-event-list',
  imports: [MatCardModule,DatePipe],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})



export class EventList  implements OnInit
{
  events: EventResponse[] = [];
  constructor(private eventService: EventService){}
  ngOnInit(){
     this.eventService.getEvents().subscribe(response => { this.events = response})
  }


}
