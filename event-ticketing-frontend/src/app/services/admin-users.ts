import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface AdminUserResponse {
  id: number;
  name: string;
  email: string;
  role: string | number;
}

@Injectable({
  providedIn: 'root'
})

export class AdminUsersService 
{constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<AdminUserResponse[]>(`${environment.apiUrl}/api/admin/users`);
  }

  createUser(user: any) {
    return this.http.post(`${environment.apiUrl}/api/admin/users`, user);
  }

  updateUser(id: number, user: any) {
    return this.http.put(`${environment.apiUrl}/api/admin/users/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${environment.apiUrl}/api/admin/users/${id}`);
  }
  getOrganizers(){
    return this.http.get<AdminUserResponse[]>(`${environment.apiUrl}/api/admin/users/organizers`);
  }
}

