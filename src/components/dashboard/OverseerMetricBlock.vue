<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";

import InfoHelpDialog from "@/components/shared/InfoHelpDialog.vue";
import OverseerMetricGoalMark from "@/components/dashboard/OverseerMetricGoalMark.vue";
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

const props = defineProps<{
  indicators: any;
}>();

const { t } = useI18n();
const { mdAndUp } = useDisplay();
const metricsExpanded = ref(false);
const metricHelpDialog = ref(false);
const metricHelpTitle = ref("");
const metricHelpContent = ref("");

type MetricItem = {
  name: string;
  helpTitleKey: string;
  helpKey: string;
  earnKey: string | null;
  percentKey: string | null;
  goalKey: string | null;
  color: string;
  icon: string;
};

const metrics = shallowRef<MetricItem[]>([
  {
    name: "overseerMetric.churches",
    helpTitleKey: "overseerMetric.churchesHelpTitle",
    helpKey: "overseerMetric.churchesHelp",
    earnKey: "total_churches",
    percentKey: null,
    goalKey: null,
    color: "primary",
    icon: houseIcon,
  },
  {
    name: "overseerMetric.people",
    helpTitleKey: "overseerMetric.peopleHelpTitle",
    helpKey: "overseerMetric.peopleHelp",
    earnKey: "avg_people_3_months",
    percentKey: null,
    goalKey: null,
    color: "primary",
    icon: peopleIcon,
  },
  {
    name: "overseerMetric.churchesGrowing",
    helpTitleKey: "overseerMetric.churchesGrowingHelpTitle",
    helpKey: "overseerMetric.churchesGrowingHelp",
    earnKey: null,
    percentKey: "percent_churches_growing",
    goalKey: "percent_of_churches_growing",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "overseerMetric.churchesReporting",
    helpTitleKey: "overseerMetric.churchesReportingHelpTitle",
    helpKey: "overseerMetric.churchesReportingHelp",
    earnKey: null,
    percentKey: "percent_churches_reporting",
    goalKey: "percent_of_churches_reporting_on_omr",
    color: "primary",
    icon: reportingIcon,
  },
  {
    name: "overseerMetric.nations",
    helpTitleKey: "overseerMetric.nationsHelpTitle",
    helpKey: "overseerMetric.nationsHelp",
    earnKey: "countries_count",
    percentKey: null,
    goalKey: null,
    color: "primary",
    icon: earthIcon,
  },
  {
    name: "overseerMetric.churchesPlanting",
    helpTitleKey: "overseerMetric.churchesPlantingHelpTitle",
    helpKey: "overseerMetric.churchesPlantingHelp",
    earnKey: null,
    percentKey: "percent_churches_planted",
    goalKey: "percent_of_churches_doing_church_planting",
    color: "primary",
    icon: plantIcon,
  },
  {
    name: "overseerMetric.churchesWithCgs",
    helpTitleKey: "overseerMetric.churchesWithCgsHelpTitle",
    helpKey: "overseerMetric.churchesWithCgsHelp",
    earnKey: null,
    percentKey: "percent_churches_with_cg",
    goalKey: "percent_of_churches_cell_groups",
    color: "primary",
    icon: cellGroupIcon,
  },
  {
    name: "overseerMetric.churchesWithGtLiw",
    helpTitleKey: "overseerMetric.churchesWithGtLiwHelpTitle",
    helpKey: "overseerMetric.churchesWithGtLiwHelp",
    earnKey: null,
    percentKey: "percent_churches_with_gt_liw",
    goalKey: "percent_of_churches_liw_classes",
    color: "primary",
    icon: educationIcon,
  },
  {
    name: "overseerMetric.churchesWithTithesOfferings",
    helpTitleKey: "overseerMetric.churchesWithTithesOfferingsHelpTitle",
    helpKey: "overseerMetric.churchesWithTithesOfferingsHelp",
    earnKey: null,
    percentKey: "percent_churches_with_giving",
    goalKey: null,
    color: "primary",
    icon: worldwideCurrencyIcon,
  },
  {
    name: "overseerMetric.churchesWithMfp",
    helpTitleKey: "overseerMetric.churchesWithMfpHelpTitle",
    helpKey: "overseerMetric.churchesWithMfpHelp",
    earnKey: null,
    percentKey: "percent_churches_with_mfp",
    goalKey: "percent_of_churches_mfp",
    color: "primary",
    icon: worldwideCurrencyIcon,
  },
  {
    name: "overseerMetric.moreChurches",
    helpTitleKey: "overseerMetric.moreChurchesHelpTitle",
    helpKey: "overseerMetric.moreChurchesHelp",
    earnKey: null,
    percentKey: "percent_growth_churches_number",
    goalKey: null,
    color: "primary",
    icon: moreIcon,
  },
  {
    name: "overseerMetric.churchesVisited",
    helpTitleKey: "overseerMetric.churchesVisitedHelpTitle",
    helpKey: "overseerMetric.churchesVisitedHelp",
    earnKey: null,
    percentKey: "percent_churches_visited_2_years",
    goalKey: null,
    color: "primary",
    icon: worldWideIcon,
  },
]);

