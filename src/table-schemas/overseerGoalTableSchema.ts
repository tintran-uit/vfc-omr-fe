export default {
  headers: [
    { key: "id", title: "overseerGoal.number", sortable: true },
    { key: "user_name", title: "overseerGoal.overseer", sortable: true },
    { key: "local_church_name", title: "overseerGoal.homeChurch", sortable: true },
    { key: "nation_name", title: "overseerGoal.nation", sortable: true },
    { key: "years", title: "overseerGoal.years", sortable: false },
    { key: "actions", title: "overseerGoal.action", sortable: false },
  ],
  searches: [
    { name: "search", label: "searchByName", type: "TextInput" },
  ],
};
