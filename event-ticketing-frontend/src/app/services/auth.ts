import {  Inject, PLATFORM_ID} from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';



interface AuthResponse{
  token: string;
}


@Injectable({
  providedIn: 'root',
})
export class Auth 
  {constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object,private router: Router) {}
    login(email: string, password: string){
      return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, { email, password});
    }
    register(name: string, email: string, password: string){
      return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/register`, {name, email, password });
    }
  
  isLoggedIn(): boolean{
    if (!isPlatformBrowser(this.platformId)) return false;
      const token = localStorage.getItem('token');
      return token !== null;
    }

  getRole(): string | null{
    if (!isPlatformBrowser(this.platformId)) return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }
  logout(): void{
    localStorage.removeItem('token');
    this.router.navigate(['/events']);
  }
}
