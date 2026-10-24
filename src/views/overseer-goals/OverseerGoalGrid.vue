<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import FormPageShell from "@/components/shared/FormPageShell.vue";
import CardHeader from "@/components/shared/CardHeader.vue";
import {
  GOAL_METRIC_KEYS,
  GOAL_SECTIONS,
  goalPeriodService,
  periodRange,
  serializeGoalRows,
  type GoalPeriodDetail,
  type GoalRow,
} from "@/services/goalPeriodService";

const route = useRoute();
const { t } = useI18n();

const isDefaults = computed(() => route.name === "OverseerGoalDefaults");
const periodId = computed(() => (isDefaults.value ? 0 : String(route.params.id || "")));

const loading = ref(true);
const pending = ref(false);
const errorMessage = ref("");
const detail = ref<GoalPeriodDetail | null>(null);

const title = computed(() => {
  const period = detail.value?.goal_period;
  if (!period?.start_year) return t("overseerGoal.listTitle");
  if (isDefaults.value) {
    return t("overseerGoal.defaultsTitle", { start: period.start_year, end: period.end_year });
  }
  return t("overseerGoal.goalsTitle", {
    name: period.user_name || "",
    start: period.start_year,
    end: period.end_year,
  });
});

const metrics = GOAL_METRIC_KEYS.map((key) => ({
  key,
  labelKey: `overseerGoal.metrics.${key}`,
}));

function rowsOf(key: string): GoalRow[] {
  const value = detail.value?.[key as keyof GoalPeriodDetail];
  return Array.isArray(value) ? value : [];
}

function cellText(row: GoalRow, key: string) {
  const value = row[key as keyof GoalRow];
  return value == null ? "" : String(value);
}

function onCellInput(row: GoalRow, key: string, event: Event) {
  const input = event.target as HTMLInputElement;
  const raw = input.value;
  if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) {
    input.value = cellText(row, key);
    return;
  }
  row[key as keyof GoalRow] = raw === "" ? null : raw;
}

function isRed(row: GoalRow, key: string) {
  return Boolean(row[`${key}_is_red` as keyof GoalRow]);
}

function setRed(row: GoalRow, key: string, checked: boolean) {
  row[`${key}_is_red` as keyof GoalRow] = checked;
}

