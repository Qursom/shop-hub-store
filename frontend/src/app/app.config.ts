import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { apiInterceptor } from './interceptors/api-interceptor';

/**
 * Root application configuration.
 *
 * Registers the following providers:
 * - `provideBrowserGlobalErrorListeners` — captures unhandled browser errors
 * - `provideRouter` — sets up client-side routing with the declared {@link routes}
 * - `provideHttpClient` — configures `HttpClient` with the {@link apiInterceptor}
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor])),
  ],
};
