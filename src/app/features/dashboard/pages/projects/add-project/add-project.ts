import { ProjectsService } from './../../../../../core/services/projects-service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validation } from '../../../../../core/helpers/validation';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppService } from '../../../../../core/services/app';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TFCard } from '../../../../../shared/components/tf-card/tf-card';
import { CardHeader } from '../../../../../shared/directives/cardheader';
import { TfAlert } from '../../../../../shared/components/tf-alert/tf-alert';
import { TfButton } from '../../../../../shared/components/tf-button/tf-button';
import { TFInput } from '../../../../../shared/components/tf-input/tf-input';
import { ToastService } from '../../../../../core/services/settings/toast-service';

@Component({
  selector: 'app-add-project',
  imports: [ReactiveFormsModule, TFCard, CardHeader, TfAlert, TranslatePipe, TfButton, TFInput],
  templateUrl: './add-project.html',
  styleUrl: './add-project.css',
})
export class AddProject {
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);
  private readonly projectsService = inject(ProjectsService);
  public validationService = inject(Validation);
  public translate = inject(TranslateService);
  public appService = inject(AppService);
  private router = inject(Router);
  readonly toastService = inject(ToastService);
  public errorMessage = signal<any>(null);

  loading = signal(false);
  apiErrors: { [key: string]: boolean } = {};
  form = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  submit() {
    if (this.form.valid) {
      this.loading.set(true);
      this.projectsService
        .post(this.form.value)
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
