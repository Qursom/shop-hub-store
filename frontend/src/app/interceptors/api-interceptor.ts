import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Logger } from '@app/utils/log';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * Functional HTTP interceptor applied to every outgoing request.
 *
 * Responsibilities:
 * - Attaches a `Bearer` authorization header when an auth token is present in localStorage
 * - Adds `X-Requested-With` and `Content-Type` default headers
 * - Logs outgoing requests and incoming responses in non-production environments
 * - Catches HTTP errors, normalizes the error message, and re-throws via `throwError`
 *
 * @param req - The outgoing HTTP request.
 * @param next - The next handler in the interceptor chain.
 * @returns Observable of the HTTP event stream.
 */
export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  // Attach token if available
  const token = localStorage.getItem('auth_token');
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Add default headers
  const headers: Record<string, string> = {
    'X-Requested-With': 'XMLHttpRequest',
  };

  // Only add Content-Type for requests with body
  if (req.method !== 'GET' && req.method !== 'DELETE') {
    headers['Content-Type'] = 'application/json';
  }

  authReq = authReq.clone({
    setHeaders: headers,
  });

  // Log request
  Logger.log(`API Request: ${authReq.method} ${authReq.url}`);

  return next(authReq).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        Logger.log(`API Response: ${event.status} ${event.url}`);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Server Error: ${error.status} ${error.statusText}`;
        if (error.error?.message) {
          errorMessage = error.error.message;
        }
      }

      Logger.error(errorMessage);
      return throwError(() => error);
    }),
  );
};
