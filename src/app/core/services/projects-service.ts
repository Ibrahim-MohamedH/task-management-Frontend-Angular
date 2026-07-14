import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from './settings/baseService';
import { environment } from '../../../environments/environment';
import { ApiUrlsConfig } from '../config/ApiUrlsConfig';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService extends BaseService {
  private http = inject(HttpClient);

  get(paramsObj?: any) {
    const params = this.prepareHttpParams(paramsObj);
    return this.http.get(`${environment.apiUrl}${ApiUrlsConfig.projects}`, {params});
  }
  getById(id: any) {
    return this.http.get(`${environment.apiUrl}${ApiUrlsConfig.projects}/${id}`);
  }

  post(obj: any) {
    return this.http.post(`${environment.apiUrl}${ApiUrlsConfig.projects}`, obj);
  }

  patch(id: any, obj: any) {
    return this.http.patch(`${environment.apiUrl}${ApiUrlsConfig.projects}/${id}`, obj);
  }
  changeDefaultProject(id: any, obj: any) {
    return this.http.patch(`${environment.apiUrl}${ApiUrlsConfig.projects}/${id}/changeDefaultProject`, obj);
  }
  delete(id: any) {
    return this.http.delete(`${environment.apiUrl}${ApiUrlsConfig.projects}/${id}`);
  }
}
