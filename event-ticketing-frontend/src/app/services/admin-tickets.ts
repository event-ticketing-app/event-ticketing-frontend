import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface AdminTicketResponse {
  id: number;
  eventName: string;
  eventDescription: string;
  userName: string;
  status: number;
  price: number;
  eventDate: string;
  purchaseDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminTicketsService
{constructor(private http: HttpClient) {}

  getTickets() {
    return this.http.get<AdminTicketResponse[]>(`${environment.apiUrl}/api/admin/tickets`);
  }

  getTicket(id: number) {
    return this.http.get<AdminTicketResponse>(`${environment.apiUrl}/api/admin/tickets/${id}`);
  }

  cancelTicket(id: number) {
    return this.http.put(`${environment.apiUrl}/api/admin/tickets/${id}/cancel`, {});
  }

  deleteTicket(id: number) {
    return this.http.delete(`${environment.apiUrl}/api/admin/tickets/${id}`);
  }

}
