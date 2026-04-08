import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
    canActivate: [publicGuard],  // ✅ publicGuard, não authGuard
    data: { title: 'Login' }
  },

  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent),
    canActivate: [publicGuard],  // ✅ publicGuard, não authGuard
    data: { title: 'Registrar' }
  },

  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent),
    canActivate: [publicGuard],  // ✅ publicGuard, não authGuard
    data: { title: 'Recuperar Senha' }
  },

  {
    path: 'reset-password/:token',
    loadComponent: () => import('./features/auth/reset-password/reset-password').then(m => m.ResetPasswordComponent),
    canActivate: [publicGuard],  // ✅ publicGuard, não authGuard
    data: { title: 'Redefinir Senha' }
  },

  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboards/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard],  // ✅ authGuard
    data: { title: 'Dashboard' }
  },

  {
    path: 'usuarios',
    canActivate: [authGuard],  // ✅ authGuard
    loadChildren: () => import('./features/usuarios/usuarios.routes').then(m => m.USERS_ROUTES)
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];