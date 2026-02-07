import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // PUBLIC (login/register)
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout').then(m => m.AuthLayout),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login').then(m => m.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register').then(m => m.RegisterComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ],
  },

  // PROTECTED (app shell)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/app-layout/app-layout').then(m => m.AppLayout),
    children: [
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects').then(m => m.Projects),
      },
      {
        path: 'projects/:projectId/board',
        loadComponent: () =>
          import('./pages/issues/issues').then(m => m.Issues),
      },

      // redirect old /issues route to projects (if user types it)
      { path: 'issues', redirectTo: 'projects', pathMatch: 'full' },

      { path: '', pathMatch: 'full', redirectTo: 'projects' },
    ],
  },

  { path: '**', redirectTo: 'projects' },
];