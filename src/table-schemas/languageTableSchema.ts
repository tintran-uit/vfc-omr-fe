export default {
  headers: [
    { key: 'id', title: 'id', sortable: true },
    { key: 'name', title: 'language.labelName', sortable: true, filterable: false },
    { key: 'actions', title: '', sortable: false },
  ],
  searches: [
    { name: 'name', label: 'language.labelName', type: 'TextInput' },
  ]
}
