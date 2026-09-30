import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    title: 'RubyFlow · Home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'board',
    title: 'RubyFlow · Task Board',
    loadComponent: () => import('./features/board/board').then((m) => m.Board),
  },
  {
    path: 'people',
    title: 'RubyFlow · People',
    loadComponent: () => import('./features/people/people').then((m) => m.People),
  },
  {
    path: 'projects',
    title: 'RubyFlow · Projects',
    loadComponent: () => import('./features/projects/projects').then((m) => m.Projects),
  },
  // Legacy URL from the original app
  { path: 'tasks', redirectTo: 'board' },
  { path: '**', redirectTo: 'home' },
];
