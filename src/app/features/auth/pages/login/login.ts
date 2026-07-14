import { Component, DestroyRef, inject, signal } from '@angular/core';
import { TFInput } from '../../../../shared/components/tf-input/tf-input';
import { TFCard } from '../../../../shared/components/tf-card/tf-card';
import { CardHeader } from '../../../../shared/directives/cardheader';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Validation } from '../../../../core/helpers/validation';
import { TfButton } from '../../../../shared/components/tf-button/tf-button';
import { AppService } from '../../../../core/services/app';
import { AuthService } from '../../../../core/services/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tokenKey } from '../../../../core/config/constants';
import { TfAlert } from "../../../../shared/components/tf-alert/tf-alert";

@Component({
  selector: 'app-login',
  imports: [TFInput, TFCard, CardHeader, TranslatePipe, ReactiveFormsModule, RouterLink, TfButton, TfAlert],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  public validationService = inject(Validation);
  public translate = inject(TranslateService);
  public appService = inject(AppService);
  private router = inject(Router);
  public errorMessage = signal<any>(null);

  loading = signal(false);
  apiErrors: { [key: string]: boolean } = {};
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.valid) {
      this.loading.set(true);
      this.authService
        .login(this.form.getRawValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: any) => {
            this.loading.set(false);
            localStorage.setItem(tokenKey, response.data.token);
            this.router.navigateByUrl('/dashboard');
          },
          error: (error: any) => {
            this.loading.set(false);
            this.errorMessage.set(error.error.message)
          },
        });
    }
  }
}
