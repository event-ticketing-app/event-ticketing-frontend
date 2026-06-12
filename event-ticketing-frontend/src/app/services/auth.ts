import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

interface LoginResponse{
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth 
  {constructor(private http: HttpClient) {}
    login(email: string, password: string){
      return this.http.post<LoginResponse>('http://localhost:5140/api/auth/login', { email, password});
    }
  
}
