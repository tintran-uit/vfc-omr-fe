<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDialogStore } from '@/stores/dialogStore';
import { useAuthStore } from '@/stores/authStore';
import { churchPlantingProjectionService } from '@/services/churchPlantingProjectionService';
import { churchService } from '@/services/churchService';
import { formatDate, formatDateTimeHumanReadable } from '@/helpers/dateTimeHelper';
import {
  displayFormattedPopulation,
  displayStartDatePioneering,
  displayStartDatePreparation,
} from '@/helpers/churchPlantingProjectionDisplay';
import { range } from '@/utils/arrayUtil';

const STEP_COLS = 6;
const ROW_MATRIX = 9;
const LIST_LIMIT = 500;

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const dialogStore = useDialogStore();
const authStore = useAuthStore();

const churchId = computed(() => route.params.churchId);
const church = ref<any>(null);
const items = ref<any[]>([]);
const stepIndices = range(1, STEP_COLS);
const rowIndices = range(1, ROW_MATRIX);

const chartOpen = reactive<Record<number, boolean>>({});
const stepsById = reactive<Record<number, Record<string, any>>>({});
const stepsLoading = reactive<Record<number, boolean>>({});
const stepsSaving = reactive<Record<number, boolean>>({});

const pageTitle = computed(() =>
  t('churchPlantingProjection.listTitle', { churchName: church.value?.name ?? '' })
);

const stepRowField = (step: number, row: number, suffix: 'value' | 'completed') =>
  `step${step}_row${row}_${suffix}`;

const stepField = (step: number, name: string) => `step${step}_${name}`;

const rowTitleField = (row: number) => `row${row}_title`;

const normalizeStepsForUi = (data: Record<string, any>) => {
  const normalized = { ...data };

  for (let step = 1; step <= 9; step += 1) {
    for (let row = 1; row <= ROW_MATRIX; row += 1) {
      const f = stepRowField(step, row, 'completed');
      if (f in normalized) {
        normalized[f] = Boolean(normalized[f]);
      }
    }
  }

  return normalized;
};

const buildProjectionBody = (item: any) => ({
  church_id: Number(item.church_id ?? churchId.value),
  town: item.town,
  country_id: item.country_id,
  proposed_church_name: item.proposed_church_name,
  proposed_leader_name: item.proposed_leader_name,
  population: item.population ?? null,
  start_date_preparation: item.start_date_preparation,
  start_date_preparation_original:
    item.start_date_preparation_original ?? item.start_date_preparation,
  start_date_pioneering: item.start_date_pioneering,
  start_date_pioneering_original:
    item.start_date_pioneering_original ?? item.start_date_pioneering,
  distance_to_town: String(item.distance_to_town ?? ''),
  distance_to_town_unit: item.distance_to_town_unit || 'km',
  user_id: item.user_id ?? authStore.user?.id,
});

const fetchChurch = async (id: any) => {
  try {
    church.value = await churchService.getById(id);
  } catch (e) {
    console.error(e);
  }
};

const fetchData = async (id: any) => {
  try {
    const { items: data } = await churchPlantingProjectionService.getListByChurchWithStep(id, {
      page: 1,
      limit: LIST_LIMIT,
    });
    items.value = data || [];
  } catch (e) {
    console.error(e);
  }
};

const loadStepsIfNeeded = async (projectionId: number) => {
  if (stepsById[projectionId]) return;

  stepsLoading[projectionId] = true;
  try {
    const raw = await churchPlantingProjectionService.getSteps(projectionId, false);
    stepsById[projectionId] = normalizeStepsForUi(raw);
  } catch (e) {
    console.error(e);
  } finally {
    stepsLoading[projectionId] = false;
  }
};

const toggleChart = async (projectionId: number) => {
  chartOpen[projectionId] = !chartOpen[projectionId];
  if (chartOpen[projectionId]) {
    await loadStepsIfNeeded(projectionId);
  }
};

