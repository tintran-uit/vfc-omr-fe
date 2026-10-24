export default {
  headers: [
    { key: 'id', title: 'id', sortable: true },
    { key: 'name', title: 'user.labelName', sortable: true, filterable: false },
    { key: 'country_name', title: 'user.labelCountry', sortable: false, filterable: true },
    { key: 'title', title: 'user.labelTitle', sortable: false, filterable: true },
    { key: 'pastor_of', title: 'user.labelCurrentAssignments', sortable: false, filterable: true },
    { key: 'actions', title: '', sortable: false },
  ],
  searches: [
    { name: 'name', label: 'searchByName', type: 'TextInput' },
  ]
}
