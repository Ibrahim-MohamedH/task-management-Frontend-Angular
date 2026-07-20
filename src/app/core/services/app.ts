import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { icons } from '../icons/icon';
import { tokenKey } from '../config/constants';
import { JwtPayload } from '../config/general';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly http = inject(HttpClient);

  private readonly sanitizer = inject(DomSanitizer);

  readonly apiUrl = environment.apiUrl;
  private theme = signal<boolean>(false);
  loading = signal(false);

  // ─────────────────────────────
  // Token
  // ─────────────────────────────
  private readonly token = computed(() => localStorage.getItem(tokenKey));
  getToken(){
    return this.token();
  }

  private readonly decodedToken = computed<JwtPayload | null>(() => {
    const token = this.token();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  });

  // ─────────────────────────────
  // User Data
  // ─────────────────────────────

  readonly userId = computed(() => this.decodedToken()?.id ?? '');

  readonly userName = computed(() => this.decodedToken()?.name ?? '');

  readonly userEmail = computed(() => this.decodedToken()?.email ?? '');

  readonly userRole = computed(() => this.decodedToken()?.role ?? '');

  // ─────────────────────────────
  // Icons
  // ─────────────────────────────

  getIcon(name: keyof typeof icons, style?: string): SafeHtml {
    let iconHtml = icons[name];

    if (style) {
      iconHtml = String(iconHtml).replace('<i', `<i style="${style}"`);
    }

    return this.sanitizer.bypassSecurityTrustHtml(iconHtml);
  }

  // ─────────────────────────────
  // Theme
  // ─────────────────────────────
  setTheme(theme: boolean){
    this.theme.set(theme)
  }
  getTheme(){
    return this.theme()
  }
  // ─────────────────────────────
  // Permission
  // ─────────────────────────────
  canAccess(roles: (string|null)[]){
    if(roles.includes(this.userRole())){
      return true;
    }else{
      return false
    }
  }

  initials(name: string) {
    return name
      .split(' ')
      .slice(0, 3)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }
}
