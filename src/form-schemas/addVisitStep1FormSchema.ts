export const createVisitStep1FormSchema = () => ({
  initData: () => ({
    user_id: null as number | null,
    month: null as number | null,
    year: new Date().getFullYear(),
    number_of_churches_visited: 0,
    number_of_events_organised: 0,
  }),
  fields: [
    {
      name: "user_id",
      label: "visitsAdd.step1.visitor",
      description: "visitsAdd.step1.visitorTooltip",
      rules: ["required"],
      type: "PastorSelectInput",
      cols: { cols: 12, md: 6 },
    },
    {
      name: "month",
      label: "month",
      rules: ["required"],
      type: "SelectInput",
      optionName: "months",
      cols: { cols: 12, md: 6 },
      attrs: {
        itemTitle: "title",
        itemValue: "value",
      },
    },
    {
      name: "year",
      label: "year",
      rules: ["required"],
      type: "SelectInput",
      optionName: "years",
      cols: { cols: 12, md: 6 },
      attrs: {
        itemTitle: "title",
        itemValue: "value",
      },
    },
    {
      name: "number_of_churches_visited",
      label: "visitsAdd.step1.numberOfChurchesVisited",
      type: "SelectInput",
      optionName: "counts",
      cols: { cols: 12, md: 6 },
      attrs: {
        itemTitle: "title",
        itemValue: "value",
      },
    },
    {
      name: "number_of_events_organised",
      label: "visitsAdd.step1.numberOfEventsOrganised",
      type: "SelectInput",
      optionName: "counts",
      cols: { cols: 12, md: 6 },
      attrs: {
        itemTitle: "title",
        itemValue: "value",
      },
    },
  ],
});
