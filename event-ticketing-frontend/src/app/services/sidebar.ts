import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly open = signal(false);

  toggle() {
    this.open.update((isOpen) => !isOpen);
  }

  setOpen(isOpen: boolean) {
    this.open.set(isOpen);
  }

  close() {
    this.open.set(false);
  }

  getIsOpen() {
    return this.open();
  }
}
