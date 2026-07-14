import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { AppService } from '../../../../core/services/app';
import { sidebarItems } from '../../../../core/config/sidebarItems';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToggleSidebar } from '../../../../core/services/settings/toggle-sidebar';
import { fromEvent, map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  imports: [TranslatePipe, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly appService = inject(AppService);
  public translate = inject(TranslateService);

  readonly toggleSidebarService = inject(ToggleSidebar);

  private readonly destroyRef = inject(DestroyRef);

  // =========================
  // State
  // =========================

  public sidebarItems = signal<any>(sidebarItems);

  // =========================
  // Constructor
  // =========================

  constructor() {
    this.handleScreenResize();
  }

  // =========================
  // Sidebar Toggle
  // =========================

  toggleSidebar(): void {
    this.toggleSidebarService.setSidebarOpen(!this.toggleSidebarService.isOpen());
  }
  toggleSidebarMobile(): void {
    this.toggleSidebarService.setMobile(!this.toggleSidebarService.isMobile());
  }

  // =========================
  // Resize Handling
  // =========================

  private handleScreenResize(): void {
    fromEvent(window, 'resize')
      .pipe(
        startWith(null),
        map(() => window.innerWidth < 768),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((isMobile) => {
        this.toggleSidebarService.setMobile(isMobile);

        if (isMobile) {
          // أول ما ندخل موبايل
          this.toggleSidebarService.closeMobileSidebar();
        } else {
          // رجعنا Desktop
          this.toggleSidebarService.setSidebarOpen(true);
        }
      });
  }

  // =========================
  // Helper
  // =========================

 readonly sidebarChevron = computed(() => {
  const isOpen = this.toggleSidebarService.isOpen();
  const isEnglish = this.translate.getCurrentLang() === 'en';

  if (isEnglish) {
    return isOpen ? 'chevronleft' : 'chevronRight';
  }

  return isOpen ? 'chevronRight' : 'chevronleft';
});
}
