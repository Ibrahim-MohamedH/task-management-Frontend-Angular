import { Component, computed, inject, input, signal } from '@angular/core';
import { AppService } from '../../../core/services/app';

@Component({
  selector: 'app-tf-alert',
  imports: [],
  templateUrl: './tf-alert.html',
  styleUrl: './tf-alert.css',
})
export class TfAlert  {
  public appService = inject(AppService);

  alertType = input<
    'info' | 'primary' | 'warning' | 'danger' | 'success'
  >('success');

  icon = input<any>();

  closable = input(false);

  closeIcon = input<any>("close");

  alertClass = input('');

  textClass = input('');

  isVisible = signal(true);

  classes = computed(() => {
    switch (this.alertType()) {
      case 'info':
        return {
          bg: 'bg-cyan-100',
          border: 'border-cyan-400!',
          text: 'text-gray-800',
          icon: 'text-gray-600',
        };

      case 'primary':
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-400!',
          text: 'text-gray-800',
          icon: 'text-gray-600',
        };

      case 'success':
        return {
          bg: 'bg-green-100',
          border: 'border-green-400!',
          text: 'text-green-800',
          icon: 'text-green-600',
        };

      case 'warning':
        return {
          bg: 'bg-yellow-100',
          border: 'border-yellow-400!',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
        };

      case 'danger':
        return {
          bg: 'bg-red-100',
          border: 'border-red-400!',
          text: 'text-red-800',
          icon: 'text-red-600',
        };
    }
  });

  closeAlert() {
    this.isVisible.set(false);
  }
}