const persistProjectionPatch = async (item: any, extra: Record<string, any> = {}) => {
  await churchPlantingProjectionService.update(item.id, {
    ...buildProjectionBody(item),
    ...extra,
  });
};

const onToggleStepCompleted = async (item: any, stepIndex: number) => {
  const arr = [...(item.steps_completed || [])];
  while (arr.length < STEP_COLS) arr.push(false);
  const nextOn = !arr[stepIndex];
  arr[stepIndex] = nextOn;

  const dates = { ...(item.steps_date_completed || {}) };
  const dk = `step${stepIndex + 1}_date_completed`;
  const today = formatDate(new Date(), 'YYYY-MM-DD');
  if (nextOn) {
    dates[dk] = today;
  } else {
    dates[dk] = null;
  }

  const prevArr = item.steps_completed;
  const prevDates = item.steps_date_completed
    ? { ...item.steps_date_completed }
    : null;

  item.steps_completed = arr;
  item.steps_date_completed = dates;

  const payload: Record<string, string | null> = {
    [dk]: nextOn ? today : null,
  };

  try {
    await churchPlantingProjectionService.updateSteps(item.id, payload);
    if (stepsById[item.id]) {
      stepsById[item.id][dk] = nextOn ? today : null;
    }
  } catch (e) {
    console.error(e);
    item.steps_completed = prevArr;
    item.steps_date_completed = prevDates;
    await fetchData(churchId.value);
  }
};

const onMatrixCompleted = async (
  projectionId: number,
  step: number,
  row: number,
  val: boolean | null
) => {
  if (!stepsById[projectionId]) return;
  const key = stepRowField(step, row, 'completed');
  const prev = stepsById[projectionId][key];
  stepsById[projectionId][key] = Boolean(val);
  const apiVal = val ? true : null;

  stepsSaving[projectionId] = true;
  try {
    await churchPlantingProjectionService.updateSteps(projectionId, {
      [key]: apiVal,
    });
  } catch (e) {
    console.error(e);
    stepsById[projectionId][key] = prev;
  } finally {
    stepsSaving[projectionId] = false;
  }
};

const onMatrixCellLabelToggle = (projectionId: number, step: number, row: number) => {
  if (!stepsById[projectionId]) return;
  const cur = Boolean(stepsById[projectionId][stepRowField(step, row, 'completed')]);
  onMatrixCompleted(projectionId, step, row, !cur);
};

const isMatrixCellValueEmpty = (projectionId: number, step: number, row: number) => {
  const v = stepsById[projectionId]?.[stepRowField(step, row, 'value')];
  return v === null || v === undefined || String(v).trim() === '';
};

const matrixCellValueForDisplay = (projectionId: number, step: number, row: number) =>
  String(stepsById[projectionId]?.[stepRowField(step, row, 'value')] ?? '');

const matrixRowTitleDisplay = (projectionId: number, row: number) => {
  const v = stepsById[projectionId]?.[rowTitleField(row)];
  if (v === null || v === undefined || String(v).trim() === '') return '';
  return String(v);
};

const matrixHeaderDateDisplay = (projectionId: number, step: number) => {
  const steps = stepsById[projectionId];
  if (!steps) return '';
  const proposed = steps[stepField(step, 'date_proposed')];
  const original = steps[stepField(step, 'date_proposed_original')];
  const fmtProposed = formatDateTimeHumanReadable(proposed);
  const fmtOriginal = formatDateTimeHumanReadable(original);
  const hasProposed =
    proposed != null && proposed !== '' && String(proposed).trim() !== '' && Boolean(fmtProposed);
  if (hasProposed) {
    const origLine = t('churchPlantingProjection.matrixDateProposedOriginalLine', {
      date: fmtOriginal || '—',
    });
    return `${fmtProposed}\n${origLine}`;
  }
  return fmtOriginal || '';
};

const goEditProjection = (item: any) => {
  router.push({
    name: 'PlantingProjectionEdit',
    params: { churchId: churchId.value, id: item.id },
  });
};

