import { router } from '@/router';

/**
 * Clears persisted auth/session data and navigates to login.
 * Kept in a tiny util to avoid circular imports between `apiClient` <-> `authStore` <-> `authService`.
 */
export function clearSessionAndGoLogin() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('permissions');

  // Path navigation avoids oddities when resolving named routes during transitions.
  router.replace('/auth/login');
}
