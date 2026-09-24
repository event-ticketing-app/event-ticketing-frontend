import { Component,OnInit, Inject,ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import {isPlatformBrowser } from '@angular/common';
import { AdminService } from '../../services/admin';


@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit{
  totalUsers: number = 0;
  totalEvents: number = 0;
  totalTickets: number = 0;
  totalRevenue: number = 0;
constructor(private adminService: AdminService, @Inject(PLATFORM_ID) private platformId: Object,  private cdr: ChangeDetectorRef){}
  ngOnInit(){
    if (!isPlatformBrowser(this.platformId)) return;
    this.adminService.getDashboard().subscribe((response: any) => {
      this.totalUsers = response.totalUsers;
      this.totalEvents = response.totalEvents;
      this.totalTickets = response.totalTickets;
      this.totalRevenue = response.totalRevenue;
      this.cdr.detectChanges();
    });
  }
}
