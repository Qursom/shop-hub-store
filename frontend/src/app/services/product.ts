import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '@app/models/product';
import { ApiService } from './api';

/**
 * Manages product data and operations.
 *
 * Responsibilities:
 * - Fetch products from the API
 * - Cache product data via BehaviorSubjects
 * - Expose reactive loading and error states
 * - Handle product-related errors
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiService = inject(ApiService);

  private productsSubject = new BehaviorSubject<Product[]>([]);

  /** Observable that emits the current list of products. */
  public products$ = this.productsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);

  /** Observable that emits `true` while a product fetch is in progress. */
  public loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);

  /** Observable that emits the latest error message, or `null` when there is none. */
  public error$ = this.errorSubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);

  /** Observable that emits the total number of products available on the server. */
  public total$ = this.totalSubject.asObservable();

  /**
   * Fetches a page of products from the API and updates the reactive state subjects.
   *
   * @param page - 1-based page number to fetch (default: `1`).
   * @param pageSize - Number of products per page (default: `10`).
   * @returns Observable that emits the fetched {@link Product} array for the requested page.
   */
  getProducts(page = 1, pageSize = 10): Observable<Product[]> {
    // TODO: Implement product fetching
    // - Set loading state to true and clear any existing error
    // - Call GET /products?page={page}&pageSize={pageSize} via apiService
    // - On success: update productsSubject, totalSubject, set loading to false
    // - On error: set a meaningful error message, set loading to false, return empty array
    throw new Error('Not implemented');
  }

  /**
   * Fetches a single product by its ID.
   *
   * @param id - The unique identifier of the product to retrieve.
   * @returns Observable that emits the matching {@link Product}.
   */
  getProductById(id: string): Observable<Product> {
    // TODO: Implement single product fetch
    // - Call GET /products/{id} via apiService
    // - Handle errors gracefully
    throw new Error('Not implemented');
  }

  /**
   * Returns the current product list synchronously from the cached state.
   *
   * @returns The last emitted array of {@link Product} objects.
   */
  getProductsSync(): Product[] {
    // TODO: Return the current value from productsSubject
    return [];
  }

  /**
   * Clears the current error message from the error state.
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
