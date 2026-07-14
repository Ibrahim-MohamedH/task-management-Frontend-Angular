import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TFCard } from '../../../../../shared/components/tf-card/tf-card';
import { CardHeader } from '../../../../../shared/directives/cardheader';
import { TfAlert } from '../../../../../shared/components/tf-alert/tf-alert';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TfButton } from '../../../../../shared/components/tf-button/tf-button';
import { TFInput } from '../../../../../shared/components/tf-input/tf-input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectsService } from '../../../../../core/services/projects-service';
import { Validation } from '../../../../../core/helpers/validation';
import { AppService } from '../../../../../core/services/app';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../../core/services/settings/toast-service';

@Component({
  selector: 'app-edit-project',
  imports: [ReactiveFormsModule, TFCard, CardHeader, TfAlert, TranslatePipe, TfButton, TFInput],
  templateUrl: './edit-project.html',
  styleUrl: './edit-project.css',
})
export class EditProject {
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);
  private readonly projectsService = inject(ProjectsService);
  public translate = inject(TranslateService);
  public appService = inject(AppService);
  public validationService = inject(Validation);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  readonly toastService = inject(ToastService);
  public errorMessage = signal<any>(null);

  loading = signal(false);
  projectId = signal<string | null>('');
  apiErrors: { [key: string]: boolean } = {};
  form = this.fb.group({
    name: ['', [Validators.required]],
    status: ['', [Validators.required]],
    description: [''],
  });
  ngOnInit() {
    this.projectId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getProject();
  }

  getProject() {
    this.projectsService
      .getById(this.projectId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.loading.set(false);
          this.patchFormValues(response.data)
          this.toastService.success(response.message);
        },
        error: (error: any) => {
          this.loading.set(false);
          this.errorMessage.set(error.error.message);
          this.toastService.danger(error.error.message);
        },
      });
  }

  patchFormValues(data:any){
    this.form.patchValue({
      ...data
    })
  }

  submit() {
    if (this.form.valid) {
      this.loading.set(true);
      this.projectsService
        .patch(this.projectId(), this.form.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: any) => {
            this.loading.set(false);
            this.toastService.success(response.message);
            this.form.reset();
            this.router.navigateByUrl('/dashboard/projects');
          },
          error: (error: any) => {
            this.loading.set(false);
            this.errorMessage.set(error.error.message);
            this.toastService.danger(error.error.message);
          },
        });
    }
  }
}
