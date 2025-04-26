const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/',
  component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
  children: [
    {
      name: 'Default',
      path: '/',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'Report Form',
      path: '/test/report-form',
      component: () => import('@/views/test/ReportForm.vue')
    },
    {
      name: 'Dynamic Form',
      path: '/test/dynamic-form',
      component: () => import('@/views/test/DynamicForm.vue')
    },
  ]
};

export default MainRoutes;
