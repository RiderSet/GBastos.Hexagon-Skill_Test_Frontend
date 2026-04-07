import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('auth_token');
  const router = new Router();

  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};