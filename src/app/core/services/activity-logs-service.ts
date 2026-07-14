import { inject, Injectable } from '@angular/core';
import { BaseService } from './settings/baseService';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiUrlsConfig } from '../config/ApiUrlsConfig';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogsService extends BaseService {
  private http = inject(HttpClient);

  get(paramsObj?: any) {
    const params = this.prepareHttpParams(paramsObj);
    return this.http.get(`${environment.apiUrl}${ApiUrlsConfig.activityLogs}`, {params});
  }
}
