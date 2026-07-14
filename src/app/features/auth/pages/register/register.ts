import { Component, DestroyRef, inject, signal } from '@angular/core';
import { TFCard } from '../../../../shared/components/tf-card/tf-card';
import { TFInput } from '../../../../shared/components/tf-input/tf-input';
import { TfButton } from '../../../../shared/components/tf-button/tf-button';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validation } from '../../../../core/helpers/validation';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppService } from '../../../../core/services/app';
import { passwordMatchValidator } from '../../../../core/helpers/password-match.validator';
import { CardHeader } from '../../../../shared/directives/cardheader';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tokenKey } from '../../../../core/config/constants';
import { TfAlert } from '../../../../shared/components/tf-alert/tf-alert';

@Component({
  selector: 'app-register',
  imports: [
    TFCard,
    TFInput,
    TfButton,
    TranslatePipe,
    ReactiveFormsModule,
    CardHeader,
    RouterLink,
    TfAlert,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);
  public validationService = inject(Validation);
  public translate = inject(TranslateService);
  public appService = inject(AppService);
  private authService = inject(AuthService);
  private router = inject(Router);
  public errorMessage = signal<any>(null);
  loading = signal(false);
  apiErrors: { [key: string]: boolean } = {};
  form = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])[\w\W]{8,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: passwordMatchValidator('password', 'confirmPassword'),
    },
  );

  submit() {
    if (this.form.valid) {
      this.loading.set(true);
      this.authService
        .register(this.form.getRawValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: any) => {
            this.loading.set(false);
            localStorage.setItem(tokenKey, response.data.token);
            this.router.navigateByUrl('/dashboard');
          },
          error: (error: any) => {
            this.loading.set(false);
            this.errorMessage.set(error.error.message);
          },
        });
    }
  }
}
