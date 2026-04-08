import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
}

// ✅ Guard para rotas protegidas
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && !authService.isTokenExpired()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// ✅ Guard para rotas públicas (redireciona se autenticado)
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && !authService.isTokenExpired()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};