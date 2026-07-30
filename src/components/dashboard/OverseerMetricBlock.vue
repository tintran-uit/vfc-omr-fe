<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { useDisplay } from "vuetify";

import houseIcon from "@/assets/images/metrics/house.png";
import earthIcon from "@/assets/images/metrics/earth.png";
import peopleIcon from "@/assets/images/metrics/group.png";
import moreIcon from "@/assets/images/metrics/more.png";
import reportingIcon from "@/assets/images/metrics/reporting.png";
import plantIcon from "@/assets/images/metrics/plant.png";
import cellGroupIcon from "@/assets/images/metrics/cell-group.png";
import educationIcon from "@/assets/images/metrics/education.png";
import worldwideCurrencyIcon from "@/assets/images/metrics/worldwide-currency.png";
import worldWideIcon from "@/assets/images/metrics/worldwide.png";
import growthIcon from "@/assets/images/metrics/growth.svg";
import { formatNumber } from "@/helpers/appHelper";

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
    name: "overseerMetric.churches",
    text: "overseerMetric.churchesText",
    earnKey: "total_churches",
    percentKey: null,
    color: "primary",
    icon: houseIcon,
  },
  {
    name: "overseerMetric.people",
    text: "overseerMetric.peopleText",
    earnKey: "avg_people_3_months",
    percentKey: null,
    color: "primary",
    icon: peopleIcon,
  },
  {
    name: "overseerMetric.churchesGrowing",
    text: "overseerMetric.churchesGrowingText",
    earnKey: null,
    percentKey: "percent_churches_growing",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "overseerMetric.churchesReporting",
    text: "overseerMetric.churchesReportingText",
    earnKey: null,
    percentKey: "percent_churches_reporting",
    color: "primary",
    icon: reportingIcon,
  },
  {
    name: "overseerMetric.nations",
    text: "overseerMetric.nationsText",
    earnKey: "countries_count",
    percentKey: null,
    color: "primary",
    icon: earthIcon,
  },
  {
    name: "overseerMetric.churchesPlanting",
    text: "overseerMetric.churchesPlantingText",
    earnKey: null,
    percentKey: "percent_churches_planted",
    color: "primary",
    icon: plantIcon,
  },
  {
    name: "overseerMetric.churchesWithCgs",
    text: "overseerMetric.churchesWithCgsText",
    earnKey: null,
    percentKey: "percent_churches_with_cg",
    color: "primary",
    icon: cellGroupIcon,
  },
  {
    name: "overseerMetric.churchesWithGtLiw",
    text: "overseerMetric.churchesWithGtLiwText",
    earnKey: null,
    percentKey: "percent_churches_with_gt_liw",
    color: "primary",
    icon: educationIcon,
  },
  {
    name: "overseerMetric.churchesWithTithesOfferings",
    text: "overseerMetric.churchesWithTithesOfferingsText",
    earnKey: null,
    percentKey: "percent_churches_with_giving",
    color: "primary",
    icon: worldwideCurrencyIcon,
  },
  {
    name: "overseerMetric.churchesWithMfp",
    text: "overseerMetric.churchesWithMfpText",
    earnKey: null,
    percentKey: "percent_churches_with_mfp",
    color: "primary",
    icon: worldwideCurrencyIcon,
  },
  {
    name: "overseerMetric.moreChurches",
    text: "overseerMetric.growingText",
    earnKey: null,
    percentKey: "percent_growth_churches_number",
    color: "primary",
    icon: moreIcon,
  },
  {
    name: "overseerMetric.churchesVisited",
    text: "overseerMetric.churchesVisitedText",
    earnKey: null,
    percentKey: "percent_churches_visited_2_years",
    color: "primary",
    icon: worldWideIcon,
  },
]);

