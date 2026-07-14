import { AppService } from './../../../../../core/services/app';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from './../../../../../core/services/projects-service';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../core/services/settings/toast-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { TaskServices } from '../../../../../core/services/task-services';
import { DialogService } from 'primeng/dynamicdialog';
import { TaskForm } from '../task-form/task-form';

@Component({
  selector: 'app-list-tasks',
  imports: [TranslatePipe, DatePipe],
  templateUrl: './list-tasks.html',
  styleUrl: './list-tasks.css',
  providers: [DialogService],
})
export class ListTasks {
  readonly appService = inject(AppService);
  readonly projectsService = inject(ProjectsService);
  readonly taskServices = inject(TaskServices);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  readonly toastService = inject(ToastService);
  readonly project = signal<any>({});
  readonly projectId = signal<any>('');
  private dialog = inject(DialogService);
  loading = signal<boolean>(false);
  taskData = signal({
    pending: {
      label: 'Pending',
      color: '154,151,143,0.5',
      dot: 'text-faint',
      status: 'pending',
    },
    in_progress: {
      label: 'In Progress',
      color: '37,99,172,0.5',
      dot: 'info',
      status: 'in_progress',
    },
    completed: {
      label: 'Completed',
      color: '23,107,82,0.5',
      dot: 'brand',
      status: 'completed',
    },
    cancelled: {
      label: 'Cancelled',
      color: '193,67,47,0.5',
      dot: 'danger',
      status: 'cancelled',
    },
  });
  taskPriority = {
    low: '154,151,143,0.5',
    medium: '37,99,172,0.5',
    high: '201,122,43,0.5',
    urgent: '193,67,47,0.5',
  };

  kanbanColumns = computed(() =>
    Object.entries(this.taskData()).map(([key, value]) => ({
      key,
      ...value,
    })),
  );
  kanbanTasks = computed(() => {
    const tasks = this.project()?.tasks ?? [];

    return {
      pending: tasks.filter((t: any) => t.status === 'pending'),
      in_progress: tasks.filter((t: any) => t.status === 'in_progress'),
      completed: tasks.filter((t: any) => t.status === 'completed'),
      cancelled: tasks.filter((t: any) => t.status === 'cancelled'),
    };
  });

  ngOnInit(): void {
    this.projectId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getProjectById();
  }

  getProjectById() {
    this.loading.set(true);
    this.projectsService
      .getById(this.projectId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.project.set(res.data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getTasks(status: string) {
    return this.kanbanTasks()[status as keyof ReturnType<typeof this.kanbanTasks>] ?? [];
  }

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0] ?? '')
      .join('')
      .toUpperCase();
  }
  getUserAvatarClass(userId: string): string {
    const palette = [
      'bg-violet-500 text-white',
      'bg-blue-500 text-white',
      'bg-emerald-500 text-white',
      'bg-amber-500 text-white',
      'bg-rose-500 text-white',
      'bg-cyan-600 text-white',
    ];
    const idx = userId ? userId.charCodeAt(userId.length - 1) % palette.length : 0;
    return palette[idx];
  }
  // ====================================================
  draggedTask = signal<any | null>(null);
  dragOverColumn = signal<string | null>(null);
  onDragEnter(status: string) {
    this.dragOverColumn.set(status);
  }

  onDragLeave(status: string) {
    if (this.dragOverColumn() === status) {
      this.dragOverColumn.set(null);
    }
  }
  onDragStart(task: any) {
    this.draggedTask.set(task);
  }
  onDragEnd() {
    this.draggedTask.set(null);
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onDrop(status: string) {
    const task = this.draggedTask();
    this.dragOverColumn.set(null);

    if (!task) return;

    if (task.status === status) {
      this.draggedTask.set(null);
      return;
    }

    // API
    this.taskServices
      .changeStatus(task._id, { status })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.toastService.success(response.message);
          this.getProjectById();
        },
        error: (err) => {
          console.log(err);
          this.toastService.danger(err.error.message);
        },
      });

    this.draggedTask.set(null);
  }

  openTaskDialog() {
    const ref = this.dialog.open(TaskForm, {
      header: this.translate.instant('New Task'),
      width: '650px',
      modal: true,
      closable: true,
      dismissableMask: true,
      data: {
        mode: 'create',
        projectId: this.project()._id,
      },
    });

    ref?.onClose.subscribe((res) => {
      if (res == 'submitted') {
        this.getProjectById();
      }
    });
  }

  editTask(id: any) {
    const ref = this.dialog.open(TaskForm, {
      header: this.translate.instant('Edit Task'),
      width: '650px',
      modal: true,
      closable: true,
      dismissableMask: true,
      data: {
        mode: 'edit',
        projectId: this.project()._id,
        taskId: id,
      },
    });

    if (!ref) return;

    ref.onClose.subscribe((result) => {
      if (result) {
        this.getProjectById();
      }
    });
  }

  deleteTask(id: any) {
    this.loading.set(true);
    this.taskServices
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loading.set(false);
          this.toastService.success(res.message);
          this.getProjectById();
        },
        error: (err: any) => {
          this.loading.set(false);
          this.toastService.danger(err.error.message);
        },
      });
  }
}
