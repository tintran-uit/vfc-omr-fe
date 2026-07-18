<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { useDisplay } from "vuetify";

import peopleIcon from "@/assets/images/metrics/people.svg";
import growthIcon from "@/assets/images/metrics/growth.svg";

const METRICS_COLLAPSED_DESKTOP = 4;
const METRICS_COLLAPSED_MOBILE = 6;
/** Goals use md="4" (3 per row) — collapse to one row on desktop */
const GOALS_COLLAPSED_DESKTOP = 3;
const GOALS_COLLAPSED_MOBILE = 4;

const props = defineProps<{
  indicators: any;
}>();

const { mdAndUp } = useDisplay();
const metricsExpanded = ref(false);
const goalsExpanded = ref(false);

const metrics = shallowRef([
  {
    name: "No. of Churches",
    earnKey: "total_churches",
    percentKey: null,
    color: "primary",
    icon: peopleIcon,
  },
  {
    name: "People",
    text: "Average people in 3 months",
    earnKey: "avg_people_3_months",
    percentKey: null,
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Churches Reporting",
    text: "Percent of Churches Reporting",
    earnKey: null,
    percentKey: "percent_churches_reporting",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Growing",
    text: "Percent Growth in Churches Number",
    earnKey: null,
    percentKey: "percent_growth_churches_number",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Churches Growing",
    text: "Percent of Churches Growing",
    earnKey: null,
    percentKey: "percent_churches_growing",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Countries",
    text: "Number of Countries",
    earnKey: "countries_count",
    percentKey: null,
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Church Planted",
    text: "Percent of Churches Planted",
    earnKey: null,
    percentKey: "percent_churches_planted",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Cell Groups",
    text: "Percent of Churches with Cell Groups",
    earnKey: null,
    percentKey: "percent_churches_with_cg",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "LIW",
    text: "Percent of Churches with LIW",
    earnKey: null,
    percentKey: "percent_churches_with_gt_liw",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Giving",
    text: "Percent of Churches with Giving",
    earnKey: null,
    percentKey: "percent_churches_with_giving",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "MFP",
    text: "Percent of Churches with MFP",
    earnKey: null,
    percentKey: "percent_churches_with_mfp",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Visited",
    text: "Percent of Churches Visited in 2 Years",
    earnKey: null,
    percentKey: "percent_churches_visited_2_years",
    color: "primary",
    icon: growthIcon,
  },
]);

const goalActualMetrics = shallowRef([
  {
    name: "Growing",
    text: "Churches Growing",
    earnKey: null,
    percentKey: "percent_of_churches_growing",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Cell Groups",
    text: "Churches with Cell Groups",
    earnKey: null,
    percentKey: "percent_of_churches_cell_groups",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "LIW",
    text: "Churches with LIW Classes",
    earnKey: null,
    percentKey: "percent_of_churches_liw_classes",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "MFP",
    text: "Churches with MFP Giving",
    earnKey: null,
    percentKey: "percent_of_churches_mfp",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Reporting",
    text: "Churches up-to-date Reporting",
    earnKey: null,
    percentKey: "percent_of_churches_reporting_on_omr",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Planting churches",
    text: "Churches Planting Churches",
    earnKey: null,
    percentKey: "percent_of_churches_doing_church_planting",
    color: "primary",
    icon: growthIcon,
  },
]);

const metricsCollapsedLimit = computed(() =>
  mdAndUp.value ? METRICS_COLLAPSED_DESKTOP : METRICS_COLLAPSED_MOBILE,
);

const metricsPreview = computed(() => metrics.value.slice(0, metricsCollapsedLimit.value));

const metricsExtra = computed(() => metrics.value.slice(metricsCollapsedLimit.value));

const canToggleMetrics = computed(() => metricsExtra.value.length > 0);

const goalsCollapsedLimit = computed(() =>
  mdAndUp.value ? GOALS_COLLAPSED_DESKTOP : GOALS_COLLAPSED_MOBILE,
);

const goalsPreview = computed(() =>
  goalActualMetrics.value.slice(0, goalsCollapsedLimit.value),
);

const goalsExtra = computed(() =>
  goalActualMetrics.value.slice(goalsCollapsedLimit.value),
);

const canToggleGoals = computed(() => goalsExtra.value.length > 0);

function getGoalActualEntry(percentKey: string | null) {
  if (!percentKey) return null;
  return props.indicators?.goals_actuals?.[percentKey] ?? null;
}

