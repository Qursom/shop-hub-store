import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Manages user authentication state.
 *
 * Features:
 * - Track login/logout status
 * - Provide observable for real-time auth state updates
 * - Manage auth token in localStorage
 *
 * @example
 * ```typescript
 * this.authService.isLoggedIn$.subscribe(loggedIn => {
 *   this.showLoginButton = !loggedIn;
 * });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkToken());

  /** Observable that emits the current login status whenever it changes. */
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  /**
   * Checks whether an auth token exists in localStorage.
   *
   * @returns `true` if a token is present, `false` otherwise.
   */
  private checkToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Persists the auth token and marks the user as logged in.
   *
   * @param token - The access token returned by the login API.
   */
  setLoggedIn(token: string): void {
    localStorage.setItem('auth_token', token);
    this.isLoggedInSubject.next(true);
  }

  /**
   * Removes the auth token and marks the user as logged out.
   */
  setLoggedOut(): void {
    localStorage.removeItem('auth_token');
    this.isLoggedInSubject.next(false);
  }

  /**
   * Returns the current login status synchronously.
   * Use `isLoggedIn$` for reactive updates; use this only when a one-shot check is needed.
   *
   * @returns `true` if the user is currently logged in, `false` otherwise.
   */
  isLoggedInSync(): boolean {
    return this.checkToken();
  }

  /**
   * Returns the stored auth token.
   *
   * @returns The token string, or `null` if the user is not logged in.
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
