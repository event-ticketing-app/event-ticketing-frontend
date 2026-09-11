import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LoginModal } from '../login-modal/login-modal';
import {Search} from '../../services/search';




@Component({
  selector: 'app-navbar',
  imports: [FormsModule, MatButtonModule, RouterLink, MatMenuModule, MatIconModule, MatDialogModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private auth: Auth, private sidebarService: SidebarService, private dialog: MatDialog, private searchService: Search) {}

  searchTerm: string = ''
  showSearch: boolean = false;

  toggleSearch(){
    this.showSearch = !this.showSearch;
  }
  onSearch(term: string){
    this.searchService.setSearchTerm(term);
  }
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
  openLogin(){
    const ref = this.dialog.open(LoginModal, { width: '500px' });
    ref.componentInstance.isOrganizer = false;
  }

  openOrganizerLogin(){
    const ref = this.dialog.open(LoginModal, { width: '500px' });
    ref.componentInstance.isOrganizer = true;
  }
}