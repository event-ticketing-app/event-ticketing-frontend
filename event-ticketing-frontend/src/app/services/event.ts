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

@Injectable({
  providedIn: 'root',
})
export class EventService 
{constructor(private http: HttpClient){}
  getEvents(){
    return this.http.get<EventResponse[]>(`${environment.apiUrl}/api/events`);
  }
  getEventById(id: number){
    return this.http.get<EventResponse>(`${environment.apiUrl}/api/events/${id}`)
  }
}
