export default {
  headers: [
    { key: 'mobile_phone', title: 'churchPlantingProjection.proposedLaunchDate', sortable: false, filterable: false },//Proposed Launch Date
    { key: 'email', title: 'churchPlantingProjection.targetTown', sortable: true, filterable: true },//Church Plant Target Town
    { key: 'role_name', title: 'churchPlantingProjection.estPop', sortable: false, filterable: true },// Est. Pop.
    { key: 'country_name', title: 'churchPlantingProjection.proposedLeader', sortable: false, filterable: true },//Proposed Leader
    { key: 'actions', title: 'churchPlantingProjection.stepProgressIndicator', sortable: false },// 6 Step Progress Indicator
  ],
  searches: [
    // { name: 'name', label: 'userTable.searchName', type: 'TextInput' },
  ]
}
