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
      name: 'Test Layout Grid',
      path: '/test/layout-grid',
      component: () => import('@/views/test/LayoutGrid.vue')
    },
    {
      name: 'Report Form',
      path: '/test/report-form',
      component: () => import('@/views/test/ReportForm.vue')
    },
  ]
};

export default MainRoutes;
