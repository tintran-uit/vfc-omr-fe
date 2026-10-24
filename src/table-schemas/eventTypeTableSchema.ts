export default {
  headers: [
    { key: "id", title: "id", sortable: true },
    { key: "name", title: "eventType.labelName", sortable: true },
    { key: "color", title: "eventType.textColor", sortable: true },
    { key: "cell_color", title: "eventType.cellColor", sortable: true },
    { key: "meeting_type", title: "eventType.optionOffered", sortable: true },
    { key: "actions", title: "eventType.action", sortable: false },
  ],
  searches: [
    { name: "name", label: "searchByName", type: "TextInput" },
  ],
};
