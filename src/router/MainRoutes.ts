const MainRoutes = {
  path: "/",
  meta: {
    requiresAuth: true,
  },
  // redirect: '/dashboard',
  component: () => import("@/layouts/dashboard/DashboardLayout.vue"),
  children: [
    {
      name: "Dashboard",
      path: "",
      component: () => import("@/views/dashboards/Dashboard.vue"),
    },
    {
      name: "Test",
      path: "test/test",
      component: () => import("@/views/test/Test.vue"),
    },
    {
      name: "Report Form",
      path: "test/report-form",
      component: () => import("@/views/test/ReportForm.vue"),
    },
    {
      name: "ChurchAdd",
      path: "/churches/add",
      component: () => import("@/views/churches/AddChurch.vue"),
    },
    {
      name: "ChurchAddWithNewPastor",
      path: "/churches/add-with-new-pastor",
      component: () => import("@/views/churches/AddChurchWithNewPastor.vue"),
    },
    {
      name: "ChurchEdit",
      path: "/churches/:id/edit",
      component: () => import("@/views/churches/EditChurch.vue"),
    },
    {
      name: "ChurchClone",
      path: "/churches/:id/clone",
      component: () => import("@/views/churches/CloneChurch.vue"),
    },
    {
      name: "ChurchDisabledList",
      path: "/churches/disabled-list",
      component: () => import("@/views/churches/ListDisabledChurch.vue"),
    },
    {
      name: "ChurchList",
      path: "/churches",
      component: () => import("@/views/churches/ListChurch.vue"),
    },
    {
      name: "ChurchDetail",
      path: "/churches/:id",
      component: () => import("@/views/churches/DetailChurch.vue"),
    },
    {
      name: "MonthlyDataAdd",
      path: "/churches/:id/monthly-data/add",
      component: () => import("@/views/monthly-data/Add.vue"),
    },
    {
      name: "UserAdd",
      path: "users/add",
      component: () => import("@/views/users/AddUser.vue"),
    },
    {
      name: "UserEdit",
      path: "users/:id/edit",
      component: () => import("@/views/users/EditUser.vue"),
    },
    {
      name: "UserList",
      path: "users",
      component: () => import("@/views/users/ListUser.vue"),
    },
    {
      name: "UserDetail",
      path: "users/:id",
      component: () => import("@/views/users/Detail.vue"),
    },
    {
      name: "UserOverseerList",
      path: "users/overseers",
      component: () => import("@/views/users/ListOverseerUser.vue"),
    },
    {
      name: "WorshipServiceList",
      path: "churches/:churchId/services",
      component: () => import("@/views/worship-services/ListWorshipService.vue"),
    },
    {
      name: "WorshipServiceAdd",
      path: "churches/:churchId/services/add",
      component: () => import("@/views/worship-services/AddWorshipService.vue"),
    },
    {
      name: "WorshipServiceEdit",
      path: "churches/:churchId/services/:id/edit",
      component: () => import("@/views/worship-services/EditWorshipService.vue"),
    },
    {
      name: "ChurchNetworkList",
      path: "church-networks",
      component: () => import("@/views/church-networks/ListChurchNetwork.vue"),
    },
    {
      name: "ChurchNetworkAdd",
      path: "church-networks/add",
      component: () => import("@/views/church-networks/AddChurchNetwork.vue"),
    },
    {
      name: "ChurchNetworkEdit",
      path: "church-networks/:id/edit",
      component: () => import("@/views/church-networks/EditChurchNetwork.vue"),
    },
    {
      name: "ChurchTypeList",
      path: "church-types",
      component: () => import("@/views/church-types/ListChurchType.vue"),
    },
    {
      name: "ChurchTypeAdd",
      path: "church-types/add",
      component: () => import("@/views/church-types/AddChurchType.vue"),
    },
    {
      name: "ChurchTypeEdit",
      path: "church-types/:id/edit",
      component: () => import("@/views/church-types/EditChurchType.vue"),
    },
    {
      name: "LanguageList",
      path: "languages",
      component: () => import("@/views/languages/ListLanguage.vue"),
    },
    {
      name: "LanguageAdd",
      path: "languages/add",
      component: () => import("@/views/languages/AddLanguage.vue"),
    },
    {
      name: "LanguageEdit",
      path: "languages/:id/edit",
      component: () => import("@/views/languages/EditLanguage.vue"),
    },
    {
      name: "CountryList",
      path: "countries",
      component: () => import("@/views/countries/ListCountry.vue"),
    },
    {
      name: "CountryAdd",
      path: "countries/add",
      component: () => import("@/views/countries/AddCountry.vue"),
    },
    {
      name: "CountryEdit",
      path: "countries/:id/edit",
      component: () => import("@/views/countries/EditCountry.vue"),
    },
    {
      name: "LanguageRegionsList",
      path: "language-regions",
      component: () => import("@/views/language-regions/List.vue"),
    },
    {
      name: "LanguageRegionsAdd",
      path: "language-regions/add",
      component: () => import("@/views/language-regions/Add.vue"),
    },
    {
      name: "LanguageRegionsEdit",
      path: "language-regions/:id/edit",
      component: () => import("@/views/language-regions/Edit.vue"),
    },
    {
      name: "GeographicalRegionsList",
      path: "geographical-regions",
      component: () => import("@/views/geographical-regions/List.vue"),
    },
    {
      name: "GeographicalRegionsAdd",
      path: "geographical-regions/add",
      component: () => import("@/views/geographical-regions/Add.vue"),
    },
    {
      name: "GeographicalRegionsEdit",
      path: "geographical-regions/:id/edit",
      component: () => import("@/views/geographical-regions/Edit.vue"),
    },
    {
      name: "ChurchRegionsList",
      path: "church-regions",
      component: () => import("@/views/church-regions/List.vue"),
    },
    {
      name: "ChurchRegionsAdd",
      path: "church-regions/add",
      component: () => import("@/views/church-regions/Add.vue"),
    },
    {
      name: "ChurchRegionsEdit",
      path: "church-regions/:id/edit",
      component: () => import("@/views/church-regions/Edit.vue"),
    },
    {
      name: "PlantingProjectionRedirect",
      path: "planting-projections",
      component: () => import("@/views/planting-projections/Redirect.vue"),
      meta: { permissions: ["church-planting.read"] },
    },
    {
      name: "PlantingProjectionAddRedirect",
      path: "planting-projections/add",
      component: () => import("@/views/planting-projections/AddRedirect.vue"),
      meta: { permissions: ["church-planting.create"] },
    },
    {
      name: "PlantingProjectionPrintSimple",
      path: "planting-projections/print",
      component: () => import("@/views/planting-projections/PrintSimple.vue"),
      meta: { permissions: ["church-planting.print"] },
    },
    {
      name: "PlantingProjectionPrintPreview",
      path: "planting-projections/print/preview",
      component: () => import("@/views/planting-projections/PrintPreviewSteps.vue"),
      meta: { permissions: ["church-planting.print-preview"] },
    },
    {
      name: "PlantingProjectionList",
      path: "churches/:churchId/planting-projections",
      component: () => import("@/views/planting-projections/List.vue"),
      meta: { permissions: ["church-planting.read"] },
    },
    {
      name: "PlantingProjectionAdd",
      path: "churches/:churchId/planting-projections/add",
      component: () => import("@/views/planting-projections/Add.vue"),
      meta: { permissions: ["church-planting.create"] },
    },
    {
      name: "PlantingProjectionEdit",
      path: "churches/:churchId/planting-projections/:id/edit",
      component: () => import("@/views/planting-projections/Edit.vue"),
      meta: { permissions: ["church-planting.read"] },
    },
    {
      name: "PlantingProjectionEditSteps",
      path: "churches/:churchId/planting-projections/:id/edit-steps",
      component: () => import("@/views/planting-projections/EditSteps.vue"),
      meta: { permissions: ["church-planting.read"] },
    },
    {
      name: "VisitsAdd",
      path: "visits/add",
      component: () => import("@/views/visits/Add.vue"),
    },
    {
      name: "SupportSend",
      path: "support",
      component: () => import("@/views/support/Send.vue"),
    },
    // {
    //   name: 'MonthlyDataAdd',
    //   path: 'monthly-data/add',
    //   component: () => import('@/views/monthly-data/Add.vue')
    // }
  ],
};

export default MainRoutes;
