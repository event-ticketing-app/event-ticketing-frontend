import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get(`${environment.apiUrl}/api/admin/dashboard`);
  }
  getUsers() {
    return this.http.get(`${environment.apiUrl}/api/admin/users`);
  }

  deleteUser(id: number) {
    return this.http.delete(`${environment.apiUrl}/api/admin/users/${id}`);
  }
}