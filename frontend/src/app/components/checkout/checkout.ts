import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '@app/services/cart';
import { OrderService } from '@app/services/order';
import { getErrorMessage } from '@app/utils/http-error';

/**
 * Checkout Component
 *
 * Displays:
 * - Customer information form (name, email, address)
 * - Order summary with subtotal, tax, and total
 * - Submit order button
 * - Order confirmation message
 *
 * Features:
 * - Reactive form with validation
 * - Error handling with retry support
 * - Idempotent order submission via server-issued or locally generated keys
 */
@Component({
  selector: 'app-checkout',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  checkoutForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(5)]],
  });

  cartSubtotal = 0;
  cartTax = 0;
  cartTotal = 0;
  isSubmitting = false;
  submitError: string | null = null;
  orderPlaced = false;
  idempotencyKey: string | null = null;
  formNotice: string | null = null;

  get cartItemCount(): number {
    return this.cartService.getCart().items.reduce((sum, item) => sum + item.quantity, 0);
  }

  ngOnInit(): void {
    this.calculateTotals();
    this.getIdempotencyKey();
  }

  /**
   * Calculates checkout summary values (subtotal, tax, total).
   */
  private calculateTotals(): void {
    this.cartSubtotal = this.cartService.getSubtotal();
    this.cartTax = this.cartSubtotal * 0.1;
    this.cartTotal = this.cartSubtotal + this.cartTax;
  }

  /**
   * Retrieves an idempotency key from the API and falls back to a local key on error.
   */
  private getIdempotencyKey(): void {
    this.orderService.getIdempotencyKey().subscribe({
      next: (response) => {
        this.idempotencyKey = response.key;
        this.cdr.detectChanges();
      },
      error: () => {
        this.idempotencyKey = this.generateLocalKey();
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Validates input and cart state, then submits the order.
   */
  submitOrder(): void {
    if (this.checkoutForm.invalid) {
      // Surface validation errors immediately for better form UX.
      this.checkoutForm.markAllAsTouched();
      this.formNotice = 'Please fix the highlighted fields before placing your order.';
      return;
    }

    const cart = this.cartService.getCart();
    if (cart.items.length === 0) {
      this.submitError = 'Your cart is empty.';
      this.formNotice = null;
      return;
    }

    if (!this.idempotencyKey) {
      this.submitError = 'Unable to submit order. Please try again.';
      this.formNotice = null;
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;
    this.formNotice = null;

    this.orderService.checkout(cart.items, this.idempotencyKey).subscribe({
      next: () => {
        this.orderPlaced = true;
        this.isSubmitting = false;
        // Cart is the source of checkout totals, so clear it on successful order placement.
        this.cartService.clearCart();
        this.cdr.detectChanges();
        setTimeout(() => {
          // Redirect after a short delay so users can see confirmation feedback.
          this.router.navigate(['/products']);
        }, 1500);
      },
      error: (error) => {
        this.submitError = getErrorMessage(error, 'Failed to place your order.');
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Clears the current submission error and re-fetches an idempotency key
   * so the user can try submitting the order again.
   */
  retryOrder(): void {
    this.submitError = null;
    this.formNotice = null;
    this.getIdempotencyKey();
  }

  /**
   * Generates a local fallback idempotency key using the current timestamp and random suffix.
   *
   * @returns A unique string in the format `{timestamp}-{random}`.
   */
  private generateLocalKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}