const goEditSteps = (item: any) => {
  router.push({
    name: 'PlantingProjectionEditSteps',
    params: { churchId: churchId.value, id: item.id },
  });
};

const onDelete = async (item: any) => {
  if (!(await dialogStore.confirm(t('areYouSureWantToDelete')))) return;
  await churchPlantingProjectionService.del(item.id);
  delete stepsById[item.id];
  delete chartOpen[item.id];
  fetchData(churchId.value);
};

watch(
  () => churchId.value,
  async (id) => {
    if (!id) return;
    fetchChurch(id);
    fetchData(id);
  },
  { immediate: true }
);
</script>

<template>
  <v-row class="page-breadcrumb mb-4 mt-n2">
    <v-col cols="12">
      <v-card elevation="0" variant="text">
        <v-row no-gutters class="align-center">
          <v-col cols="12" md="8">
            <h3 class="text-h3 mt-4 mb-2">{{ pageTitle }}</h3>
          </v-col>
          <v-col cols="12" md="4" class="d-flex flex-wrap justify-md-end ga-2 mt-4 mt-md-0">
            <v-btn
              color="primary"
              variant="outlined"
              :to="{ name: 'ChurchDetail', params: { id: churchId } }"
            >
              <v-icon start>$arrowLeft</v-icon>
              {{ $t('backToList') }}
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              :to="{ name: 'PlantingProjectionAdd', params: { churchId } }"
            >
              <v-icon start>$plus</v-icon>
              {{ $t('churchPlantingProjection.addNewBtn') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <template v-if="!items.length">
    <v-card variant="outlined" class="pa-10 text-center text-medium-emphasis">
      {{ $t('noData') }}
    </v-card>
  </template>

  <v-card
    v-for="item in items"
    :key="item.id"
    variant="outlined"
    elevation="0"
    class="projection-card mb-6"
  >
    <div class="projection-card__title d-flex align-center ga-2">
      <v-icon color="error" size="22">$calendar</v-icon>
      <span class="text-body-2 text-medium-emphasis">
        {{ $t('churchPlantingProjection.projectedChurchPlantHeading') }}
      </span>
      <span class="text-h6 font-weight-bold text-primary">
        {{ item.proposed_church_name }}
      </span>
    </div>

    <v-card-text class="pa-0">
      <!-- Projection -->
      <div class="projection-section pa-4 pa-md-6">
        <div class="text-overline text-medium-emphasis mb-2">
          {{ $t('churchPlantingProjection.sectionProjection') }}
        </div>

        <div class="meta-table-wrap">
          <div class="table-panel">
            <v-table class="meta-table table-grid-vtable" density="comfortable" hover>
            <tbody>
            <tr>
              <th class="meta-label">{{ $t('churchPlantingProjection.labelProjectedTo') }}</th>
              <td>{{ item.town }}</td>
              <th class="meta-label">{{ $t('churchPlantingProjection.labelTownCityPopulation') }}</th>
              <td>{{ displayFormattedPopulation(item.population) || '—' }}</td>
            </tr>
            <tr>
              <th class="meta-label">{{ $t('churchPlantingProjection.labelDistanceToTown') }}</th>
              <td>
                {{ item.distance_to_town ?? '—' }}
                <span v-if="item.distance_to_town_unit" class="text-medium-emphasis">
                  {{ item.distance_to_town_unit }}
                </span>
              </td>
              <th class="meta-label">{{ $t('churchPlantingProjection.proposedLeader') }}</th>
              <td>{{ item.proposed_leader_name }}</td>
            </tr>
            <tr>
              <th class="meta-label">{{ $t('churchPlantingProjection.labelStartPreparations') }}</th>
              <td>{{ formatDateTimeHumanReadable(displayStartDatePreparation(item)) || '—' }}</td>
              <th class="meta-label">{{ $t('churchPlantingProjection.labelStartPioneering') }}</th>
              <td>{{ formatDateTimeHumanReadable(displayStartDatePioneering(item)) || '—' }}</td>
            </tr>
          </tbody>
            </v-table>
          </div>
        </div>

        <div class="d-flex flex-wrap justify-end ga-2 mt-3">
          <v-btn
            size="small"
            color="primary"
            variant="tonal"
            @click="goEditProjection(item)"
          >
            <v-icon start size="18">$edit</v-icon>
            {{ $t('churchPlantingProjection.editProjectionBtn') }}
          </v-btn>
          <v-btn
            size="small"
            color="error"
            variant="text"
            @click="onDelete(item)"
          >
            <v-icon start size="18">$delete</v-icon>
            {{ $t('dataTable.buttonDeleteTitle') }}
          </v-btn>
        </div>

        <div class="step-summary-wrap mt-6">
          <div class="table-panel">
            <v-table class="step-summary-table table-grid-vtable" density="compact" hover>
            <thead>
              <tr>
                <th class="step-summary-corner text-caption font-weight-bold">
                  {{ $t('churchPlantingProjection.stepProgressSummaryLabel') }}
                </th>
                <th
                  v-for="s in stepIndices"
                  :key="`h-${item.id}-${s}`"
                  class="text-center text-caption font-weight-bold"
                >
                  {{ s }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th class="text-caption text-medium-emphasis">
                  {{ $t('churchPlantingProjection.summaryStepCompleted') }}
                </th>
                <td
                  v-for="(s, idx) in stepIndices"
                  :key="`c-${item.id}-${s}`"
                  class="text-center"
                >
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    :color="item?.steps_completed?.[idx] ? 'success' : 'default'"
                    @click="onToggleStepCompleted(item, idx)"
                  >
                    <v-icon>
                      {{ item?.steps_completed?.[idx] ? '$checkboxMarkedOutline' : '$checkboxBlankOutline' }}
                    </v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr>
                <th class="text-caption text-medium-emphasis">
                  {{ $t('churchPlantingProjection.summaryDateCompleted') }}
                </th>
                <td
                  v-for="(s, idx) in stepIndices"
                  :key="`d-${item.id}-${s}`"
                  class="text-center text-body-2"
                >
                  {{
                    formatDateTimeHumanReadable(
                      item?.steps_date_completed?.[`step${idx + 1}_date_completed`]
                    ) || '—'
                  }}
                </td>
              </tr>
            </tbody>
            </v-table>
          </div>
        </div>
      </div>

      <v-divider />

      <!-- Steps chart -->
      <div class="steps-section pa-4 pa-md-6">
        <div class="text-overline text-medium-emphasis mb-2">
          {{ $t('churchPlantingProjection.sectionSteps') }}
        </div>

        <v-btn
          variant="tonal"
          color="primary"
          block
          class="text-none"
          @click="toggleChart(item.id)"
        >
          <v-icon start>
            {{ chartOpen[item.id] ? '$chevronUp' : '$chevronDown' }}
          </v-icon>
          {{
            chartOpen[item.id]
              ? $t('churchPlantingProjection.toggleStepsChartHide')
              : $t('churchPlantingProjection.toggleStepsChartShow')
          }}
          <v-chip
            v-if="stepsSaving[item.id]"
            size="x-small"
            class="ml-2"
            color="primary"
            variant="elevated"
          >
            {{ $t('churchPlantingProjection.saving') }}
          </v-chip>
        </v-btn>

        <v-expand-transition>
          <div v-show="chartOpen[item.id]" class="mt-4">
            <v-skeleton-loader
              v-if="stepsLoading[item.id]"
              type="table-heading, table-tbody"
            />

            <div v-else-if="stepsById[item.id]" class="matrix-scroll">
              <div class="table-panel table-panel--matrix">
                <v-table class="matrix-table table-grid-vtable" density="comfortable" hover>
                <thead>
                  <tr class="matrix-header-row">
                    <th
                      class="matrix-corner matrix-h-row text-caption text-medium-emphasis matrix-grid-cell"
                      scope="col"
                    >
                      {{ $t('churchPlantingProjection.matrixDateProposed') }}
                    </th>
                    <th
                      v-for="s in stepIndices"
                      :key="`hd-${item.id}-${s}`"
                      scope="col"
                      class="text-center text-body-2 matrix-h-row matrix-header-date matrix-grid-cell"
                    >
                      {{ matrixHeaderDateDisplay(item.id, s) }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in rowIndices"
                    :key="`row-${item.id}-${row}`"
                    class="matrix-data-row"
                  >
                    <th
                      scope="row"
                      class="matrix-row-title text-caption matrix-b-row matrix-grid-cell"
                    >
                      {{ matrixRowTitleDisplay(item.id, row) }}
                    </th>
                    <td
                      v-for="s in stepIndices"
                      :key="`cell-${item.id}-${row}-${s}`"
                      class="matrix-cell matrix-b-row matrix-grid-cell"
                    >
                      <div v-if="isMatrixCellValueEmpty(item.id, s, row)" class="matrix-cell-empty"></div>
                      <div
                        v-else
                        class="matrix-cell-filled d-flex align-center ga-2"
                      >
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          class="matrix-check-btn flex-shrink-0"
                          :aria-label="$t('churchPlantingProjection.markCompleted')"
                          :color="
                            stepsById[item.id]?.[stepRowField(s, row, 'completed')]
                              ? 'success'
                              : 'default'
                          "
                          @click="
                            onMatrixCompleted(
                              item.id,
                              s,
                              row,
                              !stepsById[item.id]?.[stepRowField(s, row, 'completed')]
                            )
                          "
                        >
                          <v-icon size="22">
                            {{
                              stepsById[item.id]?.[stepRowField(s, row, 'completed')]
                                ? '$checkboxMarkedOutline'
                                : '$checkboxBlankOutline'
                            }}
                          </v-icon>
                        </v-btn>
                        <div
                          class="matrix-value-text text-body-2 flex-grow-1 min-w-0"
                          role="button"
                          tabindex="0"
                          :aria-label="$t('churchPlantingProjection.markCompleted')"
                          @click="onMatrixCellLabelToggle(item.id, s, row)"
                          @keydown.enter.prevent="onMatrixCellLabelToggle(item.id, s, row)"
                          @keydown.space.prevent="onMatrixCellLabelToggle(item.id, s, row)"
                        >
                          {{ matrixCellValueForDisplay(item.id, s, row) }}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
                </v-table>
              </div>
            </div>

            <div v-else class="text-body-2 text-medium-emphasis pa-2">
              {{ $t('churchPlantingProjection.stepsLoadError') }}
            </div>
          </div>
        </v-expand-transition>

        <div class="d-flex flex-wrap justify-end mt-4">
          <v-btn
            size="small"
            color="primary"
            variant="tonal"
            @click="goEditSteps(item)"
          >
            <v-icon start size="18">$edit</v-icon>
            {{ $t('churchPlantingProjection.editStepsBtn') }}
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.projection-card {
  border-color: rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.projection-card__title {
  background: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.projection-section,
.steps-section {
  background: rgb(var(--v-theme-surface));
}

/* Lưới ô: dùng .table-grid-vtable; style global ở _override.scss (v-table.table-grid-vtable) */

.meta-table.table-grid-vtable :deep(.v-table__wrapper > table > tbody > tr > th),
.meta-table.table-grid-vtable :deep(.v-table__wrapper > table > tbody > tr > td) {
  padding: 12px 14px;
}

.step-summary-table.table-grid-vtable :deep(.v-table__wrapper > table > thead > tr > th),
.step-summary-table.table-grid-vtable :deep(.v-table__wrapper > table > tbody > tr > th),
.step-summary-table.table-grid-vtable :deep(.v-table__wrapper > table > tbody > tr > td) {
  padding: 8px 10px;
}

.matrix-table.table-grid-vtable :deep(.v-table__wrapper > table th.matrix-grid-cell),
.matrix-table.table-grid-vtable :deep(.v-table__wrapper > table td.matrix-grid-cell) {
  padding: 8px 10px;
}

.meta-table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-panel {
  border-radius: 8px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
}

.table-panel--matrix {
  border-radius: 8px;
}

.meta-table.v-table :deep(.v-table__wrapper > table) {
  min-width: 480px;
}

.meta-label {
  width: 22%;
  min-width: 7rem;
  font-weight: 600;
  white-space: normal;
  background: rgba(var(--v-theme-primary), 0.05);
  color: rgba(var(--v-theme-on-surface), 0.85);
  font-size: 0.8125rem;
}

.step-summary-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.step-summary-table {
  min-width: 640px;
}

.step-summary-table :deep(.v-table__wrapper > table > thead > tr > th) {
  background: rgba(var(--v-theme-primary), 0.07);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
}

.step-summary-corner {
  width: 160px;
}

.matrix-scroll {
  overflow-x: auto;
}

.matrix-table {
  min-width: 900px;
}

/* Sticky first column when scrolling wide matrix horizontally */
.matrix-table.v-table :deep(thead th.matrix-corner),
.matrix-table.v-table :deep(tbody th.matrix-row-title) {
  position: sticky;
  left: 0;
  z-index: 2;
  box-shadow: 3px 0 8px -4px rgba(0, 0, 0, 0.1);
  background-clip: padding-box;
}

.matrix-table.v-table :deep(thead th.matrix-corner) {
  z-index: 3;
  background: rgba(var(--v-theme-primary), 0.1) !important;
}

.matrix-table :deep(tbody tr.matrix-data-row:nth-child(odd) th.matrix-grid-cell),
.matrix-table :deep(tbody tr.matrix-data-row:nth-child(odd) td.matrix-grid-cell) {
  background: rgb(var(--v-theme-surface));
}

.matrix-table :deep(tbody tr.matrix-data-row:nth-child(even) th.matrix-grid-cell),
.matrix-table :deep(tbody tr.matrix-data-row:nth-child(even) td.matrix-grid-cell) {
  background: rgba(var(--v-theme-on-surface), 0.05);
}

/* Keep zebra on sticky row-title cells (clip scroll beneath) */
.matrix-table :deep(tbody tr.matrix-data-row:nth-child(odd) th.matrix-row-title) {
  background: rgb(var(--v-theme-surface)) !important;
}

.matrix-table :deep(tbody tr.matrix-data-row:nth-child(even) th.matrix-row-title) {
  background: rgba(var(--v-theme-on-surface), 0.05) !important;
}

.matrix-h-row {
  vertical-align: middle;
  background: rgba(var(--v-theme-primary), 0.06);
}

.matrix-header-date {
  font-weight: 600;
  white-space: pre-line;
  vertical-align: top;
}

.matrix-corner {
  width: 180px;
  text-align: left;
  font-weight: 600;
}

.matrix-row-title {
  min-width: 160px;
  max-width: 220px;
  vertical-align: middle;
  font-weight: 600;
  text-align: left;
}

.matrix-cell {
  vertical-align: middle;
  min-width: 140px;
}

.matrix-cell-empty {
  min-height: 36px;
  line-height: 1.4;
  user-select: none;
  text-align: left;
}

.matrix-cell-filled {
  min-height: 36px;
}

.matrix-value-text {
  white-space: pre-wrap;
  word-break: break-word;
  cursor: pointer;
  text-align: left;
  border-radius: 4px;
  padding: 4px 0;
  transition: background 0.15s ease;
}

.matrix-value-text:hover,
.matrix-value-text:focus-visible {
  background: rgba(var(--v-theme-on-surface), 0.06);
  outline: none;
}

.matrix-check-btn {
  margin: 0;
}
</style>
