import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar';


@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {constructor(private auth: Auth, private sidebarService : SidebarService) {}
  logout(){
    this.auth.logout();
  }
  toggleSidebar(){
    this.sidebarService.toggle()
  }
}
