import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AppService } from '../../../../core/services/app';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/settings/toast-service';
import { DashboardService } from '../../../../core/services/dashboard';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ActivityLogsService } from '../../../../core/services/activity-logs-service';
import { ActivityLogCard } from '../../../../shared/components/activity-log-card/activity-log-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, TranslatePipe, ActivityLogCard, RouterLink, TitleCasePipe],
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
  isPastDueDate(dueDate: string) {
    const date = new Date().toLocaleDateString();
    const currentDate = new Date(dueDate).toLocaleDateString();
    if (date > currentDate && currentDate !== '') {
      return 'past';
    } else if (date == currentDate && currentDate !== '') {
      return 'today';
    }
    return 'No Due Date';
  }

  readonly VALUE_BASE = 'inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full';
  getStatusBadgeClass(value: string | null): string {
    if (!value)
      return `${this.VALUE_BASE} bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400`;
    const key = value.toLowerCase().replace(/ /g, '_');
    const COLOR: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      in_progress: 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
      completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
      cancelled: 'bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-400',
      active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
      archived: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
      suspended: 'bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
      on_hold: 'bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
    };
    return `${this.VALUE_BASE} ${COLOR[key] ?? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`;
  }

  formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    // Date
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    // snake_case / kebab-case -> Title Case
    if (typeof value === 'string') {
      return value
        .replace(/[_-]+/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    return String(value);
  }
}
