export const createFormSchema = () => ({
  fields: [
    {
      title: "1. Main Worship Service Attendance",
      type: "heading",
    },
    {
      name: "worship_sessions",
      label: "worship sessions",
      type: "WorshipServiceInput",
      hideLabel: true,
      cols: 12,
    },
    {
      title: "2. Cell Groups",
      type: "heading",
    },
    {
      name: "church_metrics.number_of_cell_groups",
      label: "Number of Cell Groups",
      rules: ["required"],
      type: "NumberInput",
    },
    {
      name: "church_metrics.cell_group_weekly_attendance",
      label: "Total Attendance in All",
      rules: ["required"],
      type: "NumberInput",
    },
    {
      title: "3. Prayer Meetings",
      type: "heading",
    },
    {
      name: "church_metrics.number_of_prayer_meetings",
      label: "Number of Prayer Meetings",
      rules: ["required"],
      type: "NumberInput",
    },
    {
      name: "church_metrics.prayer_meeting_weekly_attendance",
      label: "Number of Prayer Meetings",
      rules: ["required"],
      type: "NumberInput",
    },
    {
      title: "4. Decisions, Discipling & Water Baptisms",
      type: "heading",
    },
    {
      name: "church_metrics.weekly_decisions_made",
      label: "Number of New Decision",
      rules: ["required"],
      type: "NumberInput",
    },
    {
      name: "church_metrics.being_actively_discipled",
      label: "Number being Actively Discipled",
      rules: ["required"],
      type: "NumberInput",
    },
    {
      name: "church_metrics.weekly_water_baptism",
      label: "Number of Water Baptised",
      rules: ["required"],
      type: "NumberInput",
    },
    {
      title: "5. Teaching & Training",
      type: "heading",
    },
    {
      name: "church_metrics.number_of_liw_classes",
      label: "Number of GT/LIW Classes",
      rules: ["required"],
      type: "NumberInput",
    },
    {
      name: "church_metrics.liw_total_students",
      label: "Total Attendance in all GT/LIW Classes",
      rules: ["required"],
      type: "NumberInput",
    },
    {
      name: "church_metrics.number_of_leaders_in_training_for_cpm",
      label: "No of Leaders in training for Pastoral or Church Planting duties",
      rules: ["required"],
      type: "NumberInput",
    },
    {
      title: "6. Giving",
      type: "heading",
    },
    {
      name: "church_metrics.giving_in_local_currency",
      label: ({ t, meta }) =>
        t("localGivingCurrency", {
          currency: meta.localCurrencyCode,
        }),
      rules: ["required"],
      type: "NumberFormattedInput",
    },
    {
      name: "church_metrics.giving_in_usd",
      label: "Local Giving USD",
      type: "computed",

      dependsOn: {
        localAmount: "church_metrics.giving_in_local_currency",
      },
      compute: ({ deps, meta }) => {
        const { localAmount } = deps;
        const { usdRate } = meta;

        if (!localAmount || !usdRate) return 0;

        return Math.round((localAmount / usdRate) * 100) / 100;
      },
    },
    {
      name: "church_metrics.mfp_in_local_currency",
      label: ({ t, meta }) =>
        t("mfpGivingCurrency", {
          currency: meta.localCurrencyCode,
        }),
      rules: ["required"],
      type: "NumberFormattedInput",
    },
    {
      name: "church_metrics.mfp_in_usd",
      label: "MFP Giving USD",
      type: "computed",
      dependsOn: {
        mfpLocalAmount: "church_metrics.mfp_in_local_currency",
      },
      compute: ({ deps, meta }) => {
        const { mfpLocalAmount } = deps;
        const { usdRate } = meta;

        if (!mfpLocalAmount || !usdRate) return 0;

        return Math.round((mfpLocalAmount / usdRate) * 100) / 100;
      },
    },
  ],
});
