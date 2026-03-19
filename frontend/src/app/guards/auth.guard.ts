import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/services/auth';

/**
 * Prevents unauthenticated users from accessing protected routes.
 * Redirects to `/login` if no auth token is found.
 *
 * @returns `true` to allow navigation, or a `UrlTree` redirecting to `/login`.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedInSync()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

/**
 * Prevents already-authenticated users from accessing the login page.
 * Redirects to `/products` if an auth token is present.
 *
 * @returns `true` to allow navigation, or a `UrlTree` redirecting to `/products`.
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedInSync()) {
    return true;
  }
  return router.createUrlTree(['/products']);
};
