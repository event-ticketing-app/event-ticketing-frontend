import { Component, Inject, PLATFORM_ID  } from '@angular/core';
import { Auth } from '../../services/auth';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { isPlatformBrowser } from '@angular/common';
import { SidebarService } from '../../services/sidebar';

@Component({
  selector: 'app-layout',
  imports: [MatSidenavModule, RouterOutlet, Navbar, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout 
{constructor(private authService: Auth, @Inject(PLATFORM_ID) private platformId: Object, private sidebarService: SidebarService){}
getRole(){
  return this.authService.getRole();
}
isSidebarOpen(){
  return this.sidebarService.getIsOpen();
}
}
