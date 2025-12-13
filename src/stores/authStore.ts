import { authService } from '@/services/authService';
import { defineStore } from 'pinia';
import { router } from '@/router';
import { userService } from '@/services/userService';
import { ROLE_ADMIN, ROLE_OVERSEER, ROLE_PASTOR_LEADER, ROLE_SUPER_ADMIN } from '@/constants/roleConstant';
const pastorLeaderPermissions = [
  'user.read',
  'user.create',
  'user.update',
  'church.read',
  'church.update',
  'church.create',
  'report.church',
  'report.church-status',
  'resource.read',
  'relating.update',
  'faq.read'
];

const overseerPermissions = [
  ...pastorLeaderPermissions,
  'watch-list.read',
  'watch-list.create',
  'watch-list.report',
]

const adminPermissions = [
  ...overseerPermissions,
  'user.delete',
  'church.clone',
  'church.disable',
  'church.enable',
  'church.delete',
  'user.read-overseer',

  'church-networks.read',
  'church-networks.create',
  'church-types.read',
  'church-types.create',
  'church-regions.read',
  'church-regions.create',
  'geographical-regions.read',
  'geographical-regions.create',
  'language-regions.read',
  'language-regions.create',
  'countries.read',
  'countries.create',
  'languages.read',
  'languages.create'
];

const superAdminPermissions = [
  ...adminPermissions
]

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token') || null,
    returnUrl: null,
    permissions: JSON.parse(localStorage.getItem('permissions') || '[]') as string[],
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

      // set permissions based on role
      if (this.user?.role?.id === ROLE_PASTOR_LEADER) {
        this.permissions = pastorLeaderPermissions;
      } else if (this.user?.role?.id === ROLE_OVERSEER) {
        this.permissions = overseerPermissions;
      } else if (this.user?.role?.id === ROLE_ADMIN) {
        this.permissions = adminPermissions
      }
      localStorage.setItem('permissions', JSON.stringify(this.permissions));

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
    },
    can(permissions: string | string[]) {
      if (!this.permissions) return false;
    
      if (Array.isArray(permissions)) {
        return permissions.some(p => this.permissions.includes(p.toLowerCase()));
      }
    
      return this.permissions.includes(permissions.toLowerCase());
    },
    isRoleAdmin() {
      return this.user?.role?.id === ROLE_ADMIN;
    },
    isRoleOverseer() {
      return this.user?.role?.id === ROLE_OVERSEER;
    },
    isRolePastorLeader() {
      return this.user?.role?.id === ROLE_PASTOR_LEADER;
    },
    isRoleSuperAdmin() {
      return this.user?.role?.id === ROLE_SUPER_ADMIN;
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
    },
    countryId: (state) => {
      return state.user?.country_id || null;
    },
  }
});
