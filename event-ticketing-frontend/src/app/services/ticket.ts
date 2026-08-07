import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';

export interface TicketResponse{
  eventName: string;
  description: string;
  userName: string;
  status: string;
  price: string;
  dateTime: string;
  purchaseAt: string

}



@Injectable({
  providedIn: 'root',
})
export class TicketService 
{constructor(private http: HttpClient){}
  reserve(eventid: number){
    return this.http.post<TicketResponse>(`${environment.apiUrl}/api/tickets/reserve`, { eventId: eventid})
  }
  getTicket(id: number){
    return this.http.get<TicketResponse[]>(`${environment.apiUrl}/api/purchase/${id}`)
  }


}
