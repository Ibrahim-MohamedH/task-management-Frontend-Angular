import { Component, inject, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { langKey, themeKey } from '../../../../core/config/constants';
import { AppService } from '../../../../core/services/app';
import { ToggleSidebar } from '../../../../core/services/settings/toggle-sidebar';
import { TfBreadcrumb } from "../../../../shared/components/tf-breadcrumb/tf-breadcrumb";

@Component({
  selector: 'app-navbar',
  imports: [TfBreadcrumb],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  readonly toggleSidebarService = inject(ToggleSidebar);
  readonly translate = inject(TranslateService);
  private renderer = inject(Renderer2);
  readonly appService = inject(AppService);

  isDark = false;
  currentLang = 'AR';

  toggleSidebarMobile(): void {
    this.toggleSidebarService.setMobile(!this.toggleSidebarService.isMobile());
  }

  ngOnInit() {
    this.detectLanguage();
    this.getThemeMode();
  }

  detectLanguage() {
    const storedLang = localStorage.getItem(langKey);
    const defaultLang = 'ar';
    const initialLang = storedLang === 'ar' || storedLang === 'en' ? storedLang : defaultLang;
    this.setLanguage(initialLang);
  }
  getThemeMode() {
    const theme = localStorage.getItem(themeKey);
    this.isDark = theme ? JSON.parse(theme) : false;
    this.appService.setTheme(theme ? JSON.parse(theme) : false)
    document.documentElement.classList.toggle('dark', this.isDark);
  }
  toggleDarkMode() {
    this.isDark = !this.isDark;
    this.appService.setTheme(this.isDark)
    document.documentElement.classList.toggle('dark', this.isDark);
    localStorage.setItem(themeKey, `${this.isDark}`);
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem(langKey, lang);
    this.renderer.setAttribute(document.documentElement, 'lang', lang);
    this.renderer.setAttribute(document.documentElement, 'dir', lang === 'ar' ? 'rtl' : 'ltr');

    this.currentLang = lang == 'ar' ? 'AR' : 'EN';
  }

  toggleLanguage(): void {
    const newLang = this.currentLang === 'EN' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }
}
