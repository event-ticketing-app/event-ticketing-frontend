import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  isOpen = false;
  toggle() {
    this.isOpen = !this.isOpen;
    console.log('Sidebar state:', this.isOpen);
  }
  getIsOpen(){
    return this.isOpen;
  }
}
