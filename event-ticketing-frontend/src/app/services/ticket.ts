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
  eventId: number;
  status: number;
  price: number;
  expiresAt: string;

}
export interface TicketPurchaseResponse{
  id: number;
  eventName: string;
  eventDescription: string;
  username: string;
  status: number;
  price: number;
  eventId: number;
  eventDate: Date;
  /** Null until the ticket is purchased. */
  purchaseAt: string | null;
  /** When the reservation stops holding the spot (ISO date in UTC). */
  expiresAt: string;
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
  /** Starts the Stripe payment for a reserved ticket. */
  createPaymentIntent(ticketid: number){
    return this.http.post<{ clientSecret: string }>(`${environment.apiUrl}/api/tickets/${ticketid}/payment-intent`, {})
  }
  /** Confirms the purchase. Paid tickets need the id of the Stripe payment that succeeded. */
  purchase(ticketid: number, paymentIntentId?: string){
    return this.http.post<TicketPurchaseResponse>(`${environment.apiUrl}/api/tickets/purchase/${ticketid}`, { paymentIntentId: paymentIntentId ?? null })
  }
  getPaymentConfig(){
    return this.http.get<{ publishableKey: string }>(`${environment.apiUrl}/api/payments/config`)
  }
  getMyTickets(){
    return this.http.get<TicketPurchaseResponse[]>(`${environment.apiUrl}/api/tickets/my-tickets`)
  }
  cancelTicket(ticketid: number){
    return this.http.post(`${environment.apiUrl}/api/tickets/cancel/${ticketid}`, {})
  }
}
