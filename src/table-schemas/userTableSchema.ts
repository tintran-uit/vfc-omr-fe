export default {
  headers: [
    { key: 'id', title: 'userTable.id', sortable: true },
    { key: 'name', title: 'userTable.name', sortable: true, filterable: false },
    { key: 'email', title: 'userTable.email', sortable: true, filterable: true },
    { key: 'role_name', title: 'userTable.role', sortable: false, filterable: true },
    { key: 'actions', title: '', sortable: false },
  ],
  searches: [
    { name: 'name', label: 'userTable.searchName', type: 'TextInput' },
  ]
}
