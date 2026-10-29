import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface AdminEventResponse {
  id: number;
  name: string;
  description: string;
  date: string;
  price: number;
  ticketCapacity: number;
  imageUrl: string;
  organizerName: string;
  organizerEmail: string;
  status: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminEventsService 
{constructor(private http: HttpClient) {}

  getEvents() {
    return this.http.get<AdminEventResponse[]>(`${environment.apiUrl}/api/admin/events`);
  }

  getEvent(id: number) {
    return this.http.get<AdminEventResponse>(`${environment.apiUrl}/api/admin/events/${id}`);
  }

  createEvent(event: any) {
    return this.http.post(`${environment.apiUrl}/api/admin/events`, event);
  }

  updateEvent(id: number, event: any) {
    return this.http.put(`${environment.apiUrl}/api/admin/events/${id}`, event);
  }

  approveEvent(id: number) {
    return this.http.put(`${environment.apiUrl}/api/admin/events/${id}/approve`, {});
  }

  rejectEvent(id: number) {
    return this.http.put(`${environment.apiUrl}/api/admin/events/${id}/reject`, {});
  }

  deleteEvent(id: number) {
    return this.http.delete(`${environment.apiUrl}/api/admin/events/${id}`);
  }

}
