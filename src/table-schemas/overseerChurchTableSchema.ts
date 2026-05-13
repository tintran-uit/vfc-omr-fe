export default {
  headers: [
    { key: "id", title: "id", sortable: true, filterable: true },
    { key: "name", title: "church.labelName" },
    { key: "data_entry_status", title: "church.dataEntryStatus" },
  ],
  searches: [{ name: "name", label: "searchByName", type: "TextInput" }],
};
