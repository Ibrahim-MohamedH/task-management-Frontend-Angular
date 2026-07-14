import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILogin, IMe, IRegister } from '../interfaces/auth';
import { environment } from '../../../environments/environment';
import { ApiUrlsConfig } from '../config/ApiUrlsConfig';
import { tokenKey } from '../config/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(object: ILogin) {
    return this.http.post<ILogin>(`${environment.apiUrl}${ApiUrlsConfig.login}`, object);
  }
  register(object: IRegister) {
    return this.http.post<IRegister>(`${environment.apiUrl}${ApiUrlsConfig.register}`, object);
  }

  me() {
    return this.http.get<IMe>(`${environment.apiUrl}${ApiUrlsConfig.me}`);
  }
  refresh() {
    return this.http.post<any>(`${environment.apiUrl}${ApiUrlsConfig.refresh}`, {});
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(tokenKey);
    return !!token && isTokenValid(token);
  }
}

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return expiry && expiry > now;
  } catch (e) {
    return false;
  }
}
