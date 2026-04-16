import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { Product } from '@app/models/product';
import { ApiService } from './api';
import { getErrorMessage } from '@app/utils/http-error';

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
    // Expose request lifecycle states so components stay declarative.
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.apiService
      .get<{ items: Product[]; total: number }>(`/products?page=${page}&pageSize=${pageSize}`)
      .pipe(
        tap((response) => {
          // Cache API data in subjects to support both reactive and sync consumers.
          this.productsSubject.next(response.items ?? []);
          this.totalSubject.next(response.total ?? 0);
        }),
        map((response) => response.items ?? []),
        catchError((error) => {
          // Normalize backend/network errors into UI-friendly messages.
          this.errorSubject.next(getErrorMessage(error, 'Failed to load products. Please try again.'));
          this.productsSubject.next([]);
          this.totalSubject.next(0);
          return of([]);
        }),
        finalize(() => this.loadingSubject.next(false)),
      );
  }

  /**
   * Fetches a single product by its ID.
   *
   * @param id - The unique identifier of the product to retrieve.
   * @returns Observable that emits the matching {@link Product}.
   */
  getProductById(id: string): Observable<Product> {
    return this.apiService.get<Product>(`/products/${id}`).pipe(
      catchError((error) => {
        const message = getErrorMessage(error, 'Failed to load product details.');
        this.errorSubject.next(message);
        return throwError(() => new Error(message));
      }),
    );
  }

  /**
   * Returns the current product list synchronously from the cached state.
   *
   * @returns The last emitted array of {@link Product} objects.
   */
  getProductsSync(): Product[] {
    return this.productsSubject.value;
  }

  /**
   * Clears the current error message from the error state.
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
