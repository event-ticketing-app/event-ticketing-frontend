import { Component, Inject, PLATFORM_ID  } from '@angular/core';
import { Auth } from '../../services/auth';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
{constructor(private authService: Auth, @Inject(PLATFORM_ID) private platformId: Object, private sidebarService: SidebarService, router: Router){
  // Close the sidebar after clicking a link, otherwise it stays on top of the new page
  router.events
    .pipe(filter((e) => e instanceof NavigationEnd))
    .subscribe(() => this.sidebarService.close());
}
// Keeps the service in sync when the sidebar is closed by clicking outside or pressing Esc
onSidebarOpenedChange(isOpen: boolean){
  this.sidebarService.setOpen(isOpen);
}
getRole(){
  return this.authService.getRole();
}
isSidebarOpen(){
  return this.sidebarService.getIsOpen();
}
}
