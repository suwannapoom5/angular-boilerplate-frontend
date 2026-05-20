
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  let authSrv: AuthService = inject(AuthService);
  let router: Router = inject(Router);

  if (await authSrv.isLoggedin()) {
    return true
  }

  router.navigateByUrl('/login');
  return false;
};
