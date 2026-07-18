import { watch } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuthStore } from '@/stores/authStore';
import ComponentRoutes from './ComponentRoutes';
import { useUIStore } from '@/stores/ui';
import { i18n } from '@/i18n';
import { applyDocumentTitle } from '@/utils/pageTitle';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue'),
      meta: { title: 'pageTitle.notFound' }
    },
    PublicRoutes,
    MainRoutes,
    ComponentRoutes
  ]
});

// router.beforeEach(async (to, from, next) => {
//   // redirect to login page if not logged in and trying to access a restricted page
//   const publicPages = ['/'];
//   const authStore = useAuthStore();

//   const isPublicPage = publicPages.includes(to.path);
//   const authRequired = !isPublicPage && to.matched.some((record) => record.meta.requiresAuth);

//   // User not logged in and trying to access a restricted page
//   if (authRequired && !authStore.user) {
//     authStore.returnUrl = to.fullPath; // Save the intended page
//     next({ name: 'login' })
//   } else if (authStore.user && to.path === '/login') {
//     // User logged in and trying to access the login page
//     next({
//       query: {
//         ...to.query,
//         redirect: authStore.returnUrl !== '/' ? to.fullPath : undefined
//       }
//     });
//   } else {
//     // All other scenarios, either public page or authorized access
//     next();
//   }
// });

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const uiStore = useUIStore();
  uiStore.isLoading = true;

  const authRequired = to.matched.some(record => record.meta.requiresAuth);

  if (authRequired && !authStore.user) {
    authStore.returnUrl = to.fullPath;
    return next('/auth/login');
  }

  if (authStore.user && to.name === 'Login') {
    return next('/dashboard');
  }

  const withRoutePermissions = to.matched
    .slice()
    .reverse()
    .find((r) => (r.meta as { permissions?: string[] })?.permissions);
  const routePerms = (withRoutePermissions?.meta as { permissions?: string[] })?.permissions;
  if (routePerms?.length && authStore.user) {
    const allowed = routePerms.every((p) => authStore.can(p));
    if (!allowed) {
      return next({ name: 'Dashboard' });
    }
  }

  next();
});

// router.beforeEach(() => {
//   const uiStore = useUIStore();
//   uiStore.isLoading = true;
//   // uiStore.startAPICall();
// });

router.afterEach((to) => {
  const uiStore = useUIStore();
  uiStore.isLoading = false;
  // uiStore.endAPICall();

  applyDocumentTitle(to);
});

// Keep the tab title translated when the user switches language without navigating.
watch(
  () => i18n.global.locale.value,
  () => applyDocumentTitle(router.currentRoute.value)
);
