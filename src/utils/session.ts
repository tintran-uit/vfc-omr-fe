import { router } from '@/router';

/** Admin token kept while an admin is switched into another user's account. */
export const IMPERSONATOR_TOKEN_KEY = 'impersonator_token';

/**
 * Clears persisted auth/session data and navigates to login.
 * Kept in a tiny util to avoid circular imports between `apiClient` <-> `authStore` <-> `authService`.
 */
export function clearSessionAndGoLogin() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('permissions');
  localStorage.removeItem('last_activity_at');
  localStorage.removeItem(IMPERSONATOR_TOKEN_KEY);

  // Path navigation avoids oddities when resolving named routes during transitions.
  router.replace('/auth/login');
}
