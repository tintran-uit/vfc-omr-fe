type GetDefaults = () => {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const createRelatingRequestFormSchema = (getDefaults: GetDefaults) => ({
  initData: () => getDefaults(),
  fields: [
    {
      label: "relating.labelName",
      name: "name",
      rules: ["required"],
      type: "TextInput",
    },
    {
      label: "relating.labelEmail",
      name: "email",
      rules: ["required", "email"],
      type: "TextInput",
    },
    {
      label: "relating.labelSubject",
      name: "subject",
      rules: ["required"],
      type: "TextInput",
      cols: 12,
    },
    {
      label: "relating.labelMessage",
      name: "message",
      rules: ["required"],
      type: "TextareaInput",
      cols: 12,
      attrs: {
        autoGrow: true,
        rows: 8,
      },
    },
  ],
});
