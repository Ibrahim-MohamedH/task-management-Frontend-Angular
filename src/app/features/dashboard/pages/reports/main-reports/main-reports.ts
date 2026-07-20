import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { AppService } from '../../../../../core/services/app';
import { Reports } from '../../../../../core/services/reports';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../core/services/settings/toast-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../../../../core/config/ApexChart';
import {
  buildChartOptions,
  buildDonutChartOptions,
} from '../../../../../core/helpers/buildChartOptions';
@Component({
  selector: 'app-main-reports',
  imports: [TranslatePipe, NgApexchartsModule],
  templateUrl: './main-reports.html',
  styleUrl: './main-reports.css',
})
export class MainReports {
  readonly appService = inject(AppService);
  public reportsService = inject(Reports);
  readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  readonly toastService = inject(ToastService);
  loading = signal<boolean>(false);
  usersReport = signal<any>('');
  projectsReport = signal<any>('');
  tasksReport = signal<any>('');
  mainCharts = signal<any>('');
  private statusLabelMap: Record<string, string> = {
    active: 'Active',
    suspended: 'Suspended',
    completed: 'Completed',
    archived: 'Archived',
  };
  private TaskstatusLabel: Record<string, string> = {
    cancelled: 'Cancelled',
    in_progress: 'In Progress',
    completed: 'Completed',
    pending: 'Pending',
  };
  private TaskPriorityLabel: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'high',
    urgent: 'Urgent',
  };

  ngOnInit(): void {
    this.getUsersReports();
    this.getProjectsReports();
    this.getTasksReports();
    this.getCharts();
  }

  getUsersReports(params?: any) {
    this.loading.set(true);
    this.reportsService
      .getUsersReports(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          console.log(res.data);
          this.usersReport.set(res.data);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }
  getProjectsReports(params?: any) {
    this.loading.set(true);
    this.reportsService
      .getProjectsReports(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          console.log(res.data);
          this.loading.set(false);
          this.projectsReport.set(res.data);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }
  getTasksReports(params?: any) {
    this.loading.set(true);
    this.reportsService
      .getTasksReports(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          console.log(res.data);
          this.loading.set(false);
          this.tasksReport.set(res.data);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }
  getCharts(params?: any) {
    this.loading.set(true);
    this.reportsService
      .getCharts(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          console.log(res.data);
          this.mainCharts.set(res.data);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }

  ProjectStatusOptions = computed(() =>
    buildDonutChartOptions(
      'PROJECT_STATUS',
      this.projectsReport()?.status,
      this.statusLabelMap,
      (key) => this.translate.instant(key),
      this.appService.getTheme(),
    ),
  );
  TaskStatusOptions = computed(() =>
    buildDonutChartOptions(
      'TASK_STATUS',
      this.tasksReport()?.status,
      this.TaskstatusLabel,
      (key) => this.translate.instant(key),
      this.appService.getTheme(),
    ),
  );
  TaskPriorityOptions = computed(() =>
    buildDonutChartOptions(
      'TASK_PRIORITY',
      this.tasksReport()?.priority,
      this.TaskPriorityLabel,
      (key) => this.translate.instant(key),
      this.appService.getTheme(),
    ),
  );

  usersChart = computed(() =>
    buildChartOptions(this.mainCharts().users, 'Users', 'users', this.appService.getTheme()),
  );

  projectsChart = computed(() =>
    buildChartOptions(
      this.mainCharts().projects,
      'Projects',
      'projects',
      this.appService.getTheme(),
    ),
  );

  tasksChart = computed(() =>
    buildChartOptions(this.mainCharts().tasks, 'Tasks', 'tasks', this.appService.getTheme()),
  );

  readonly sortOptions = ['daily', 'monthly', 'yearly'];

  orderFilter(event: any, type: 'user' | 'project' | 'task') {
    const value = event.target.value;
    if (type == 'user') {
      this.getUsersReports({ period: value });
    } else if (type == 'project') {
      this.getProjectsReports({ period: value });
    } else if (type == 'task') {
      this.getTasksReports({ period: value });
    }
  }
  chartFilter(event: any, type: 'user' | 'project' | 'task') {
    const value = event.target.value;
      this.getCharts({ period: value });
  }
}
