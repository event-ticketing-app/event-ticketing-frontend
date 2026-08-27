import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';




@Component({
  selector: 'app-navbar',
  imports: [MatButtonModule,RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar 
{constructor(private router: Router){}

  isLoggedIn(): boolean{
    const token = localStorage.getItem('token');
    return token !== null;
    }

  getRole(): string | null{
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



