export default {
  headers: [
    { key: "id", title: "id", sortable: true },
    {
      key: "question_header",
      title: "faq.questionHeader",
      sortable: true,
      filterable: false,
    },
    { key: "actions", title: "", sortable: false },
  ],
  searches: [{ name: "question_header", label: "faq.search", type: "TextInput" }],
};