async function load() {
  if (periodId.value === "") return;
  loading.value = true;
  errorMessage.value = "";
  try {
    const data = await goalPeriodService.get(periodId.value);
    const record = (data || {}) as GoalPeriodDetail & { goal_period?: GoalPeriodDetail["goal_period"] };
    detail.value = {
      goal_period: record.goal_period || (record as unknown as GoalPeriodDetail["goal_period"]),
      home_church_goals: record.home_church_goals || [],
      home_church_planting_goals: record.home_church_planting_goals || [],
      nation_goals: record.nation_goals || [],
      region_goals: record.region_goals || [],
    };
    if (!detail.value.goal_period?.id && detail.value.goal_period?.id !== 0) {
      errorMessage.value = t("overseerGoal.loadError");
      detail.value = null;
    }
  } catch (error) {
    console.error(error);
    const message = (error as { message?: string })?.message;
    errorMessage.value = message || t("overseerGoal.loadError");
    detail.value = null;
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (!detail.value?.goal_period?.id && detail.value?.goal_period?.id !== 0) return;
  pending.value = true;
  try {
    await goalPeriodService.updateDetails(detail.value.goal_period.id, {
      home_church_goals: serializeGoalRows(detail.value.home_church_goals),
      home_church_planting_goals: serializeGoalRows(detail.value.home_church_planting_goals),
      nation_goals: serializeGoalRows(detail.value.nation_goals),
      region_goals: serializeGoalRows(detail.value.region_goals),
    });
    await load();
  } catch (error) {
    console.error(error);
  } finally {
    pending.value = false;
  }
}

onMounted(load);
watch(periodId, load);
</script>

<template>
  <FormPageShell
    :title="title"
    :back-url="{ name: 'OverseerGoalList' }"
    no-card
  >
    <div v-if="loading" class="pa-6 text-body-1">
      {{ $t("overseerGoal.loading") }}
    </div>
    <div v-else-if="errorMessage" class="pa-6 text-body-1">
      {{ errorMessage }}
    </div>

    <template v-else-if="detail">
      <CardHeader
        v-for="section in GOAL_SECTIONS"
        :key="section.key"
        class="mb-4"
        :title="$t(section.titleKey)"
      >
        <v-table
          v-if="rowsOf(section.key).length"
          class="bordered-table table-striped table-in-card goal-table"
          density="compact"
        >
          <thead>
            <tr>
              <th class="goal-table__index">{{ $t("overseerGoal.number") }}</th>
              <th class="goal-table__label" />
              <th
                v-for="(row, index) in rowsOf(section.key)"
                :key="row.id ?? index"
                class="goal-table__period"
              >
                <span class="goal-period">
                  <span>{{ periodRange(row).start }}</span>
                  <span class="goal-period__to">to</span>
                  <span>{{ periodRange(row).end }}</span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(metric, metricIndex) in metrics"
              :key="metric.key"
            >
              <td class="goal-table__index">{{ metricIndex + 1 }}</td>
              <th class="goal-table__label">{{ $t(metric.labelKey) }}</th>
              <td
                v-for="(row, index) in rowsOf(section.key)"
                :key="`${metric.key}-${row.id ?? index}`"
                class="goal-table__period"
              >
                <div class="goal-cell">
                  <div
                    class="goal-field"
                    :class="{ 'is-red': isRed(row, metric.key) }"
                  >
                    <input
                      class="goal-field__input"
                      inputmode="decimal"
                      :value="cellText(row, metric.key)"
                      @input="onCellInput(row, metric.key, $event)"
                    >
                    <span class="goal-field__unit">%</span>
                  </div>
                  <label
                    class="goal-ao"
                    :class="{ 'is-red': isRed(row, metric.key) }"
                  >
                    <input
                      type="checkbox"
                      :checked="isRed(row, metric.key)"
                      @change="setRed(row, metric.key, ($event.target as HTMLInputElement).checked)"
                    >
                    <span>{{ $t("overseerGoal.aoGoal") }}</span>
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div
          v-else
          class="pa-4 text-center text-body-2"
        >
          {{ $t("noData") }}
        </div>
      </CardHeader>

      <div class="d-flex justify-end mt-4">
        <v-btn
          color="primary"
          :loading="pending"
          @click="save"
        >
          {{ $t("save") }}
        </v-btn>
      </div>
    </template>
  </FormPageShell>
</template>

<style scoped lang="scss">
.goal-table {
  width: 100%;

  :deep(table) {
    width: 100% !important;
  }

  :deep(th),
  :deep(td) {
    white-space: nowrap;
    font-size: 0.875rem;
    vertical-align: top;
  }

  :deep(.goal-table__period) {
    width: 1%;
    padding: 8px 6px !important;
    text-align: center;
  }

  :deep(tbody .goal-table__index),
  :deep(tbody .goal-table__label) {
    padding-top: 14px !important;
  }

  :deep(.goal-table__index) {
    width: 1%;
    text-align: center;
    color: rgba(var(--v-theme-on-surface), 0.55);
  }

  :deep(.goal-table__label) {
    width: 100%;
    font-weight: 500;
    text-align: left;
  }
}

.goal-period {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.15;
}

.goal-period__to {
  font-size: 0.6875rem;
  font-weight: 400;
  line-height: 1.1;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.goal-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 84px;
  margin: 0 auto;
}

.goal-field {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  padding: 0 8px 0 4px;
  border: 1px solid rgb(var(--v-theme-borderLight));
  border-radius: 6px;
  background: rgb(var(--v-theme-surface));

  &:focus-within {
    border-color: rgb(var(--v-theme-primary));
    box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.16);
  }

  &.is-red {
    border-color: rgba(var(--v-theme-error), 0.55);

    .goal-field__input {
      color: rgb(var(--v-theme-error));
      font-weight: 600;
    }
  }
}

.goal-field__input {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(var(--v-theme-on-surface), 0.87);
  font: inherit;
  font-size: 0.8125rem;
  text-align: center;

  &:focus {
    outline: none;
  }
}

.goal-field__unit {
  flex: 0 0 auto;
  font-size: 0.75rem;
  line-height: 1;
  color: rgba(var(--v-theme-on-surface), 0.45);
}

.goal-ao {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.55);
  font-size: 0.6875rem;
  font-weight: 400;
  line-height: 1;
  cursor: pointer;

  input {
    width: 13px;
    height: 13px;
    margin: 0;
    accent-color: rgb(var(--v-theme-primary));
  }

  &.is-red {
    color: rgb(var(--v-theme-error));

    input {
      accent-color: rgb(var(--v-theme-error));
    }
  }
}
</style>
