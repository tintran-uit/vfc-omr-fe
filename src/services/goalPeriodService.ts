import apiClient from "@/services/apiClient";

export const GOAL_METRIC_KEYS = [
  "percent_of_churches_doing_church_planting",
  "percent_new_church_plants",
  "percent_of_churches_reporting_on_omr",
  "percent_of_churches_mfp",
  "percent_of_churches_giving_conference_fund",
  "percent_of_churches_liw_classes",
  "percent_of_churches_cell_groups",
  "percent_of_churches_50_69_percent_in_cell_groups",
  "percent_of_churches_70_89_percent_in_cell_groups",
  "percent_of_churches_90_100_percent_in_cell_groups",
  "percent_of_churches_growing",
  "percent_of_churches_growing_by_10_19_percent",
  "percent_of_churches_growing_by_20_100_percent",
  "percent_of_churches_childrens_programmes",
  "percent_of_churches_childrens_outreaches",
  "percent_of_churches_training_leaders",
] as const;

export type GoalMetricKey = (typeof GOAL_METRIC_KEYS)[number];

export type GoalPeriod = {
  id: number;
  user_id: number;
  user_name?: string;
  local_church_id: number;
  local_church_name?: string;
  nation_id: number;
  nation_name?: string;
  start_year: number;
  end_year: number;
  church_network?: string;
  geographical_region?: string;
  church_region?: string;
  language_region?: string;
};

export type GoalRow = {
  id?: number;
  goal_periods_id?: number;
  start_month: number;
  start_year: number;
  end_month: number;
  end_year: number;
} & Partial<Record<GoalMetricKey | `${GoalMetricKey}_is_red`, number | boolean | string | null>>;

export type GoalPeriodDetail = {
  goal_period: GoalPeriod;
  home_church_goals: GoalRow[];
  home_church_planting_goals: GoalRow[];
  nation_goals: GoalRow[];
  region_goals: GoalRow[];
};

export type GoalPeriodPayload = {
  user_id: number;
  local_church_id: number;
  nation_id: number;
  start_year: number;
  end_year: number;
};

export type GoalPeriodUpdatePayload = {
  local_church_id: number;
  nation_id: number;
  start_year: number;
  end_year: number;
};

export type GoalDetailsPayload = {
  home_church_goals: GoalRow[];
  home_church_planting_goals: GoalRow[];
  nation_goals: GoalRow[];
  region_goals: GoalRow[];
};

export const GOAL_SECTIONS = [
  { key: "home_church_goals", titleKey: "overseerGoal.homeChurchGoals" },
  { key: "home_church_planting_goals", titleKey: "overseerGoal.churchPlantingGoals" },
  { key: "nation_goals", titleKey: "overseerGoal.nationGoals" },
  { key: "region_goals", titleKey: "overseerGoal.regionGoals" },
] as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function periodRange(row: Pick<GoalRow, "start_month" | "start_year" | "end_month" | "end_year">) {
  const start = MONTHS[(Number(row.start_month) || 1) - 1] || String(row.start_month);
  const end = MONTHS[(Number(row.end_month) || 1) - 1] || String(row.end_month);
  return {
    start: `${start}-${row.start_year}`,
    end: `${end}-${row.end_year}`,
  };
}

export function periodLabel(row: Pick<GoalRow, "start_month" | "start_year" | "end_month" | "end_year">) {
  const range = periodRange(row);
  return `${range.start}\nto\n${range.end}`;
}

export function serializeGoalRows(rows: GoalRow[]): GoalRow[] {
  return (rows || []).map((row) => {
    const next: GoalRow = { ...row };
    GOAL_METRIC_KEYS.forEach((key) => {
      const raw = next[key];
      if (raw === "" || raw == null) {
        next[key] = null;
      } else {
        const num = Number(raw);
        next[key] = Number.isFinite(num) ? num : null;
      }
      const flag = `${key}_is_red` as const;
      next[flag] = Boolean(next[flag]);
    });
    return next;
  });
}

export const goalPeriodService = {
  async list(params = {}) {
    return await apiClient.get("/goal-periods", params);
  },
  async get(id: number | string) {
    return await apiClient.get(`/goal-periods/${id}`);
  },
  async create(payload: GoalPeriodPayload) {
    return await apiClient.post("/goal-periods", payload);
  },
  async update(id: number | string, payload: GoalPeriodUpdatePayload) {
    return await apiClient.patch(`/goal-periods/${id}`, payload);
  },
  async updateDetails(id: number | string, payload: GoalDetailsPayload) {
    return await apiClient.patch(`/goal-periods/${id}/details-batch`, payload);
  },
  async del(id: number | string) {
    return await apiClient.del(`/goal-periods/${id}`);
  },
};
