export default {
  headers: [
    { key: 'id', title: 'Id', sortable: true },
    { key: 'name', title: 'Name', sortable: true, filterable: false },
    { key: 'email', title: 'Email', sortable: true, filterable: true },
    { key: 'role_name', title: 'Role', sortable: false, filterable: true },
    { key: 'actions', title: '       ', sortable: false },
  ],
  searches: [
    { name: 'name', label: 'Search', type: 'TextInput' },
  ]
}
