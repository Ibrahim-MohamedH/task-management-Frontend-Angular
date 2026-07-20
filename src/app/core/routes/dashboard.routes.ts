import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../features/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('../../features/dashboard/pages/projects/main-project/main-project').then(
        (m) => m.MainProject,
      ),
    children: [
      {
        path: '',
        redirectTo: 'list-projects',
        pathMatch: 'full',
      },
      {
        path: 'list-projects',
        loadComponent: () =>
          import('../../features/dashboard/pages/projects/list-projects/list-projects').then(
            (m) => m.ListProjects,
          ),
        data: {
          breadcrumb: { label: 'Projects List', url: '/dashboard/projects/list-projects' },
        },
      },
      {
        path: 'add-project',
        loadComponent: () =>
          import('../../features/dashboard/pages/projects/add-project/add-project').then(
            (m) => m.AddProject,
          ),
        data: {
          breadcrumb: { label: 'Add Project', url: '/dashboard/projects/add-project' },
        },
      },
      {
        path: 'edit-project/:id',
        loadComponent: () =>
          import('../../features/dashboard/pages/projects/edit-project/edit-project').then(
            (m) => m.EditProject,
          ),
        data: {
          breadcrumb: { label: 'Edit Project', url: '/dashboard/projects' },
        },
      },
    ],
  },
  {
    path: 'activity-logs',
    loadComponent: () =>
      import('../../features/dashboard/pages/activityLogs/main-activity-logs/main-activity-logs').then(
        (m) => m.MainActivityLogs,
      ),
    children: [
      {
        path: '',
        redirectTo: 'list-log',
        pathMatch: 'full',
      },
      {
        path: 'list-log',
        loadComponent: () =>
          import('../../features/dashboard/pages/activityLogs/list-activity-logs/list-activity-logs').then(
            (m) => m.ListActivityLogs,
          ),
        data: {
          breadcrumb: { label: 'Activity Logs', url: '/dashboard/activity-logs/list-log' },
        },
      },
    ],
  },
  {
    path: 'task',
    loadComponent: () =>
      import('../../features/dashboard/pages/tasks/main-tasks/main-tasks').then((m) => m.MainTasks),
    children: [
      {
        path: '',
        redirectTo: '/dashboard/projects',
        pathMatch: 'full',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('../../features/dashboard/pages/tasks/list-tasks/list-tasks').then(
            (m) => m.ListTasks,
          ),
        data: {
          breadcrumb: { label: 'Tasks', url: '' },
        },
      },
    ],
  },
  {
    path: 'users',
    loadComponent: () =>
      import('../../features/dashboard/pages/users/main-users/main-users').then((m) => m.MainUsers),
    children: [
      {
        path: '',
        redirectTo: 'list-users',
        pathMatch: 'full',
      },
      {
        path: 'list-users',
        loadComponent: () =>
          import('../../features/dashboard/pages/users/list-users/list-users').then(
            (m) => m.ListUsers,
          ),
        data: {
          breadcrumb: { label: 'List Users', url: '/dashboard/users/list-users' },
        },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('../../features/dashboard/pages/users/view-user/view-user').then(
            (m) => m.ViewUser,
          ),
        data: {
          breadcrumb: { label: 'View User', url: '' },
        },
      },
    ],
  },
  {
     path: 'reports',
    loadComponent: () =>
      import('../../features/dashboard/pages/reports/main-reports/main-reports').then((m) => m.MainReports),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
