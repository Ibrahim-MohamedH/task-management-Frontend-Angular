export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface Toast {
  id: string;

  message: any;

  type: ToastType;

  duration?: number;
}
