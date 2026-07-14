import { inject, Injectable } from '@angular/core';
import { BaseService } from './settings/baseService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiUrlsConfig } from '../config/ApiUrlsConfig';

@Injectable({
  providedIn: 'root',
})
export class UserServices extends BaseService {
  private http = inject(HttpClient);

  get(paramsObj?: any): Observable<any> {
    const params = this.prepareHttpParams(paramsObj);
    return this.http.get<any>(`${environment.apiUrl}${ApiUrlsConfig.users}`, { params });
  }

  getById(id: any) {
    return this.http.get(`${environment.apiUrl}${ApiUrlsConfig.users}/${id}`);
  }

  patch(id: any, data: any) {
    return this.http.patch(`${environment.apiUrl}${ApiUrlsConfig.users}/${id}`, data);
  }
}
