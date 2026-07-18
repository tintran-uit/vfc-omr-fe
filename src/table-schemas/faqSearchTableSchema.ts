export default {
  headers: [
    { key: "id", title: "id", sortable: true },
    {
      key: "question_header",
      title: "faq.questionHeader",
      sortable: true,
      filterable: false,
    },
    {
      key: "answer",
      title: "faq.answer",
      sortable: false,
      filterable: false,
    }
  ],
  searches: [{ name: "question_header", label: "faq.search", type: "TextInput" }],
};
