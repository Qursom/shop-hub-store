/**
 * Normalizes various API/network error shapes into a user-friendly message.
 */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const err = error as {
    status?: number;
    error?: {
      message?: string;
      error?: { message?: string };
    };
    message?: string;
  };

  if (err?.status === 0) {
    return 'Network error. Please check your internet connection and try again.';
  }

  return (
    err?.error?.error?.message ||
    err?.error?.message ||
    err?.message ||
    fallback
  );
}
