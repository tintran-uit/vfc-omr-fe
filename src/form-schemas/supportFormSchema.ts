type GetName = () => string;

export const createSupportFormSchema = (getUserDisplayName: GetName) => ({
  initData: () => ({
    name: getUserDisplayName(),
    subject: "",
    message: "",
  }),
  fields: [
    {
      label: "support.labelName",
      name: "name",
      rules: ["required"],
      type: "TextInput",
      // Allow user edit if they want a different display name
    },
    {
      label: "support.labelSubject",
      name: "subject",
      rules: ["required"],
      type: "TextInput",
    },
    {
      label: "support.labelMessage",
      name: "message",
      rules: ["required"],
      type: "TextareaInput",
    },
  ],
});
