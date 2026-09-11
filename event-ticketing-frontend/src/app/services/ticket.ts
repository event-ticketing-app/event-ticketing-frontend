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

export interface TicketReserveResponse{
  id: number;
  status: number;
  price: number;
  expiresAt: Date;

}
export interface TicketPurchaseResponse{
  id: number;
  eventName: string;
  eventDescription: string;
  username: string;
  status: number;
  price: number;
  eventDate: Date;
  purchaseAt: Date;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class TicketService 
{constructor(private http: HttpClient){}
  reserve(eventid: number){
    return this.http.post<TicketReserveResponse>(`${environment.apiUrl}/api/tickets/reserve`, { eventId: eventid})
  }
  getTicket(id: number){
    return this.http.get<TicketPurchaseResponse>(`${environment.apiUrl}/api/tickets/${id}`)
  }
  purchase(ticketid: number){
    return this.http.post<TicketPurchaseResponse>(`${environment.apiUrl}/api/tickets/purchase/${ticketid}`, {})  
  }
  getMyTickets(){
    return this.http.get<TicketPurchaseResponse[]>(`${environment.apiUrl}/api/tickets/my-tickets`)
  }
  cancelTicket(ticketid: number){
    return this.http.post(`${environment.apiUrl}/api/tickets/cancel/${ticketid}`, {})
  }
}
