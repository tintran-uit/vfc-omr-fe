export const createFormSchema = () => ({
  fields: [
    {
      name: "user_id",
      label: "Visitor",
      description: "If you are entering your own Visit, choose your own name. Other wise, choose the correct person you are entering Visits for.",
      roles: ['required'],
      type: "PastorSelectInput",
      cols: 12,
    },
    {
      name: "worship_sessions",
      label: "Visitor",
      roles: ['required'],
      type: "PastorSelectInput",
      cols: 12,
    },
    {
      name: "worship_sessions",
      label: "Month",
      type: "MonthSelectInput",
      cols: 12,
    },
    {
      name: "worship_sessions",
      label: "Visitor",
      description: "If you are entering your own Visit, choose your own name. Other wise, choose the correct person you are entering Visits for.",
      type: "PastorSelectInput",
      cols: 12,
    },
});
