import { AppService } from './../../../core/services/app';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/settings/toast-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tf-toast',
  imports: [],
  templateUrl: './tf-toast.html',
  styleUrl: './tf-toast.css',
})
export class TfToast {
  readonly toastService = inject(ToastService);
  readonly appService = inject(AppService);
  readonly translate = inject(TranslateService);
  readonly config = {
    success: {
      icon: 'check',
      color: 'text-brand',
      border: 'rgb(34 197 94)',
    },
    warning: {
      icon: 'warning',
      color: 'text-amber',
      border: 'rgb(245 158 11)',
    },
    danger: {
      icon: 'circleXmark',
      color: 'text-danger',
      border: 'rgb(239 68 68)',
    },
    info: {
      icon: 'circleExclamation',
      color: 'text-info',
      border: 'rgb(59 130 246)',
    },
  };
  getIcon(type: any) {
    switch (type) {
      case 'success':
        return 'check';
      case 'info':
        return 'circleExclamation';
      case 'danger':
        return 'circleXmark';
      case 'warning':
        return 'warning';
      default:
        return 'check';
    }
  }
}
