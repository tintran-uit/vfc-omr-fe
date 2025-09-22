const MainRoutes = {
  path: '/',
  meta: {
    requiresAuth: true
  },
  // redirect: '/dashboard',
  component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
  children: [
    {
      name: 'Dashboard',
      path: '',
      component: () => import('@/views/dashboards/Dashboard.vue')
    },
    {
      name: 'Test',
      path: 'test/test',
      component: () => import('@/views/test/Test.vue')
    },
    {
      name: 'Report Form',
      path: 'test/report-form',
      component: () => import('@/views/test/ReportForm.vue')
    },
    {
      name: 'Dynamic Form',
      path: 'test/dynamic-form',
      component: () => import('@/views/test/DynamicForm.vue')
    },
    {
      name: 'ChurchCreate',
      path: '/churches/create',
      component: () => import('@/views/churches/CreateChurch.vue')
    },
    {
      name: 'ChurchUpdate',
      path: '/churches/:id/update',
      component: () => import('@/views/churches/UpdateChurch.vue')
    },
    {
      name: 'ChurchClone',
      path: '/churches/:id/clone',
      component: () => import('@/views/churches/CloneChurch.vue')
    },
    {
      name: 'ChurchList',
      path: '/churches',
      component: () => import('@/views/churches/ListChurch.vue')
    },
    {
      name: 'UserCreate',
      path: 'users/create',
      component: () => import('@/views/users/CreateUser.vue')
    },
    {
      name: 'UserUpdate',
      path: 'users/:id/update',
      component: () => import('@/views/users/UpdateUser.vue')
    },
    {
      name: 'UserList',
      path: 'users',
      component: () => import('@/views/users/ListUser.vue')
    },
  ]
};

export default MainRoutes;
