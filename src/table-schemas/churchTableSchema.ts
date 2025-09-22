export default {
  headers: [
    { key: 'id', title: 'Id', sortable: true, filterable: true },
    { key: 'name', title: 'Name'},
    { key: 'tags', title: 'Tags'},
    { key: 'country_name', title: 'Country' },
    { key: 'city', title: 'City/Town' },
    { key: 'pastor_name', title: 'Pastor' },
    { key: 'actions', title: '' },
  ],
  searches: [
    { name: 'name', label: 'Seach', type: 'TextInput' },
  ]
}
