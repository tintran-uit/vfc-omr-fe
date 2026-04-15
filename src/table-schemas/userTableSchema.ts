export default {
  headers: [
    { key: 'id', title: 'id', sortable: true },
    { key: 'avatar', title: 'user.avatar', sortable: false },
    { key: 'name', title: 'user.labelName', sortable: true },
    { key: 'country_name', title: 'user.labelCountry', sortable: true },
    // { key: 'city_name', title: 'user.labelCity', sortable: true },
    { key: 'role_name', title: 'user.omrRole', sortable: true },
    { key: 'mobile_phone', title: 'user.labelMobilePhone', sortable: false},
    { key: 'email', title: 'user.labelEmailAddress', sortable: false },
    { key: 'role_name', title: 'user.labelRole', sortable: false },
    { key: 'actions', title: '', sortable: false },
  ],
  searches: [
    { name: 'name', label: 'searchByName', type: 'TextInput' },
  ]
}
