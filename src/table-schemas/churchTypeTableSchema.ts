export default {
  headers: [
    { key: 'id', title: 'id', sortable: true },
    { key: 'name', title: 'churchType.labelName', sortable: true, filterable: false },
    { key: 'actions', title: '', sortable: false },
  ],
  searches: [
    { name: 'name', label: 'searchByName', type: 'TextInput' },
  ]
}
