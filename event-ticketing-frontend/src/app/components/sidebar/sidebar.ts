import { Component, Input } from '@angular/core';
import { Auth } from '../../services/auth';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, NgClass],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() role: string = 'Organizer';

  constructor(private auth: Auth, private sidebarService: SidebarService) {}

  logout(){
    this.auth.logout();
  }

  toggleSidebar(){
    this.sidebarService.toggle();
  }
}