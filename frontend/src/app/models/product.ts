/**
 * Represents a product available in the shop.
 *
 * @property id - Unique product identifier.
 * @property name - Display name of the product.
 * @property description - Full product description.
 * @property price - Price in the product's currency.
 * @property currency - ISO currency code (e.g. `"USD"`).
 * @property stock - Available stock quantity. Omitted when stock tracking is disabled.
 * @property category - Optional category label for grouping products.
 * @property imageUrl - URL of the product image.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock?: number;
  category?: string;
  imageUrl: string;
}
