import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar';

@Component({
  selector: 'app-navbar',
  imports: [MatButtonModule, RouterLink, MatMenuModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private auth: Auth, private sidebarService: SidebarService) {}

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  getRole(): string | null {
    return this.auth.getRole();
  }

  logout(): void {
    this.auth.logout();
  }
  toggleSidebar(){
  this.sidebarService.toggle();
  }
}