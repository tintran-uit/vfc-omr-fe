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
      name: 'ChurchAdd',
      path: '/churches/add',
      component: () => import('@/views/churches/AddChurch.vue')
    },
    {
      name: 'ChurchWithNewPastorAdd',
      path: '/churches/add-with-new-pastor',
      component: () => import('@/views/churches/AddChurchWithNewPastor.vue'),
    },
    {
      name: 'ChurchEdit',
      path: '/churches/:id/edit',
      component: () => import('@/views/churches/EditChurch.vue')
    },
    {
      name: 'ChurchClone',
      path: '/churches/:id/clone',
      component: () => import('@/views/churches/CloneChurch.vue')
    },
    {
      name: 'ChurchDisabledList',
      path: '/churches/disabled-list',
      component: () => import('@/views/churches/ListDisabledChurch.vue')
    },
    {
      name: 'ChurchList',
      path: '/churches',
      component: () => import('@/views/churches/ListChurch.vue')
    },
    {
      name: 'ChurchDetail',
      path: '/churches/:id',
      component: () => import('@/views/churches/DetailChurch.vue')
    },
    {
      name: 'UserAdd',
      path: 'users/add',
      component: () => import('@/views/users/AddUser.vue')
    },
    {
      name: 'UserEdit',
      path: 'users/:id/edit',
      component: () => import('@/views/users/EditUser.vue')
    },
    {
      name: 'UserList',
      path: 'users',
      component: () => import('@/views/users/ListUser.vue')
    },
    {
      name: 'UserOverseerList',
      path: 'users/overseers',
      component: () => import('@/views/users/ListOverseerUser.vue')
    },
    {
      name: 'WorshipServiceList',
      path: 'churches/:churchId/services',
      component: () => import('@/views/worship-services/ListWorshipService.vue')
    },
    {
      name: 'WorshipServiceAdd',
      path: 'churches/:churchId/services/add',
      component: () => import('@/views/worship-services/AddWorshipService.vue')
    },
    {
      name: 'WorshipServiceEdit',
      path: 'churches/:churchId/services/:id/edit',
      component: () => import('@/views/worship-services/EditWorshipService.vue')
    },
  ]
};

export default MainRoutes;
