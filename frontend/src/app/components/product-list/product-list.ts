import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { APP_CONSTANTS } from '@app/constants/app.constants';
import { Product } from '@app/models/product';
import { CartService } from '@app/services/cart';
import { ProductService } from '@app/services/product';

/**
 * Product List Component
 *
 * Displays:
 * - Paginated grid of product cards (10 per page)
 * - Product details (image, name, category, price, description)
 * - Add to cart button per product
 * - Loading spinner while data is being fetched
 * - Error banner with a retry option
 * - Pagination controls (previous / next with page indicator)
 */
@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  products: Product[] = [];
  loading = false;
  error: string | null = null;
  readonly placeholder = APP_CONSTANTS.DEFAULT_PLACEHOLDER_URL;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  /** Total number of pages based on `totalItems` and `pageSize`. */
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  ngOnInit(): void {
    this.initializeSubscriptions();
    this.loadProducts();
  }

  /**
   * TODO: Subscribe to productService.products$, loading$, error$, and total$
   * for the lifetime of the component (use takeUntilDestroyed).
   * On each emission update the corresponding local property and call cdr.detectChanges().
   */
  private initializeSubscriptions(): void {
    // TODO: Set up subscriptions to:
    // - productService.products$ → update this.products
    // - productService.loading$ → update this.loading
    // - productService.error$ → update this.error
    // - productService.total$ → update this.totalItems
  }

  /**
   * TODO: Trigger an API call to fetch the current page of products.
   * Use this.productService.getProducts(this.currentPage, this.pageSize).
   */
  private loadProducts(): void {
    // TODO: Call productService.getProducts() and subscribe
  }

  /**
   * Navigates to the given page and reloads the product list.
   *
   * @param page - The 1-based page number to navigate to.
   */
  goToPage(page: number): void {
    // TODO: Validate page bounds (must be between 1 and totalPages and not the current page)
    // Update this.currentPage and call loadProducts()
  }

  /**
   * Adds one unit of the given product to the shopping cart.
   *
   * @param product - The product to add to the cart.
   */
  addToCart(product: Product): void {
    // TODO: Call cartService.addItem() with the product and quantity 1
    // (This is the integration point between Task 1 – Product Listing and Task 2 – Cart System)
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
   * Clears the current error and re-fetches the product list from page 1.
   */
  retry(): void {
    // TODO: Reset currentPage to 1, clear the error via productService.clearError(),
    // then call loadProducts()
  }
}
