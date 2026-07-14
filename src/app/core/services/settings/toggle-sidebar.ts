import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToggleSidebar {
  readonly isOpen = signal<boolean>(true);

  readonly isMobile = signal<boolean>(false);

  readonly mobileSidebarOpen = signal<boolean>(false);

  setSidebarOpen(value: boolean) {
    this.isOpen.set(value);
  }

  setMobile(value: boolean) {
    this.isMobile.set(value);
  }

  toggleMobileSidebar() {
    this.mobileSidebarOpen.update((value) => !value);
  }

  closeMobileSidebar() {
    this.mobileSidebarOpen.set(false);
  }
}
