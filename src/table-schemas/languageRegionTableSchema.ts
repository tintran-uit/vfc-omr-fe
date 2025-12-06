export default {
  headers: [
    { key: 'id', title: 'id', sortable: true },
    { key: 'name', title: 'languageRegions.labelName', sortable: true, filterable: false },
    { key: 'disabled', title: 'languageRegions.labelDisabled', sortable: true, filterable: false },
    { key: 'actions', title: '', sortable: false },
  ],
  searches: [
    { name: 'name', label: 'languageRegions.labelName', type: 'TextInput' },
  ]
}
