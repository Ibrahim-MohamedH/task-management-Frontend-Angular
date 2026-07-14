import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TaskServices } from '../../../../../core/services/task-services';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TFCard } from '../../../../../shared/components/tf-card/tf-card';
import { ToastService } from '../../../../../core/services/settings/toast-service';
import { Validation } from '../../../../../core/helpers/validation';
import { AppService } from '../../../../../core/services/app';
import { CardHeader } from '../../../../../shared/directives/cardheader';
import { TfAlert } from '../../../../../shared/components/tf-alert/tf-alert';
import { TfButton } from '../../../../../shared/components/tf-button/tf-button';
import { TFInput } from '../../../../../shared/components/tf-input/tf-input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-form',
  imports: [TranslatePipe, ReactiveFormsModule, TFCard, CardHeader, TfAlert, TfButton, TFInput],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private taskService = inject(TaskServices);
  private fb = inject(NonNullableFormBuilder);
  public validationService = inject(Validation);
  public translate = inject(TranslateService);
  public appService = inject(AppService);
  private destroyRef = inject(DestroyRef);
  readonly toastService = inject(ToastService);
  public errorMessage = signal<any>(null);

  loading = signal(false);
  apiErrors: { [key: string]: boolean } = {};

  readonly mode = this.config.data.mode as 'create' | 'edit';
  readonly projectId = this.config.data.projectId;
  readonly taskId = this.config.data.taskId;
  form = this.fb.group({
    project: ['', [Validators.required]],
    title: ['', [Validators.required]],
    description: [''],
    priority: [''],
    dueDate: [''],
  });
  ngOnInit() {
    if (this.mode === 'edit') {
      this.getTask();
    }
    this.form.patchValue({
      project: this.projectId,
    });
  }
  getTask() {
    this.taskService
      .getById(this.taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.form.patchValue({
            title: res.data.title,
            description: res.data.description,
            priority: res.data.priority,
            dueDate: res.data.dueDate,
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  removeEmpty(data: any){
    Object.keys(data).forEach((key: any) =>{
      if(data[key] == ''){
        delete data[key]
      }
    })
    return data
  }

  submit() {
    this.loading.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.loading.set(true);

      return;
    }

    if (this.mode === 'create') {
      this.createTask();
    } else {
      this.updateTask();
    }
  }

  createTask() {
    const body = this.removeEmpty(this.form.value);
    this.taskService
      .post(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loading.set(true);
          this.toastService.success(res.message);
          this.ref.close('submitted');
        },
        error: (err) => {
          this.loading.set(true);
          console.log(err);
          this.toastService.danger(err.error.message);
          this.ref.close('error');
        },
      });
    this.ref.close('submitted');
  }

  updateTask() {
    const body = {
      ...this.form.value,
    };
    delete body.project;
    this.taskService
      .patch(this.taskId, body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loading.set(true);
          this.toastService.success(res.message);
          this.ref.close('submitted');
        },
        error: (err) => {
          this.loading.set(true);
          console.log(err);
          this.toastService.danger(err.error.message);
          this.ref.close('error');
        },
      });
  }
}
