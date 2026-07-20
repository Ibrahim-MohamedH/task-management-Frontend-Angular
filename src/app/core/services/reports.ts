import { inject, Injectable } from '@angular/core';
import { BaseService } from './settings/baseService';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiUrlsConfig } from '../config/ApiUrlsConfig';

@Injectable({
  providedIn: 'root',
})
export class Reports extends BaseService {
  private http = inject(HttpClient);

  getUsersReports(paramsObj?: any) {
    const params = this.prepareHttpParams(paramsObj);
    return this.http.get(`${environment.apiUrl}${ApiUrlsConfig.reports.users}`, { params });
  }
  getProjectsReports(paramsObj?: any) {
    const params = this.prepareHttpParams(paramsObj);
    return this.http.get(`${environment.apiUrl}${ApiUrlsConfig.reports.projects}`, { params });
  }
  getTasksReports(paramsObj?: any) {
    const params = this.prepareHttpParams(paramsObj);
    return this.http.get(`${environment.apiUrl}${ApiUrlsConfig.reports.tasks}`, { params });
  }
  getCharts(paramsObj?: any) {
    const params = this.prepareHttpParams(paramsObj);
    return this.http.get(`${environment.apiUrl}${ApiUrlsConfig.reports.charts}`, { params });
  }
}
