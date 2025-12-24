export default {
  headers: [
    { key: 'id', title: 'id', sortable: true },
    { key: 'name', title: 'user.labelName', sortable: true, filterable: false },
    { key: 'role_name', title: 'user.labelRole', sortable: false, filterable: true },
    { key: 'country_name', title: 'user.labelCountry', sortable: false, filterable: true },
    { key: 'title', title: 'user.labelTitle', sortable: false, filterable: true },
    { key: 'assignment', title: 'user.labelCurrentAssignments', sortable: false, filterable: true },
    { key: 'actions', title: '', sortable: false },
  ],
  searches: [
    { name: 'name', label: 'searchByName', type: 'TextInput' },
  ]
}
