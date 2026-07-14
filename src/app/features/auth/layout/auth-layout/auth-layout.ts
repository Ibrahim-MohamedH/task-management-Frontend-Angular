import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { langKey, themeKey } from '../../../../core/config/constants';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {

constructor(
    public translate: TranslateService,
    private renderer: Renderer2,
    // public appService: AppService
  ) {}
  isDark = false;
  currentLang = 'AR';

  ngOnInit() {
    this.detectLanguage();
    this.getThemeMode();
  }

  detectLanguage() {
    const storedLang = localStorage.getItem(langKey);
    const defaultLang = 'ar';
    const initialLang =
      storedLang === 'ar' || storedLang === 'en' ? storedLang : defaultLang;
    this.setLanguage(initialLang);
  }
  getThemeMode(){
    const theme = localStorage.getItem(themeKey)
    this.isDark = theme ? JSON.parse(theme) : false;
      document.documentElement.classList.toggle('dark', this.isDark);
  }
  toggleDarkMode() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
    localStorage.setItem(themeKey, `${this.isDark}`);
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem(langKey, lang);
    this.renderer.setAttribute(document.documentElement, 'lang', lang);
    this.renderer.setAttribute(
      document.documentElement,
      'dir',
      lang === 'ar' ? 'rtl' : 'ltr'
    );

    this.currentLang = lang == 'ar' ? 'AR' : 'EN';
  }

  toggleLanguage(): void {
    const newLang = this.currentLang === 'EN' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }
}