const goalActualMetrics = shallowRef([
  {
    name: "overseerMetric.goalGrowing",
    text: "overseerMetric.goalGrowingText",
    earnKey: null,
    percentKey: "percent_of_churches_growing",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "overseerMetric.goalCellGroups",
    text: "overseerMetric.goalCellGroupsText",
    earnKey: null,
    percentKey: "percent_of_churches_cell_groups",
    color: "primary",
    icon: cellGroupIcon,
  },
  {
    name: "overseerMetric.goalLiw",
    text: "overseerMetric.goalLiwText",
    earnKey: null,
    percentKey: "percent_of_churches_liw_classes",
    color: "primary",
    icon: educationIcon,
  },
  {
    name: "overseerMetric.goalMfp",
    text: "overseerMetric.goalMfpText",
    earnKey: null,
    percentKey: "percent_of_churches_mfp",
    color: "primary",
    icon: worldwideCurrencyIcon,
  },
  {
    name: "overseerMetric.goalReporting",
    text: "overseerMetric.goalReportingText",
    earnKey: null,
    percentKey: "percent_of_churches_reporting_on_omr",
    color: "primary",
    icon: reportingIcon,
  },
  {
    name: "overseerMetric.goalPlantingChurches",
    text: "overseerMetric.goalPlantingChurchesText",
    earnKey: null,
    percentKey: "percent_of_churches_doing_church_planting",
    color: "primary",
    icon: plantIcon,
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

function getEarnValue(earnKey: string) {
  const value = Number(props.indicators?.[earnKey] ?? 0);
  return formatNumber(value) || "0";
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
              <div class="metric-card-body">
                <div class="metric-card-body__icon">
                  <v-img
                    :src="metric.icon"
                    :alt="$t('overseerMetric.iconAlt')"
                    width="40"
                    height="40"
                  />
                </div>

                <div class="metric-card-body__content">
                  <h4
                    v-if="metric.earnKey"
                    class="text-h4 d-flex align-center mb-0 indicator-value"
                  >
                    {{ getEarnValue(metric.earnKey) }}
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
                  <div class="text-body-2 text-medium-emphasis metric-card-body__description">
                    {{ metric?.text ? $t(metric.text) : "\u00A0" }}
                  </div>
                </div>
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
                  <div class="metric-card-body">
                    <div class="metric-card-body__icon">
                      <v-img
                        :src="metric.icon"
                        :alt="$t('overseerMetric.iconAlt')"
                        width="40"
                        height="40"
                      />
                    </div>

                    <div class="metric-card-body__content">
                      <h4
                        v-if="metric.earnKey"
                        class="text-h4 d-flex align-center mb-0 indicator-value"
                      >
                        {{ getEarnValue(metric.earnKey) }}
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
                      <div class="text-body-2 text-medium-emphasis metric-card-body__description">
                        {{ metric?.text ? $t(metric.text) : "\u00A0" }}
                      </div>
                    </div>
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
      {{ $t("overseerMetric.goalsActualTitle", { period: props.indicators?.goals_actuals?.period }) }}
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
              <div class="metric-card-body">
                <div class="metric-card-body__icon">
                  <v-img
                    :src="metric.icon"
                    :alt="$t('overseerMetric.iconAlt')"
                    width="40"
                    height="40"
                  />
                </div>

                <div class="metric-card-body__content">
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
                  <div class="text-body-2 text-medium-emphasis metric-card-body__description">
                    {{ metric?.text ? $t(metric.text) : "\u00A0" }}
                  </div>
                </div>
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
                  <div class="metric-card-body">
                    <div class="metric-card-body__icon">
                      <v-img
                        :src="metric.icon"
                        :alt="$t('overseerMetric.iconAlt')"
                        width="40"
                        height="40"
                      />
                    </div>

                    <div class="metric-card-body__content">
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
                      <div class="text-body-2 text-medium-emphasis metric-card-body__description">
                        {{ metric?.text ? $t(metric.text) : "\u00A0" }}
                      </div>
                    </div>
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