const metricsCollapsedLimit = computed(() =>
  mdAndUp.value ? METRICS_COLLAPSED_DESKTOP : METRICS_COLLAPSED_MOBILE,
);

const metricsPreview = computed(() => metrics.value.slice(0, metricsCollapsedLimit.value));

const metricsExtra = computed(() => metrics.value.slice(metricsCollapsedLimit.value));

const canToggleMetrics = computed(() => metricsExtra.value.length > 0);

function getEarnValue(earnKey: string) {
  const value = Number(props.indicators?.[earnKey] ?? 0);
  return formatNumber(value) || "0";
}

function getMetricPrimary(metric: MetricItem) {
  if (metric.earnKey) return getEarnValue(metric.earnKey);
  if (metric.percentKey) return `${props.indicators?.[metric.percentKey] || 0}%`;
  return "0";
}

function openMetricHelp(metric: MetricItem) {
  metricHelpTitle.value = t(metric.helpTitleKey);
  metricHelpContent.value = t(metric.helpKey);
  metricHelpDialog.value = true;
}

function getGoalActualEntry(metric: MetricItem) {
  if (!metric.goalKey) return null;
  const entry = props.indicators?.goals_actuals?.[metric.goalKey];
  if (entry == null || typeof entry !== "object") return null;
  return entry as { goal?: number | string | null; actual?: number | string | null };
}

function getGoalNumber(metric: MetricItem) {
  return Number(getGoalActualEntry(metric)?.goal ?? 0);
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
            <v-card-text class="h-100 metric-card">
              <OverseerMetricGoalMark
                v-if="getGoalActualEntry(metric)"
                :goal="getGoalNumber(metric)"
              />
              <div class="metric-card-body overview-church-metric">
                <div class="metric-card-body__icon overview-church-metric__icon">
                  <v-img
                    :src="metric.icon"
                    :alt="$t('overseerMetric.iconAlt')"
                    width="36"
                    height="36"
                  />
                </div>
                <div class="metric-card-body__content">
                  <h4 class="text-h4 mb-0 indicator-value">
                    {{ getMetricPrimary(metric) }}
                  </h4>
                  <div class="overview-church-metric__label-row">
                    <span class="overview-church-metric__name text-body-1 font-weight-medium text-medium-emphasis">
                      {{ $t(metric.name) }}
                    </span>
                    <button
                      type="button"
                      class="overview-church-metric__info-btn"
                      :aria-label="$t('dashboard.metricInfo')"
                      @click.stop="openMetricHelp(metric)"
                    >
                      <v-icon
                        icon="$informationOutline"
                        size="16"
                      />
                    </button>
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
                <v-card-text class="h-100 metric-card">
                  <OverseerMetricGoalMark
                    v-if="getGoalActualEntry(metric)"
                    :goal="getGoalNumber(metric)"
                  />
                  <div class="metric-card-body overview-church-metric">
                    <div class="metric-card-body__icon overview-church-metric__icon">
                      <v-img
                        :src="metric.icon"
                        :alt="$t('overseerMetric.iconAlt')"
                        width="36"
                        height="36"
                      />
                    </div>
                    <div class="metric-card-body__content">
                      <h4 class="text-h4 mb-0 indicator-value">
                        {{ getMetricPrimary(metric) }}
                      </h4>
                      <div class="overview-church-metric__label-row">
                        <span class="overview-church-metric__name text-body-1 font-weight-medium text-medium-emphasis">
                          {{ $t(metric.name) }}
                        </span>
                        <button
                          type="button"
                          class="overview-church-metric__info-btn"
                          :aria-label="$t('dashboard.metricInfo')"
                          @click.stop="openMetricHelp(metric)"
                        >
                          <v-icon
                            icon="$informationOutline"
                            size="16"
                          />
                        </button>
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

    <InfoHelpDialog
      v-model="metricHelpDialog"
      :title="metricHelpTitle"
      :content="metricHelpContent"
    />
  </div>
</template>

<style scoped lang="scss">
.metric-card {
  position: relative;
}

.metric-card :deep(.metric-goal-mark) {
  position: absolute;
  top: 8px;
  right: 8px;
  margin-left: 0;
  z-index: 1;
}

.overview-church-metric__icon {
  flex: 0 0 36px;
}

.overview-church-metric__label-row {
  display: flex;
  align-items: center;
  width: 100%;
  line-height: 1.5rem;
  gap: 4px;
}

.overview-church-metric__name {
  flex: 1 1 auto;
  min-width: 0;
  line-height: 1.5rem;
}

.overview-church-metric__info-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.5rem;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgb(var(--v-theme-primary));
  cursor: pointer;
  line-height: 0;

  &:hover {
    opacity: 0.75;
  }

  &:focus-visible {
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 1px;
    border-radius: 50%;
  }
}
</style>
