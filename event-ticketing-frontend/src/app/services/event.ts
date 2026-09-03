import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';


export interface EventResponse {
  id: number;
  name: string;
  description: string;
  date: Date;
  price: number;
  ticketCapacity: number;
  imageUrl: string;

}
export interface EventCreateRequest {
  name: string;
  description: string;
  date: Date;
  price: number;
  imageUrl: string;
  ticketCapacity: number;

}

@Injectable({
  providedIn: 'root',
})
export class EventService 
{constructor(private http: HttpClient){}
  getEvents(){
    return this.http.get<EventResponse[]>(`${environment.apiUrl}/api/events`);
  }
  getMyEvents(){
    return this.http.get<EventResponse[]>(`${environment.apiUrl}/api/events/my-events`);
  }
  getEventById(id: number){
    return this.http.get<EventResponse>(`${environment.apiUrl}/api/events/${id}`)
  }
  createEvent(event: EventCreateRequest){
    return this.http.post<EventResponse>(`${environment.apiUrl}/api/events`, event)
  }
}
