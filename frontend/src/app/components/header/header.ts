import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Cart } from '@app/models/cart';
import { AuthService } from '@app/services/auth';
import { CartService } from '@app/services/cart';

/**
 * Header Component
 *
 * Displays:
 * - Application name/logo
 * - Navigation links
 * - Cart icon with live item counter
 * - Login/logout controls reflecting the current auth state
 */
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  /** Total number of units currently in the cart. */
  cartItemCount = 0;

  /** Whether the user is currently logged in. */
  isLoggedIn = false;

  ngOnInit(): void {
    // TODO: Subscribe to cartService.cart$
    // On each emission calculate the total item count (sum of all item quantities)
    // and assign it to this.cartItemCount

    // Auth subscription — already wired up for you
    this.authService.isLoggedIn$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
        this.cdr.detectChanges();
      });
  }

  /**
   * Logs the user out and redirects to the login page.
   */
  logout(): void {
    this.authService.setLoggedOut();
    this.router.navigate(['/login']);
  }
}
