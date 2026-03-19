import { Product } from './product';

/**
 * Represents a single line item in the shopping cart.
 *
 * @property product - The product added to the cart.
 * @property quantity - Number of units of the product.
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Represents the current state of the shopping cart.
 *
 * @property items - List of items currently in the cart.
 * @property lastUpdated - Timestamp of the most recent cart modification.
 */
export interface Cart {
  items: CartItem[];
  lastUpdated: Date;
}
