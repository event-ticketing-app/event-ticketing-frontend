import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

export interface EventResponse {
  id: number;
  name: string;
  description: string;
  date: Date;
  price: number;
  ticketCapacity: number;

}

@Injectable({
  providedIn: 'root',
})
export class EventService 
{constructor(private http: HttpClient){}
  getEvents(){
    return this.http.get<EventResponse[]>('http://localhost:5140/api/events');
  }
}
