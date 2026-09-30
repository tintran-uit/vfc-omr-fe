import { authService } from '@/services/authService';
import { defineStore } from 'pinia';
import { router } from '@/router';
import { ROLE_ADMIN, ROLE_OVERSEER, ROLE_PASTOR_LEADER, ROLE_SUPER_ADMIN } from '@/constants/roleConstant';
import { clearSessionAndGoLogin, IMPERSONATOR_TOKEN_KEY } from '@/utils/session';
import { markUserActivity } from '@/services/idleLogoutService';
import { usePastorChurchStore } from '@/stores/pastorChurchStore';
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
  'relating.request-info',
  'faq.read',
  'church-planting.read',
  'church-planting.create',
  'church-planting.print',
  'church-planting.print-preview',
];

const overseerPermissions = [
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
  'faq.read',
  'watch-list.read',
  'watch-list.create',
  'watch-list.report',
]

const adminPermissions = [
  ...overseerPermissions,
  'user.delete',
  'user.switch',
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
  'languages.create',

  'faq.create',
  'faq.update',
  'faq.delete'
];

const superAdminPermissions = [
  ...adminPermissions
]

function permissionsForRole(roleId: number | undefined | null): string[] {
  if (roleId === ROLE_PASTOR_LEADER) {
    return [...pastorLeaderPermissions].map((p) => p.toLowerCase());
  }
  if (roleId === ROLE_OVERSEER) {
    return [...overseerPermissions].map((p) => p.toLowerCase());
  }
  if (roleId === ROLE_ADMIN) {
    return [...adminPermissions].map((p) => p.toLowerCase());
  }
  if (roleId === ROLE_SUPER_ADMIN) {
    return [...superAdminPermissions].map((p) => p.toLowerCase());
  }
  const raw = JSON.parse(localStorage.getItem('permissions') || '[]') as string[];
  return raw.map((p) => String(p).toLowerCase());
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const user = (() => {
      try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })() as Record<string, unknown> | null;
    const roleId = user?.role?.id;
    const permissions = permissionsForRole(roleId);
    if (user && permissions.length) {
      localStorage.setItem('permissions', JSON.stringify(permissions));
    }
    return {
      user,
      token: localStorage.getItem('token') || null,
      impersonatorToken: localStorage.getItem(IMPERSONATOR_TOKEN_KEY) || null,
      returnUrl: null,
      permissions,
      role: null,
    };
  },
  actions: {
    async login(username: string, password: string) {
      const user = await authService.login(username, password);

      this.token = user.token;
      this.impersonatorToken = null;

      localStorage.setItem('token', user.token);
      localStorage.removeItem(IMPERSONATOR_TOKEN_KEY);
      markUserActivity(true);
      // localStorage.setItem('user', JSON.stringify(user));

      const fullyUserData = await authService.getMe();
      localStorage.setItem('user', JSON.stringify(fullyUserData));
      this.user = fullyUserData;

      this.permissions = permissionsForRole(this.user?.role?.id);
      localStorage.setItem('permissions', JSON.stringify(this.permissions));

      import('@/services/firebaseMessagingService').then(({ syncWebPushIfGranted }) => {
        syncWebPushIfGranted();
      });

      // redirect to previous url or default to home page
      router.push(this.returnUrl || {name: 'Dashboard'});
    },
    async applyToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
      markUserActivity(true);

      const fullyUserData = await authService.getMe();
      localStorage.setItem('user', JSON.stringify(fullyUserData));
      this.user = fullyUserData;

      this.permissions = permissionsForRole(this.user?.role?.id);
      localStorage.setItem('permissions', JSON.stringify(this.permissions));
      usePastorChurchStore().clearSelectedChurchId();
    },
    async switchToUser(targetUserId: number | string) {
      const result = await authService.switchUser(targetUserId);
      if (!result?.token) return;

      // Keep the very first admin token if the admin switches more than once.
      if (!this.impersonatorToken) {
        const adminToken = result.original_token || this.token;
        this.impersonatorToken = adminToken;
        localStorage.setItem(IMPERSONATOR_TOKEN_KEY, adminToken);
      }

      await this.applyToken(result.token);
      router.push({ name: 'Dashboard' });
    },
    async switchBack() {
      const adminToken = this.impersonatorToken;
      if (!adminToken) return;

      this.impersonatorToken = null;
      localStorage.removeItem(IMPERSONATOR_TOKEN_KEY);

      await this.applyToken(adminToken);
      router.push({ name: 'UserList' });
    },
    logout() {
      this.user = null;
      this.token = null;
      this.impersonatorToken = null;
      this.permissions = []
      this.returnUrl = null;
      usePastorChurchStore().clearSelectedChurchId();
      clearSessionAndGoLogin();
    },
    can(permissions: string | string[]) {
      if (!this.permissions) return false;
    
      if (Array.isArray(permissions)) {
        return permissions.some(p => this.permissions.includes(String(p).toLowerCase()));
      }
    
      return this.permissions.includes(String(permissions).toLowerCase());
    },
    // isRoleAdmin() {
    //   return this.user?.role?.id === ROLE_ADMIN;
    // },
    // isRoleOverseer() {
    //   return this.user?.role?.id === ROLE_OVERSEER;
    // },
    // isRolePastorLeader() {
    //   return this.user?.role?.id === ROLE_PASTOR_LEADER;
    // },
    // isRoleSuperAdmin() {
    //   return this.user?.role?.id === ROLE_SUPER_ADMIN;
    // }
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
    isImpersonating: (state) => !!state.impersonatorToken,
    countryId: (state) => {
      return state.user?.country_id || null;
    },
    isRoleAdmin: (state) => {
      return state.user?.role?.id === ROLE_ADMIN;
    },
    isRoleOverseer: (state) => {
      return state.user?.role?.id === ROLE_OVERSEER;
    },
    isRolePastorLeader: (state) => {
      return state.user?.role?.id === ROLE_PASTOR_LEADER;
    },
    isRoleSuperAdmin: (state) => {
      return state.user?.role?.id === ROLE_SUPER_ADMIN;
    }
  }
});
