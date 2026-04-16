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
  addToCartNotice: string | null = null;
  private addToCartNoticeTimeout?: ReturnType<typeof setTimeout>;

  /** Total number of pages based on `totalItems` and `pageSize`. */
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  ngOnInit(): void {
    this.initializeSubscriptions();
    this.loadProducts();
  }

  /**
   * Subscribes to product data/state streams for the component lifetime and
   * mirrors those values into local view-model properties.
   */
  private initializeSubscriptions(): void {
    this.productService.products$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        this.products = products;
        this.cdr.detectChanges();
      });

    this.productService.loading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loading) => {
        this.loading = loading;
        this.cdr.detectChanges();
      });

    this.productService.error$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((error) => {
        this.error = error;
        this.cdr.detectChanges();
      });

    this.productService.total$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((total) => {
        this.totalItems = total;
        this.cdr.detectChanges();
      });
  }

  /**
   * Loads products for the current page and page size.
   */
  private loadProducts(): void {
    this.productService
      .getProducts(this.currentPage, this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * Navigates to the given page and reloads the product list.
   *
   * @param page - The 1-based page number to navigate to.
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.loadProducts();
  }

  /**
   * Adds one unit of the given product to the shopping cart.
   *
   * @param product - The product to add to the cart.
   */
  addToCart(product: Product): void {
    const showNotice = (message: string): void => {
      // Centralized notice helper keeps success/error feedback behavior consistent.
      this.addToCartNotice = message;
      if (this.addToCartNoticeTimeout) {
        // Ensure only one active timer so rapid clicks do not stack stale messages.
        clearTimeout(this.addToCartNoticeTimeout);
      }
      this.addToCartNoticeTimeout = setTimeout(() => {
        this.addToCartNotice = null;
        this.cdr.detectChanges();
      }, 2000);
      this.cdr.detectChanges();
    };

    if ((product.stock ?? 0) <= 0) {
      showNotice(`${product.name} is currently out of stock.`);
      return;
    }

    // Keep cart state management inside CartService (single source of truth).
    this.cartService.addItem(product, 1);
    showNotice(`${product.name} added to cart.`);
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
    this.currentPage = 1;
    this.productService.clearError();
    this.loadProducts();
  }
}
