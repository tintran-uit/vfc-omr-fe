export default {
  headers: [
    { key: 'id', title: 'userTable.id', sortable: true },
    { key: 'name', title: 'userTable.name', sortable: true, filterable: false },
    { key: 'role_name', title: 'userTable.role', sortable: false, filterable: true },
    { key: 'country_name', title: 'userTable.country', sortable: false, filterable: true },
    { key: 'title', title: 'userTable.title', sortable: false, filterable: true },
    { key: 'assignment', title: 'userTable.currentAssignments', sortable: false, filterable: true },
    { key: 'actions', title: '', sortable: false },
  ],
  searches: [
    { name: 'name', label: 'userTable.searchName', type: 'TextInput' },
  ]
}
