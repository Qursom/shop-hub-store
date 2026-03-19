import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '@app/models/cart';
import { ApiService } from './api';

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
    // TODO: Implement idempotency key retrieval
    // - Call GET /keys via apiService
    // - On error, fall back to a locally generated unique key
    //   (e.g. a UUID or timestamp-based string) so checkout can still proceed
    throw new Error('Not implemented');
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
    // TODO: Implement checkout
    // - Set submitting state to true and clear any existing error
    // - Build a checkout payload: { key: idempotencyKey, items: [...] }
    //   where each item has { id, name, price }
    // - Call POST /checkout via apiService
    // - On success: set submitting to false
    // - On error: set a meaningful error message, set submitting to false, and rethrow
    throw new Error('Not implemented');
  }

  /**
   * Clears the current checkout error message.
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
