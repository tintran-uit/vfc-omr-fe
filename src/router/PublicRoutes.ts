const PublicRoutes = {
  path: '/',
  component: () => import('@/layouts/blank/BlankLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Login',
      path: 'login',
      component: () => import('@/views/authentication/LoginPage.vue')
    },
    {
      name: 'Forgot Password',
      path: 'forgot-pwd',
      component: () => import('@/views/authentication/auth1/ForgotPwd1.vue')
    },
    {
      name: 'Check Mail',
      path: 'check-mail',
      component: () => import('@/views/authentication/auth1/CheckMail1.vue')
    },
    {
      name: 'Reset Password',
      path: 'reset-pwd',
      component: () => import('@/views/authentication/auth1/ResetPwd1.vue')
    },
    // {
    //   name: 'Under Construction',
    //   path: '/construction',
    //   component: () => import('@/views/pages/underconstruction/UnderConstruction.vue')
    // },
    // {
    //   name: 'Error 404',
    //   path: '/error',
    //   component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    // },
    // {
    //   name: 'Error 500',
    //   path: '/error500',
    //   component: () => import('@/views/pages/maintenance/error/Error500Page.vue')
    // }
  ]
};

export default PublicRoutes;
