export default {
  headers: [
    { key: 'id', title: 'churchTable.id', sortable: true, filterable: true },
    { key: 'name', title: 'churchTable.name'},
    { key: 'tags', title: ''},
    { key: 'country_name', title: 'churchTable.country' },
    { key: 'city', title: 'churchTable.city' },
    { key: 'pastor_name', title: 'churchTable.pastor' },
    { key: 'actions', title: '' },
  ],
  searches: [
    { name: 'name', label: 'churchTable.searchName', type: 'TextInput' },
  ]
}
