export default {
  headers: [
    { key: 'id', title: 'id', sortable: true },
    { key: 'name', title: 'country.labelName', sortable: true, filterable: false },
    { key: 'actions', title: '', sortable: false },
  ],
  searches: [
    { name: 'name', label: 'searchByName', type: 'TextInput' },
  ]
}
