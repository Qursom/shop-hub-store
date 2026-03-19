import { Injectable } from '@angular/core';
import { Cart } from '@app/models/cart';
import { Product } from '@app/models/product';
import { BehaviorSubject } from 'rxjs';

const CART_STORAGE_KEY = 'shopping-cart';

/**
 * Manages shopping cart state and operations.
 *
 * Features:
 * - Add/remove items from cart
 * - Update item quantities
 * - Persist cart to localStorage
 * - Provide observable cart state
 * - Calculate cart totals
 *
 * Note: All cart operations must be handled entirely on the client side.
 * Do not make API calls for cart operations — manage all state locally
 * using localStorage or an in-memory state service.
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(this.loadCartFromStorage());

  /** Observable that emits the current cart state whenever it changes. */
  public cart$ = this.cartSubject.asObservable();

  /**
   * Adds a product to the cart, or increments its quantity if it already exists.
   *
   * @param product - The product to add.
   * @param quantity - Number of units to add. Defaults to `1`.
   */
  addItem(product: Product, quantity = 1): void {
    // TODO: Implement add to cart
    // - Get the current cart from cartSubject
    // - If the product already exists in the cart, increment its quantity
    // - Otherwise push a new item { product, quantity }
    // - Call updateCart() to persist and emit the new state
  }

  /**
   * Removes a product from the cart entirely.
   *
   * @param productId - ID of the product to remove.
   */
  removeItem(productId: string): void {
    // TODO: Implement remove from cart
    // - Filter out the item matching productId
    // - Call updateCart() to persist and emit the new state
  }

  /**
   * Updates the quantity of a product already in the cart.
   * Removes the item if the quantity is set to zero or below.
   *
   * @param productId - ID of the product to update.
   * @param quantity - New quantity for the product.
   */
  updateQuantity(productId: string, quantity: number): void {
    // TODO: Implement quantity update
    // - Find the item matching productId
    // - If quantity <= 0, remove the item
    // - Otherwise update the quantity and call updateCart()
  }

  /**
   * Removes all items from the cart.
   */
  clearCart(): void {
    // TODO: Clear all cart items and call updateCart()
  }

  /**
   * Returns the current cart snapshot synchronously.
   *
   * @returns The current {@link Cart} object.
   */
  getCart(): Cart {
    return this.cartSubject.value;
  }

  /**
   * Returns the total number of units across all cart items.
   *
   * @returns Sum of quantities for all items in the cart.
   */
  getTotalItems(): number {
    // TODO: Calculate and return the total item count (sum of all quantities)
    return 0;
  }

  /**
   * Returns the cart subtotal before tax or shipping.
   *
   * @returns Subtotal as a number (price × quantity summed across all items).
   */
  getSubtotal(): number {
    // TODO: Calculate and return the subtotal (price * quantity for each item)
    return 0;
  }

  /**
   * Returns the cart total inclusive of tax.
   *
   * @param taxRate - Tax rate as a decimal (e.g. `0.1` for 10%). Defaults to `0`.
   * @returns Total amount including the applied tax.
   */
  getTotalWithTax(taxRate = 0): number {
    // TODO: Return subtotal + (subtotal * taxRate)
    return 0;
  }

  /**
   * Updates the in-memory cart state and persists it to localStorage.
   *
   * @param cart - The updated cart to save.
   */
  private updateCart(cart: Cart): void {
    // TODO: Set cart.lastUpdated to new Date(), emit via cartSubject, and persist to storage
  }

  /**
   * Loads the cart from localStorage, returning an empty cart if none exists.
   *
   * @returns The persisted {@link Cart}, or a fresh empty cart.
   */
  private loadCartFromStorage(): Cart {
    // TODO: Read CART_STORAGE_KEY from localStorage and parse it
    // Return { items: [], lastUpdated: new Date() } if nothing is stored
    return { items: [], lastUpdated: new Date() };
  }

  /**
   * Serialises and saves the cart to localStorage.
   *
   * @param cart - The cart to persist.
   */
  private saveCartToStorage(cart: Cart): void {
    // TODO: Stringify and save the cart under CART_STORAGE_KEY in localStorage
  }
}
