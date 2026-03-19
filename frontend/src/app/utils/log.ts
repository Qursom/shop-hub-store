import { environment } from '@environments/environment';

/**
 * Logger utility that wraps the native console API.
 *
 * - `error` always outputs regardless of environment.
 * - All other methods (`log`, `warn`, `info`, `debug`) are no-ops in production.
 */
export const Logger = {
  /**
   * Logs informational messages to the console.
   * No-op in production.
   *
   * @param args - One or more values to log.
   */
  log: (...args: unknown[]): void => {
    if (!environment.production) {
      console.log(...args);
    }
  },

  /**
   * Logs error messages to the console.
   * Always active regardless of environment.
   *
   * @param args - One or more values describing the error.
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },

  /**
   * Logs warning messages to the console.
   * No-op in production.
   *
   * @param args - One or more values describing the warning.
   */
  warn: (...args: unknown[]): void => {
    if (!environment.production) {
      console.warn(...args);
    }
  },

  /**
   * Logs informational messages at the info level to the console.
   * No-op in production.
   *
   * @param args - One or more values to log.
   */
  info: (...args: unknown[]): void => {
    if (!environment.production) {
      console.info(...args);
    }
  },

  /**
   * Logs verbose debug messages to the console.
   * No-op in production.
   *
   * @param args - One or more values to log.
   */
  debug: (...args: unknown[]): void => {
    if (!environment.production) {
      console.debug(...args);
    }
  },
};
