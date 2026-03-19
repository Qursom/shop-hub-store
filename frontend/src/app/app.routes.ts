import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

/**
 * Application routes (lazy-loaded standalone components).
 *
 * - `/login` is protected by {@link guestGuard} — redirects authenticated users to `/products`.
 * - `/products`, `/cart`, and `/checkout` are protected by {@link authGuard} — redirects
 *   unauthenticated users to `/login`.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/product-list/product-list').then((m) => m.ProductListComponent),
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./components/cart/cart').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./components/checkout/checkout').then((m) => m.CheckoutComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
