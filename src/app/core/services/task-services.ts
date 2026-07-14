import { inject, Injectable } from '@angular/core';
import { BaseService } from './settings/baseService';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiUrlsConfig } from '../config/ApiUrlsConfig';

@Injectable({
  providedIn: 'root',
})
export class TaskServices extends BaseService {
  private http = inject(HttpClient);

  getById(id: any) {
    return this.http.get(`${environment.apiUrl}${ApiUrlsConfig.tasks}/${id}`);
  }

  post(obj: any) {
    return this.http.post(`${environment.apiUrl}${ApiUrlsConfig.tasks}`, obj);
  }

  patch(id: any, obj: any) {
    return this.http.patch(`${environment.apiUrl}${ApiUrlsConfig.tasks}/${id}`, obj);
  }
  delete(id: any) {
    return this.http.delete(`${environment.apiUrl}${ApiUrlsConfig.tasks}/${id}`);
  }
  changeStatus(id: any, obj: any) {
    return this.http.patch(`${environment.apiUrl}${ApiUrlsConfig.tasks}/${id}/status`, obj);
  }
  changePriority(id: any, obj: any) {
    return this.http.patch(`${environment.apiUrl}${ApiUrlsConfig.tasks}/${id}/priority`, obj);
  }
}
