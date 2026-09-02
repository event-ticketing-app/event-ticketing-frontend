import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private auth: Auth) {}

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  getRole(): string | null {
    return this.auth.getRole();
  }

  logout(): void {
    this.auth.logout();
  }
}