function getGoalValue(percentKey: string | null) {
  return Number(getGoalActualEntry(percentKey)?.goal ?? 0);
}

function getActualValue(percentKey: string | null) {
  return Number(getGoalActualEntry(percentKey)?.actual ?? 0);
}

function getActualChipColor(percentKey: string | null) {
  const actual = getActualValue(percentKey);
  const goal = getGoalValue(percentKey);

  return actual >= goal ? "success" : "error";
}
</script>

<template>
  <div class="overseer-metric-block">
    <v-row class="my-0">
      <v-col
        v-for="(metric, i) in metricsPreview"
        :key="`metric-${i}`"
        cols="6"
        sm="6"
        md="3"
      >
        <v-card
          elevation="0"
          class="h-100"
        >
          <v-card
            variant="outlined"
            class="h-100"
          >
            <v-card-text class="h-100">
              <div class="d-flex align-items-center justify-space-between">
                <v-row class="mb-0">
                  <v-col
                    cols="3"
                    class="d-flex align-center justify-center pb-0"
                  >
                    <v-img
                      :src="metric.icon"
                      alt="icon"
                      width="40"
                      height="40"
                    />
                  </v-col>

                  <v-col
                    cols="9"
                    class="pb-0"
                  >
                    <h4
                      v-if="metric.earnKey"
                      class="text-h4 d-flex align-center mb-0 indicator-value"
                    >
                      {{ props.indicators?.[metric.earnKey] || 0 }}
                    </h4>
                    <h4
                      v-else-if="metric.percentKey"
                      class="text-h4 d-flex align-center mb-0 indicator-value"
                    >
                      {{ props.indicators?.[metric.percentKey] || 0 }}%
                    </h4>
                    <div class="text-body-1 font-weight-medium text-high-emphasis">
                      {{ $t(metric.name) }}
                    </div>
                    <div
                      v-if="metric?.text"
                      class="text-body-2 text-medium-emphasis"
                    >
                      {{ $t(metric.text) }}
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>

    <v-expand-transition>
      <div v-show="metricsExpanded">
        <v-row class="my-0">
          <v-col
            v-for="(metric, i) in metricsExtra"
            :key="`metric-extra-${i}`"
            cols="6"
            sm="6"
            md="3"
          >
            <v-card
              elevation="0"
              class="h-100"
            >
              <v-card
                variant="outlined"
                class="h-100"
              >
                <v-card-text class="h-100">
                  <div class="d-flex align-items-center justify-space-between">
                    <v-row class="mb-0">
                      <v-col
                        cols="3"
                        class="d-flex align-center justify-center pb-0"
                      >
                        <v-img
                          :src="metric.icon"
                          alt="icon"
                          width="40"
                          height="40"
                        />
                      </v-col>

                      <v-col
                        cols="9"
                        class="pb-0"
                      >
                        <h4
                          v-if="metric.earnKey"
                          class="text-h4 d-flex align-center mb-0 indicator-value"
                        >
                          {{ props.indicators?.[metric.earnKey] || 0 }}
                        </h4>
                        <h4
                          v-else-if="metric.percentKey"
                          class="text-h4 d-flex align-center mb-0 indicator-value"
                        >
                          {{ props.indicators?.[metric.percentKey] || 0 }}%
                        </h4>
                        <div class="text-body-1 font-weight-medium text-high-emphasis">
                          {{ $t(metric.name) }}
                        </div>
                        <div
                          v-if="metric?.text"
                          class="text-body-2 text-medium-emphasis"
                        >
                          {{ $t(metric.text) }}
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>

    <div
      v-if="canToggleMetrics"
      class="d-flex justify-center mt-2"
    >
      <v-btn
        variant="text"
        color="primary"
        @click="metricsExpanded = !metricsExpanded"
      >
        {{ metricsExpanded ? $t("less") : $t("more") }}
        <v-icon
          :icon="metricsExpanded ? '$chevronUp' : '$chevronDown'"
          end
        />
      </v-btn>
    </div>

    <div class="text-h3 mt-4">
      Goals & Actual %'s for 6 months period {{ props.indicators?.goals_actuals?.period }}
    </div>

    <v-row class="my-0">
      <v-col
        v-for="(metric, i) in goalsPreview"
        :key="`goal-${i}`"
        cols="6"
        sm="6"
        md="4"
      >
        <v-card
          elevation="0"
          class="h-100"
        >
          <v-card
            variant="outlined"
            class="h-100"
          >
            <v-card-text class="h-100">
              <div class="d-flex align-items-center justify-space-between">
                <v-row class="mb-0">
                  <v-col
                    cols="3"
                    class="d-flex align-center justify-center pb-0"
                  >
                    <v-img
                      :src="metric.icon"
                      alt="icon"
                      width="40"
                      height="40"
                    />
                  </v-col>

                  <v-col
                    cols="9"
                    class="pb-0"
                  >
                    <h4 class="text-h4 d-flex align-center mb-0 indicator-value">
                      <v-tooltip
                        :text="
                          $t('goalValue', {
                            value: `${getGoalValue(metric.percentKey)}%`,
                          })
                        "
                      >
                        <template #activator="{ props: tipProps }">
                          <span
                            v-bind="tipProps"
                            class="cursor-default"
                          >
                            {{ getGoalValue(metric.percentKey) }}%
                          </span>
                        </template>
                      </v-tooltip>

                      <v-tooltip
                        :text="
                          $t('actualValue', {
                            value: `${getActualValue(metric.percentKey)}%`,
                          })
                        "
                      >
                        <template #activator="{ props: tipProps }">
                          <v-chip
                            v-bind="tipProps"
                            size="small"
                            :color="getActualChipColor(metric.percentKey)"
                            class="ml-2"
                          >
                            {{ getActualValue(metric.percentKey) }}%
                          </v-chip>
                        </template>
                      </v-tooltip>
                    </h4>

                    <div class="text-body-1 font-weight-medium text-high-emphasis">
                      {{ $t(metric.name) }}
                    </div>
                    <div
                      v-if="metric?.text"
                      class="text-body-2 text-medium-emphasis"
                    >
                      {{ $t(metric.text) }}
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>

    <v-expand-transition>
      <div v-show="goalsExpanded">
        <v-row class="my-0">
          <v-col
            v-for="(metric, i) in goalsExtra"
            :key="`goal-extra-${i}`"
            cols="6"
            sm="6"
            md="4"
          >
            <v-card
              elevation="0"
              class="h-100"
            >
              <v-card
                variant="outlined"
                class="h-100"
              >
                <v-card-text class="h-100">
                  <div class="d-flex align-items-center justify-space-between">
                    <v-row class="mb-0">
                      <v-col
                        cols="3"
                        class="d-flex align-center justify-center pb-0"
                      >
                        <v-img
                          :src="metric.icon"
                          alt="icon"
                          width="40"
                          height="40"
                        />
                      </v-col>

                      <v-col
                        cols="9"
                        class="pb-0"
                      >
                        <h4 class="text-h4 d-flex align-center mb-0 indicator-value">
                          <v-tooltip
                            :text="
                              $t('goalValue', {
                                value: `${getGoalValue(metric.percentKey)}%`,
                              })
                            "
                          >
                            <template #activator="{ props: tipProps }">
                              <span
                                v-bind="tipProps"
                                class="cursor-default"
                              >
                                {{ getGoalValue(metric.percentKey) }}%
                              </span>
                            </template>
                          </v-tooltip>

                          <v-tooltip
                            :text="
                              $t('actualValue', {
                                value: `${getActualValue(metric.percentKey)}%`,
                              })
                            "
                          >
                            <template #activator="{ props: tipProps }">
                              <v-chip
                                v-bind="tipProps"
                                size="small"
                                :color="getActualChipColor(metric.percentKey)"
                                class="ml-2"
                              >
                                {{ getActualValue(metric.percentKey) }}%
                              </v-chip>
                            </template>
                          </v-tooltip>
                        </h4>

                        <div class="text-body-1 font-weight-medium text-high-emphasis">
                          {{ $t(metric.name) }}
                        </div>
                        <div
                          v-if="metric?.text"
                          class="text-body-2 text-medium-emphasis"
                        >
                          {{ $t(metric.text) }}
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>

    <div
      v-if="canToggleGoals"
      class="d-flex justify-center mt-2"
    >
      <v-btn
        variant="text"
        color="primary"
        @click="goalsExpanded = !goalsExpanded"
      >
        {{ goalsExpanded ? $t("less") : $t("more") }}
        <v-icon
          :icon="goalsExpanded ? '$chevronUp' : '$chevronDown'"
          end
        />
      </v-btn>
    </div>
  </div>
</template>
