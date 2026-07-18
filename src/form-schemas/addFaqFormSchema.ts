export const createFormSchema = () => ({
  name: "faq.addTitle",
  initData: () => ({
    question_header: "",
    answer: "",
    language_id: null as number | null,
    tags_raw: "",
  }),
  fields: [
    {
      label: "faq.questionHeader",
      name: "question_header",
      rules: ["required"],
      type: "TextInput",
    },
    {
      label: "faq.language",
      name: "language_id",
      rules: ["required"],
      type: "LanguageSelectInput",
    },
    {
      label: "faq.answer",
      name: "answer",
      rules: ["required"],
      type: "TextareaInput",
    },
    {
      label: "faq.tags",
      name: "tags_raw",
      rules: [],
      type: "TextInput",
      description: "faq.tagCommaHint",
    },
  ],
});
