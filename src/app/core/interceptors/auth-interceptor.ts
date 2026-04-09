import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap } from 'rxjs';

/**
 * Interceptador HTTP para:
 * 1. Adicionar token JWT em todas as requisições
 * 2. Renovar token automaticamente se expirado
 * 3. Redirecionar para login em caso de 401
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // URLs públicas (não exigem token)
  const publicUrls = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password'
  ];
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  // Adicionar token se existir e não for URL pública
  let authReq = req;
  if (!isPublicUrl) {
    const token = authService.getToken();
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Token expirado → tenta refresh
      if (error.status === 401 && !isPublicUrl) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = authService.getToken();
            if (newToken) {
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(retryReq);
            }
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => error);
          }),
          catchError(() => {
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }

      // 401 sem refresh → volta para login
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }

      // 403 → acesso negado
      if (error.status === 403) {
        router.navigate(['/unauthorized']);
      }

      return throwError(() => error);
    })
  );
};