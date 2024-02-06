import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const protectedRoutes: string[] = ['/user-list', '/user', '/post-list'];

  return protectedRoutes.includes(state.url) && !authService.isAuthenticatedFn()
    ? router.navigate(['/'])
    : true;
};
