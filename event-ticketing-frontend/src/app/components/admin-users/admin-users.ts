import { Component,OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { AdminUsersService, AdminUserResponse } from '../../services/admin-users';
import { Search } from '../../services/search';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-admin-users',
  imports: [NgClass, MatButtonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit
{
  users: AdminUserResponse[] = [];
    get filteredUsers() {
      return this.users.filter(e => 
        e.name.toLowerCase().includes(this.searchService.getSearchTerm().toLowerCase())
      );
    }
    constructor(
      private adminService: AdminUsersService,
      @Inject(PLATFORM_ID) private platformId: Object,
      private cdr: ChangeDetectorRef,
      private searchService: Search,
      private dialog: MatDialog,
    ){}

    ngOnInit(){
      if (!isPlatformBrowser(this.platformId)) return;
      this.loadUsers();
    }

    loadUsers() {
      this.adminService.getUsers().subscribe(response => {
        this.users = response;
        this.cdr.detectChanges();
      });
    }

    openCreateUser() {
      const dialogRef = this.dialog.open(UserForm, { width: '500px' });
      dialogRef.componentInstance.user = null;

      dialogRef.componentInstance.formSubmit.subscribe((userData: any) => {
        this.adminService.createUser(userData).subscribe(() => {
          dialogRef.close();
          this.loadUsers();
        });
      });
    }

    openEditUser(user: AdminUserResponse) {
      const dialogRef = this.dialog.open(UserForm, { width: '500px' });

      
      dialogRef.componentInstance.user = user;
      dialogRef.componentInstance.ngOnInit();

      dialogRef.componentInstance.formSubmit.subscribe((userData: any) => {
        this.adminService.updateUser(user.id, userData).subscribe(() => {
          dialogRef.close();
          this.loadUsers();
        });
      });
    }

    deleteUser(id: number) {
      this.adminService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
}
