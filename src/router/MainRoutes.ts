const MainRoutes = {
  path: '/',
  meta: {
    requiresAuth: true
  },
  redirect: '/dashboard',
  component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
  children: [
    {
      name: 'Dashboard',
      path: 'dashboard',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
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
      name: 'Add new church',
      path: 'churches/add-new',
      component: () => import('@/views/churches/ChurchForm.vue')
    },
  ]
};

export default MainRoutes;
