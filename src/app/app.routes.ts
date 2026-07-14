import { Routes } from '@angular/router';
import { authRoutes } from './core/routes/auth.routes';
import { dashboardRoutes } from './core/routes/dashboard.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/layout/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [...authRoutes],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/layouts/dashboard-layout/dashboard-layout').then((m) => m.DashboardLayout),
    children: [...dashboardRoutes],
    data: {
          breadcrumb: { label: 'Dashboard', url: '/dashboard' },
        },
  }
];
