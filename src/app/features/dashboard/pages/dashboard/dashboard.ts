import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AppService } from '../../../../core/services/app';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/settings/toast-service';
import { DashboardService } from '../../../../core/services/dashboard';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { ActivityLogsService } from '../../../../core/services/activity-logs-service';
import { ActivityLogCard } from '../../../../shared/components/activity-log-card/activity-log-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, TranslatePipe, ActivityLogCard, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  public appService = inject(AppService);
  public dashboardService = inject(DashboardService);
  public activityLogsService = inject(ActivityLogsService);
  readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  readonly toastService = inject(ToastService);
  loading = signal<boolean>(false);
  statics = signal<any>({
    projects: {
      active: {},
      archived: {},
      completed: {},
      suspended: {},
      total: 0,
    },
    tasks: {
      cancelled: {},
      completed: {},
      inProgress: {},
      pending: {},
      total: 0,
    },
  });
  readonly skeletonCount = Array.from({ length: 6 });
  upcomingTasks = signal<any[]>([]);
  activityLogs = signal<any[]>([]);
  ngOnInit(): void {
    this.getDashboardStats();
    this.getUpcomingTasks();
    this.getActivityLogs();
  }

  getDashboardStats() {
    this.loading.set(true);
    this.dashboardService
      .getStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.statics.set(res.data);
          this.loading.set(false);
        },
        error: (error) => {
          console.log(error);
          this.loading.set(false);
        },
      });
  }
  getUpcomingTasks() {
    this.loading.set(true);
    this.dashboardService
      .getUpComingTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.upcomingTasks.set(res.data);
          this.loading.set(false);
        },
        error: (error) => {
          console.log(error);
          this.loading.set(false);
        },
      });
  }

  getActivityLogs(pageNumber = 1, limit = 5) {
    const params = {
      page: pageNumber,
      limit,
    };
    this.loading.set(true);
    this.activityLogsService
      .get(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loading.set(false);
          this.activityLogs.set(res.data.activityLogs);
          console.log(res.data.activityLogs);
        },
        error: (err: any) => {
          console.log(err);
          this.loading.set(false);
          this.toastService.danger(err.error.message);
        },
      });
  }
  isPastDueDate(dueDate: string){
    const date = new Date().toLocaleDateString()
    const currentDate = new Date(dueDate).toLocaleDateString()
    if(date > currentDate && currentDate !== ''){
      return "past";
    }else if(date == currentDate && currentDate !== ''){
      return "today";
    }
    return "No Due Date"
  }
}
