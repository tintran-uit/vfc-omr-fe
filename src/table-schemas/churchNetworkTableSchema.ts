export default {
  headers: [
    { key: 'id', title: 'id', sortable: true },
    { key: 'name', title: 'churchNetwork.labelName', sortable: true, filterable: false },
    { key: 'pastor_credential_locked', title: 'churchNetwork.labelPastorCredentialLocked', sortable: false, filterable: false },
    { key: 'actions', title: '', sortable: false },
  ],
  searches: [
    { name: 'name', label: 'searchByName', type: 'TextInput' },
  ]
}
