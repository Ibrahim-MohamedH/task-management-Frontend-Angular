import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivityLogsService } from '../../../../../core/services/activity-logs-service';
import {
  ActionTypeFilter,
  ActivityLog,
  EntityTypeFilter,
} from '../../../../../shared/models/activity-logs.modal';
import { TitleCasePipe } from '@angular/common';
import { ActivityLogCard } from '../../../../../shared/components/activity-log-card/activity-log-card';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../core/services/settings/toast-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginatedResponse } from '../../../../../core/config/general';
import { TfPagination } from '../../../../../shared/components/tf-pagination/tf-pagination';
import { AppService } from '../../../../../core/services/app';
import { ProjectsService } from '../../../../../core/services/projects-service';

@Component({
  selector: 'app-list-activity-logs',
  imports: [TitleCasePipe, ActivityLogCard, TfPagination, TranslatePipe],
  templateUrl: './list-activity-logs.html',
  styleUrl: './list-activity-logs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListActivityLogs implements OnInit {
  readonly appService = inject(AppService);
  private readonly activityLogsService = inject(ActivityLogsService);
  private readonly projectsService = inject(ProjectsService);
  readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  readonly toastService = inject(ToastService);
  readonly activityLogs = signal<any[]>([]);
  readonly projects = signal<any[]>([]);
  loading = signal<boolean>(false);
  readonly pagination = signal<PaginatedResponse>({
    pageNumber: 1,
    totalPages: 0,
    totalRecords: 0,
    limit: 10,
  });
  readonly filters = signal<Record<string, any>>({});

  /* ── Service state passthrough ─────────────────────────────────────────── */

  readonly sortOptions = [
    {
      label: 'Newest',
      sortBy: 'createdAt',
      order: 'desc',
    },
    {
      label: 'Oldest',
      sortBy: 'createdAt',
      order: 'asc',
    },
  ];

  /* ── Filter signals ─────────────────────────────────────────────────────── */

  readonly entityTypeFilter = signal<EntityTypeFilter>('all');
  readonly actionFilter = signal<ActionTypeFilter>('all');
  readonly selectedProjectId = signal<string | null>(null);
  readonly selectedTaskId = signal<string | null>(null);
  readonly sortOrder = signal<any>('Newest');

  /* ── Mobile filter panel toggle ─────────────────────────────────────────── */

  readonly showMobileFilters = signal(false);
  toggleMobileFilters(): void {
    this.showMobileFilters.update((v) => !v);
  }

  /* ── Project / task filter dropdowns ───────────────────────────────────── */

  readonly showProjectDropdown = signal(false);
  readonly projectSearch = signal('');
  readonly showTaskDropdown = signal(false);
  readonly taskSearch = signal('');

  toggleProjectDropdown(): void {
    this.showProjectDropdown.update((v) => !v);
    this.showTaskDropdown.set(false);
  }

  toggleTaskDropdown(): void {
    this.showTaskDropdown.update((v) => !v);
    this.showProjectDropdown.set(false);
  }

  closeAllDropdowns(): void {
    this.showProjectDropdown.set(false);
    this.showTaskDropdown.set(false);
  }

  /* ── Derived filter options (from loaded data) ──────────────────────────── */

  readonly availableProjects = computed(() => {
    const seen = new Map<string, { _id: string; name: string }>();
    this.activityLogs().forEach((l) => {
      if (l.project && !seen.has(l.project._id)) seen.set(l.project._id, l.project);
    });
    return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly availableTasks = computed(() => {
    const seen = new Map<string, { _id: string; title: string }>();
    this.activityLogs().forEach((l) => {
      if (l.task && !seen.has(l.task._id)) seen.set(l.task._id, l.task);
    });
    return Array.from(seen.values()).sort((a, b) => a.title.localeCompare(b.title));
  });

  readonly filteredProjects = computed(() => {
    const q = this.projectSearch().toLowerCase().trim();
    return q
      ? this.availableProjects().filter((p) => p.name.toLowerCase().includes(q))
      : this.availableProjects();
  });

  readonly filteredTasks = computed(() => {
    const q = this.taskSearch().toLowerCase().trim();
    return q
      ? this.availableTasks().filter((t) => t.title.toLowerCase().includes(q))
      : this.availableTasks();
  });

  readonly selectedProjectName = computed(() => {
    const id = this.selectedProjectId();
    return id ? (this.availableProjects().find((p) => p._id === id)?.name ?? null) : null;
  });

  readonly selectedTaskName = computed(() => {
    const id = this.selectedTaskId();
    return id ? (this.availableTasks().find((t) => t._id === id)?.title ?? null) : null;
  });

  /* ── Filtered + sorted log list ─────────────────────────────────────────── */

  readonly filteredLogs = computed((): ActivityLog[] => {
    let list = [...this.activityLogs()];

    // Project
    const pid = this.selectedProjectId();
    if (pid) list = list.filter((l) => l.project?._id === pid);

    // Task
    const tid = this.selectedTaskId();
    if (tid) list = list.filter((l) => l.task?._id === tid);

    return list;
  });

  /** True when any non-default filter is applied */
  readonly hasActiveFilters = computed(
    () =>
      this.entityTypeFilter() !== 'all' ||
      this.actionFilter() !== 'all' ||
      this.selectedProjectId() !== null ||
      this.selectedTaskId() !== null,
  );

  /** Skeleton placeholder count */
  readonly skeletonCount = Array.from({ length: 6 });

  /* ── Filter actions ─────────────────────────────────────────────────────── */
  changeEntityType(type: EntityTypeFilter) {
    console.log(type);
  }

  setEntityType(val: any): void {
    this.filters.update((filters) => {
      if (val === 'all') {
        this.entityTypeFilter.set(val);
        const { entityType, ...rest } = filters;
        return rest;
      }

      this.entityTypeFilter.set(val);
      return {
        ...filters,
        entityType: val,
      };
    });
    this.getActivityLogs();
  }
  setAction(val: any): void {
    console.log(val);
    this.filters.update((filters) => {
      if (val === 'all') {
        this.actionFilter.set(val);
        const { action, ...rest } = filters;
        return rest;
      }
      this.actionFilter.set(val);
      return {
        ...filters,
        action: val,
      };
    });
    this.getActivityLogs();
  }
  setSortOrder(event: any): void {
    const index = event.target.value;
    const value = this.sortOptions[index];
    this.filters.update((filters) => {
      return {
        ...filters,
        sortBy: value.sortBy,
        sortOrder: value.order,
      };
    });
    this.getActivityLogs();
    this.sortOrder.set(index);
  }

  selectProject(id: string | null): void {
    this.selectedProjectId.set(id);
    this.showProjectDropdown.set(false);
    this.projectSearch.set('');
  }

  selectTask(id: string | null): void {
    this.selectedTaskId.set(id);
    this.showTaskDropdown.set(false);
    this.taskSearch.set('');
  }

  clearAllFilters(): void {
    this.entityTypeFilter.set('all');
    this.actionFilter.set('all');
    this.selectedProjectId.set(null);
    this.selectedTaskId.set(null);
    this.sortOrder.set('Newest');
    this.filters.set({});
    this.getActivityLogs();
  }

  onProjectSearch(event: Event): void {
    this.projectSearch.set((event.target as HTMLInputElement).value);
  }

  onTaskSearch(event: Event): void {
    this.taskSearch.set((event.target as HTMLInputElement).value);
  }

  refresh(): void {
    this.getActivityLogs();
  }

  /* ── Lifecycle ──────────────────────────────────────────────────────────── */

  ngOnInit(): void {
    this.getActivityLogs();
    this.getProjectsList();
  }

  getActivityLogs(pageNumber = 1, limit = this.pagination().limit) {
    const params = {
      page: pageNumber,
      limit,
      ...this.filters(),
    };
    this.loading.set(true);
    this.activityLogsService
      .get(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loading.set(false);
          this.activityLogs.set(res.data.activityLogs);
          this.pagination.set({
            pageNumber: res.data.pagination.page,
            limit: res.data.pagination.limit,
            totalPages: res.data.pagination.totalPages,
            totalRecords: res.data.pagination.total,
          });
        },
        error: (err: any) => {
          console.log(err);
          this.loading.set(false);
          this.toastService.danger(err.error.message);
        },
      });
  }

  getProjectsList() {
    const params = {
      isDeleted: true,
    };
    this.projectsService
      .get(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.projects.set(res.data.projects);
        },
        error: (err: any) => {
          console.log(err);
          this.toastService.danger(err.error.message);
        },
      });
  }

  onPageChange(page: number): void {
    this.getActivityLogs(page, this.pagination().limit);
  }

  onPerPageChange(limit: number): void {
    this.pagination.update((p) => ({
      ...p,
      limit,
    }));

    this.getActivityLogs(1, limit);
  }
}
