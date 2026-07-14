import { ToastService } from './../../../../../core/services/settings/toast-service';
import { Component, computed, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { AppService } from '../../../../../core/services/app';
import { PaginatedResponse } from '../../../../../core/config/general';
import { ProjectsService } from '../../../../../core/services/projects-service';
import { DatePipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { TfPagination } from '../../../../../shared/components/tf-pagination/tf-pagination';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TFInput } from '../../../../../shared/components/tf-input/tf-input';

@Component({
  selector: 'app-list-projects',
  imports: [DatePipe, TranslatePipe, RouterLink, TfPagination, TFInput],
  templateUrl: './list-projects.html',
  styleUrl: './list-projects.css',
})
export class ListProjects {
  public appService = inject(AppService);
  public projectsService = inject(ProjectsService);
  readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  readonly toastService = inject(ToastService);
  readonly projects = signal<any[]>([]);
  loading = signal<boolean>(false);
  listType = signal<'grid' | 'list'>('grid');

  readonly statuses = [
    {
      label: 'All Status',
      value: 'all',
      color: 'bg-text-faint',
    },
    {
      label: 'Active',
      value: 'active',
      color: 'bg-brand',
    },
    {
      label: 'Suspended',
      value: 'suspended',
      color: 'bg-amber',
    },
    {
      label: 'Completed',
      value: 'completed',
      color: 'bg-info',
    },
    {
      label: 'Archived',
      value: 'archived',
      color: 'bg-text-faint',
    },
  ];

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
    {
      label: 'Name A-Z',
      sortBy: 'name',
      order: 'asc',
    },
    {
      label: 'Name Z-A',
      sortBy: 'name',
      order: 'desc',
    },
  ];
  readonly PROJECT_STATUS = ['active', 'suspended', 'completed', 'archived'] as const;
  readonly STATUS_CONFIG = {
    active: { label: 'Active', dot: 'bg-brand', bg: 'bg-brand-soft', text: 'text-brand' },
    suspended: { label: 'Suspended', dot: 'bg-amber', bg: 'bg-amber-soft', text: 'text-amber' },
    completed: { label: 'Completed', dot: 'bg-info', bg: 'bg-info-soft', text: 'text-info' },
    archived: {
      label: 'Archived',
      dot: 'bg-text-faint',
      bg: 'bg-surface-2',
      text: 'text-text-muted',
    },
  };
  openedStatus = signal<string | null>(null);
  readonly selectedStatus = signal('all');
  statusFilter = signal(false);
  readonly selectedStatusLabel = computed(() => {
    return this.statuses.find((s) => s.value === this.selectedStatus())?.label ?? 'All Status';
  });

  readonly pagination = signal<PaginatedResponse>({
    pageNumber: 1,
    totalPages: 0,
    totalRecords: 0,
    limit: 10,
  });
  toggleStatusFilter() {
    this.statusFilter.set(!this.statusFilter());
  }
  readonly filters = signal<Record<string, any>>({});
  constructor() {
    this.filters.set({
      admin: false,
      search: '',
    });
    this.getProjectsList();
  }

  getProjectsList(pageNumber = 1, limit = this.pagination().limit) {
    const params = {
      page: pageNumber,
      limit,
      ...this.filters(),
    };

    this.loading.set(true);
    this.projectsService
      .get(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loading.set(false);
          this.projects.set(res.data.projects);
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
  changeStatus(status: string) {
    this.selectedStatus.set(status);

    this.filters.update((filters) => {
      if (status === 'all') {
        const { status, ...rest } = filters;

        return rest;
      }

      return {
        ...filters,
        status,
      };
    });

    this.statusFilter.set(false);

    this.getProjectsList();
  }

  orderFilter(event: any) {
    const index = event.target.value;
    const value = this.sortOptions[index];
    this.filters.update((filters) => {
      return {
        ...filters,
        sortBy: value.sortBy,
        sortOrder: value.order,
      };
    });
    this.getProjectsList();
  }
  filterAdmin(event: any) {
    const value = event.target.checked;
    this.filters.update((filters) => {
      return {
        ...filters,
        admin: value,
      };
    });
    this.getProjectsList();
  }

  statusBadge(status: keyof typeof this.STATUS_CONFIG) {
    return this.STATUS_CONFIG[status] ?? this.STATUS_CONFIG.archived;
  }

  changeListView(type: 'grid' | 'list') {
    this.listType.set(type);
  }

  onPageChange(page: number): void {
    this.getProjectsList(page, this.pagination().limit);
  }

  onPerPageChange(limit: number): void {
    this.pagination.update((p) => ({
      ...p,
      limit,
    }));

    this.getProjectsList(1, limit);
  }
  deleteProject(id: any) {
    this.loading.set(true);
    this.projectsService
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loading.set(false);
          this.toastService.success(res.message);
          this.getProjectsList();
        },
        error: (err: any) => {
          this.loading.set(false);
          this.toastService.danger(err.error.message);
        },
      });
  }

  toggleStatus(projectId: string) {
    this.openedStatus.update((id) => (id === projectId ? null : projectId));
  }

  closeStatus() {
    this.openedStatus.set(null);
  }

  changeProjectStatus(project: any, status: string) {
    if (project.status === status) {
      this.closeStatus();
      return;
    }
    this.loading.set(true);
    const body = {
      status,
    };
    this.projectsService
      .patch(project._id, body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loading.set(false);
          project.status = status;
          this.getProjectsList();
          this.toastService.success(res.message);
          this.closeStatus();
        },

        error: () => {
          this.loading.set(false);
          this.closeStatus();
        },
      });
  }

  changeDefaultProject(id: any) {
    this.loading.set(true);
    const body = {
      isDefault: true,
    };
    this.projectsService
      .changeDefaultProject(id, body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loading.set(false);
          console.log(res);
          this.getProjectsList();
          this.toastService.success(res.message);
        },
        error: (err) => {
          this.loading.set(false);
          console.log(err);
          this.toastService.danger(err.error.message);
        },
      });
  }

  makeDefault(event: any, id: any) {
    if (event.target.checked) {
      this.changeDefaultProject(id);
    }
  }
}
