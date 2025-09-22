import { authService } from '@/services/authService';
import { defineStore } from 'pinia';
import { router } from '@/router';
import { userService } from '@/services/userService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token') || null,
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
      const user = await authService.login(username, password);

      this.token = user.token;

      localStorage.setItem('token', user.token);
      // localStorage.setItem('user', JSON.stringify(user));

      const fullyUserData = await authService.getMe();
      localStorage.setItem('user', JSON.stringify(fullyUserData));
      this.user = fullyUserData;

      // redirect to previous url or default to home page
      router.push(this.returnUrl || {name: 'Dashboard'});
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      router.push({
        name: 'Login',
      });
    }
  },
  getters: {
    fullName: (state) => {
      return [state.user?.first_name, state.user?.last_name]
        .filter(Boolean)
        .join(' ')
    },
    avatarUrl: (state) => {
      return state.user?.photo_url ?? 'https://placehold.co/128x128.png';
    }
  }
});
