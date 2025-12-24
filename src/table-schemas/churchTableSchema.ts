export default {
  headers: [
    { key: 'id', title: 'id', sortable: true, filterable: true },
    { key: 'name', title: 'church.labelName'},
    { key: 'attributes', title: 'church.attributes' },
    { key: 'country_name', title: 'church.labelCountry' },
    { key: 'city', title: 'church.labelCity' },
    { key: 'pastor_name', title: 'church.labelPastor' },
    { key: 'actions', title: '' },
  ],
  searches: [
    { name: 'name', label: 'searchName', type: 'TextInput' },
  ]
}
