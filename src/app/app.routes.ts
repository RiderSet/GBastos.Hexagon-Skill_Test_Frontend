import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./features/usuarios/usuarios')
        .then(m => m.UsuariosComponent),
    canActivate: [authGuard]
  }
];