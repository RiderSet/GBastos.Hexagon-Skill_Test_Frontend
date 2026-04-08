import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./usuarios').then(m => m.UsuariosComponent)
  }
];