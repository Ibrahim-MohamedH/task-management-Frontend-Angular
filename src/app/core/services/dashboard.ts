import { inject, Injectable } from '@angular/core';
import { BaseService } from './settings/baseService';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiUrlsConfig } from '../config/ApiUrlsConfig';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseService {
  private http = inject(HttpClient);

  getStats() {
    return this.http.get(`${environment.apiUrl}${ApiUrlsConfig.dashboard.stats}`);
  }
  getUpComingTasks() {
    return this.http.get(`${environment.apiUrl}${ApiUrlsConfig.dashboard.upcomingTasks}`);
  }
}
