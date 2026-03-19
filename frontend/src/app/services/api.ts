import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

/**
 * Handles all HTTP communication with the backend.
 *
 * Inject this service into components or other services to make HTTP requests.
 * The base URL is configured via `environment.apiBaseUrl`.
 *
 * @example
 * ```typescript
 * this.apiService.get<Product[]>('/products').subscribe(products => {
 *   this.products = products;
 * });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private baseUrl = environment.apiBaseUrl;

  /**
   * Sends a GET request to the given endpoint.
   *
   * @param endpoint - Path relative to the API base URL (e.g. `'/products'`).
   * @returns Observable that emits the response body typed as `T`.
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * Sends a POST request to the given endpoint.
   *
   * @param endpoint - Path relative to the API base URL (e.g. `'/checkout'`).
   * @param data - Request body to send.
   * @returns Observable that emits the response body typed as `T`.
   */
  post<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Sends a PUT request to the given endpoint.
   *
   * @param endpoint - Path relative to the API base URL.
   * @param data - Request body to send.
   * @returns Observable that emits the response body typed as `T`.
   */
  put<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Sends a DELETE request to the given endpoint.
   *
   * @param endpoint - Path relative to the API base URL.
   * @returns Observable that emits the response body typed as `T`.
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
