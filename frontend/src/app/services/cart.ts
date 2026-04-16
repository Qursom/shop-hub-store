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
    if (!product?.id || quantity <= 0) {
      return;
    }

    const cart = this.getCart();
    const existingItem = cart.items.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.updateCart({ ...cart, items: [...cart.items] });
      return;
    }

    this.updateCart({
      ...cart,
      items: [...cart.items, { product, quantity }],
    });
  }

  /**
   * Removes a product from the cart entirely.
   *
   * @param productId - ID of the product to remove.
   */
  removeItem(productId: string): void {
    const cart = this.getCart();
    this.updateCart({
      ...cart,
      items: cart.items.filter((item) => item.product.id !== productId),
    });
  }

  /**
   * Updates the quantity of a product already in the cart.
   * Removes the item if the quantity is set to zero or below.
   *
   * @param productId - ID of the product to update.
   * @param quantity - New quantity for the product.
   */
  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const cart = this.getCart();
    const updatedItems = cart.items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );

    this.updateCart({
      ...cart,
      items: updatedItems,
    });
  }

  /**
   * Removes all items from the cart.
   */
  clearCart(): void {
    this.updateCart({
      items: [],
      lastUpdated: new Date(),
    });
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
    return this.getCart().items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Returns the cart subtotal before tax or shipping.
   *
   * @returns Subtotal as a number (price × quantity summed across all items).
   */
  getSubtotal(): number {
    return this.getCart().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  /**
   * Returns the cart total inclusive of tax.
   *
   * @param taxRate - Tax rate as a decimal (e.g. `0.1` for 10%). Defaults to `0`.
   * @returns Total amount including the applied tax.
   */
  getTotalWithTax(taxRate = 0): number {
    const subtotal = this.getSubtotal();
    return subtotal + subtotal * taxRate;
  }

  /**
   * Updates the in-memory cart state and persists it to localStorage.
   *
   * @param cart - The updated cart to save.
   */
  private updateCart(cart: Cart): void {
    const updatedCart: Cart = {
      ...cart,
      lastUpdated: new Date(),
    };
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  /**
   * Loads the cart from localStorage, returning an empty cart if none exists.
   *
   * @returns The persisted {@link Cart}, or a fresh empty cart.
   */
  private loadCartFromStorage(): Cart {
    const emptyCart: Cart = { items: [], lastUpdated: new Date() };
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return emptyCart;
    }

    try {
      const parsed = JSON.parse(storedCart) as Cart;
      return {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : new Date(),
      };
    } catch {
      return emptyCart;
    }
  }

  /**
   * Serializes and saves the cart to localStorage.
   *
   * @param cart - The cart to persist.
   */
  private saveCartToStorage(cart: Cart): void {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }
}
