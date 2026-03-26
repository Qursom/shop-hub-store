import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APP_CONSTANTS } from '@app/constants/app.constants';
import { Cart } from '@app/models/cart';
import { CartService } from '@app/services/cart';

/**
 * Cart Component
 *
 * Displays:
 * - List of items in the cart
 * - Item prices and quantities
 * - Cart total (subtotal + tax)
 * - Options to update or remove items
 * - Empty cart message
 * - Continue shopping and checkout buttons
 */
@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  cart: Cart = { items: [], lastUpdated: new Date() };
  subtotal = 0;
  tax = 0;
  total = 0;
  taxRate = 0.1; // 10% tax
  readonly placeholder = APP_CONSTANTS.DEFAULT_PLACEHOLDER_URL;

  ngOnInit(): void {
    // TODO: Subscribe to cartService.cart$
    // On each emission update this.cart and call calculateTotals()
  }

  /**
   * TODO: Recalculate subtotal, tax (taxRate), and total from the current cart state.
   * Use cartService.getSubtotal() to get the subtotal.
   */
  private calculateTotals(): void {
    // TODO: Implement price calculations
  }

  /**
   * Removes a product from the cart.
   *
   * @param productId - ID of the product to remove.
   */
  removeItem(productId: string): void {
    // TODO: Implement remove item
  }

  /**
   * Updates the quantity of a cart item.
   * Removes the item if the quantity drops to zero or below.
   *
   * @param productId - ID of the product to update.
   * @param quantity - New desired quantity.
   */
  updateQuantity(productId: string, quantity: number): void {
    // TODO: If quantity <= 0, remove the item; otherwise update quantity
  }

  /**
   * Prompts the user for confirmation and clears all items from the cart.
   */
  clearCart(): void {
    // TODO: Confirm with the user, then clear cart
  }

  /**
   * Handles image load errors by falling back to the placeholder URL.
   *
   * @param event - The native error event from the `<img>` element.
   */
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.placeholder;
  }

  /**
   * Handles quantity input changes from the template.
   *
   * @param productId - ID of the product whose quantity is being changed.
   * @param event - The native change event from the `<input>` element.
   */
  onQuantityChange(productId: string, event: Event): void {
    // TODO: Parse the input value as a number and update quantity
  }
}
