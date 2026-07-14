export const sidebarItems = [
  {
    title: 'workspace',
    children: [
      {
        title: 'Dashboard',
        routerLink: '/dashboard',
        icon: 'objectsColumn',
        role: 'Dashboard',
        permission: ['admin', 'user'],
      },
      // {
      //   title: 'My Tasks',
      //   routerLink: '/dashboard/tasks',
      //   icon: 'clipboardListCheck',
      //   role: 'My Tasks',
      //   permission: ['admin', 'user'],
      // },
      {
        title: 'Projects',
        routerLink: '/dashboard/projects/list-projects',
        icon: 'folderGrid',
        role: 'Projects',
        permission: ['admin', 'user'],
      },
      {
        title: 'Users',
        routerLink: '/dashboard/users',
        icon: 'userGroup',
        role: 'Users',
        permission: ['admin'],
      },
    ],
  },
  {
    title: 'communication',
    children: [
      {
        title: 'Activity Logs',
        routerLink: '/dashboard/activity-logs',
        icon: 'magnifyingGlassChart',
        role: 'Activity Logs',
        permission: ['admin', 'user'],
      },
      {
        title: 'Reports',
        routerLink: '/dashboard/reports',
        icon: 'chartColumns',
        role: 'Reports',
        permission: ['admin'],
      },
    ],
  },
];
