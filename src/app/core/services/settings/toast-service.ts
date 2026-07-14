import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../../../shared/models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(message: any, type: ToastType = 'info', duration = 3500) {
    const toast: Toast = {
      id: crypto.randomUUID(),
      message,
      type,
      duration,
    };

    this.toasts.update((t) => [...t, toast]);

    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  remove(id: string) {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }

  success(message: any) {
    this.show(message, 'success');
  }

  danger(message: any) {
    this.show(message, 'danger');
  }

  warning(message: any) {
    this.show(message, 'warning');
  }

  info(message: any) {
    this.show(message, 'info');
  }
}
