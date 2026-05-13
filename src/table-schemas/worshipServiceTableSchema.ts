export default {
  headers: [
    { key: 'id', title: 'id', sortable: true },
    // { key: 'name', title: 'worshipService.labelChurch', sortable: true, filterable: false },
    { key: 'name', title: 'worshipService.labelName', sortable: false, filterable: false },
    { key: 'day_name', title: 'worshipService.labelDayName', sortable: true, filterable: true },
    { key: 'time', title: 'worshipService.labelTime', sortable: false, filterable: true },
    { key: 'actions', title: '', sortable: false },
  ],
  searches: [
    { name: 'name', label: 'searchByName', type: 'TextInput' },
  ]
}
