import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CartItem } from '@app/models/cart';
import { ApiService } from './api';
import { getErrorMessage } from '@app/utils/http-error';

/**
 * Manages order operations and checkout flow.
 *
 * Features:
 * - Submit orders to the API
 * - Generate idempotency keys
 * - Handle idempotent requests
 * - Track order submission state
 *
 * Idempotency:
 * - Idempotency keys prevent duplicate orders if the same request is sent more than once.
 * - The API tracks these keys and returns the same response for duplicate requests.
 */
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiService = inject(ApiService);

  private submittingSubject = new BehaviorSubject<boolean>(false);

  /** Observable that emits `true` while an order submission is in progress. */
  public submitting$ = this.submittingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);

  /** Observable that emits the latest checkout error message, or `null` when there is none. */
  public error$ = this.errorSubject.asObservable();

  /**
   * Retrieves an idempotency key from the API.
   * Falls back to a locally generated UUID if the API call fails.
   *
   * @returns Observable that emits an object containing the `key` string and an ISO `timestamp`.
   */
  getIdempotencyKey(): Observable<{ key: string; timestamp: string }> {
    return this.apiService.get<{ key: string; timestamp: string }>('/keys').pipe(
      catchError(() => {
        // Graceful fallback: checkout can still proceed even if key endpoint is unavailable.
        const key = `local-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        return of({ key, timestamp: new Date().toISOString() });
      }),
    );
  }

  /**
   * Submits a checkout request to the API.
   * The idempotency key prevents the same order from being placed twice.
   *
   * @param cartItems - Array of {@link CartItem} objects to include in the order.
   * @param idempotencyKey - Unique key used to deduplicate the request on the server.
   * @returns Observable that emits the server's checkout confirmation payload.
   */
  checkout(
    cartItems: CartItem[],
    idempotencyKey: string,
  ): Observable<{
    message: string;
    key: string;
    subtotal: string;
    total: string;
    itemCount: number;
  }> {
    // Keep submission/error state in the service to simplify component logic and testing.
    this.submittingSubject.next(true);
    this.errorSubject.next(null);

    const payload = {
      key: idempotencyKey,
      items: cartItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    };

    return this.apiService.post<{
      message: string;
      key: string;
      subtotal: string;
      total: string;
      itemCount: number;
    }>('/checkout', payload).pipe(
      catchError((error) => {
        const message = getErrorMessage(error, 'Checkout failed. Please try again.');
        this.errorSubject.next(message);
        return throwError(() => error);
      }),
      finalize(() => this.submittingSubject.next(false)),
    );
  }

  /**
   * Clears the current checkout error message.
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
