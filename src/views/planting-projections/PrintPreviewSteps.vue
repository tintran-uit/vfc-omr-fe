<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/authStore';
import { dashboardService } from '@/services/dashboardService';
import { churchPlantingProjectionService } from '@/services/churchPlantingProjectionService';
import { formatDateTimeHumanReadable } from '@/helpers/dateTimeHelper';
import {
  displayFormattedPopulation,
  displayStartDatePioneering,
  displayStartDatePreparation,
} from '@/helpers/churchPlantingProjectionDisplay';
import { range } from '@/utils/arrayUtil';

const { t } = useI18n();
const authStore = useAuthStore();

const stepIndices = range(1, 6);
const rowIndices = range(1, 9);
const loadError = ref('');

const churchLabel = ref('');

type Row = {
  item: Record<string, any>;
  steps: Record<string, any> | null;
  stepsErr?: boolean;
};

const rows = ref<Row[]>([]);

const hasRows = computed(() => rows.value.length > 0);

const stepField = (step: number, name: string) => `step${step}_${name}`;
const stepRowField = (step: number, row: number, suffix: 'value' | 'completed') =>
  `step${step}_row${row}_${suffix}`;
const rowTitleField = (row: number) => `row${row}_title`;

function cellVal(steps: Record<string, any> | null, step: number, r: number) {
  if (!steps) return '';
  const v = steps[stepRowField(step, r, 'value')];
  if (v === null || v === undefined || String(v).trim() === '') return '';
  return String(v);
}

function isDone(steps: Record<string, any> | null, step: number, r: number) {
  if (!steps) return false;
  return Boolean(steps[stepRowField(step, r, 'completed')]);
}

function stepCompletedAt(item: Record<string, any>, stepIdx: number) {
  return Boolean(item?.steps_completed?.[stepIdx]);
}

function stepDateDone(item: Record<string, any>, stepIdx: number) {
  const k = `step${stepIdx + 1}_date_completed`;
  return formatDateTimeHumanReadable(item?.steps_date_completed?.[k]) || '—';
}

onMounted(async () => {
  let cid: number | string | null | undefined = authStore.user?.church_id;
  try {
    const profile = await dashboardService.getProfile();
    cid = profile?.dashboard_info?.church_id ?? cid;
    const name =
      profile?.dashboard_info?.church_name ??
      (profile as { user?: { church?: { name?: string } } })?.user?.church?.name;
    if (name) {
      churchLabel.value = name;
    }
  } catch {
    // ignore
  }
  if (!cid) {
    loadError.value = t('churchPlantingProjection.printNoChurch');
    return;
  }
  const churchId = Number(cid);
  try {
    const { items: data } = await churchPlantingProjectionService.getListByChurchWithStep(
      churchId,
      { page: 1, limit: 500 }
    );
    const list = data || [];
    const enriched = await Promise.all(
      list.map(async (item) => {
        try {
          const steps = await churchPlantingProjectionService.getSteps(item.id, false);
          return { item, steps, stepsErr: false };
        } catch {
          return { item, steps: null, stepsErr: true };
        }
      })
    );
    rows.value = enriched;
  } catch (e) {
    console.error(e);
    loadError.value = t('churchPlantingProjection.printLoadError');
  }
});

function onPrint() {
  window.print();
}
</script>

<template>
  <v-container class="py-4 py-md-6 print-preview">
    <div class="d-flex flex-wrap align-center justify-space-between gap-2 mb-4 print-screen-only">
      <h1 class="text-h5 text-md-h4 font-weight-bold">
        {{ t('churchPlantingProjection.printTitlePreview') }}
        <span v-if="churchLabel" class="text-body-1 text-medium-emphasis d-block d-md-inline">
          — {{ churchLabel }}
        </span>
      </h1>
      <div class="d-flex flex-wrap gap-2">
        <v-btn
          color="primary"
          variant="tonal"
          :to="{ name: 'PlantingProjectionRedirect' }"
        >
          {{ t('backToList') }}
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-printer" :disabled="!hasRows" @click="onPrint">
          {{ t('churchPlantingProjection.printButton') }}
        </v-btn>
      </div>
    </div>

    <v-alert v-if="loadError" type="warning" variant="tonal" class="mb-4 print-screen-only">
      {{ loadError }}
    </v-alert>

    <v-alert v-else-if="!hasRows" type="info" variant="tonal" class="print-screen-only">
      {{ t('noData') }}
    </v-alert>

    <div v-else>
      <section
        v-for="(row, idx) in rows"
        :key="row.item.id"
        :class="['print-projection', { 'print-projection--break-after': idx < rows.length - 1 }]"
      >
        <header class="print-projection__card-title print-screen-only">
          <v-icon color="error" size="22">$calendar</v-icon>
          <span class="text-body-2 text-medium-emphasis">
            {{ t('churchPlantingProjection.projectedChurchPlantHeading') }}
          </span>
          <span class="text-h6 font-weight-bold text-primary">
            {{ row.item.proposed_church_name || '—' }}
          </span>
        </header>

        <div class="printable-block text-body-2">
          <h2 class="print-projection__title text-h5 font-weight-bold mb-3">
            {{ row.item.proposed_church_name || '—' }}
            <span class="text-body-1 text-medium-emphasis font-weight-regular">#{{ row.item.id }}</span>
          </h2>

          <p class="text-overline text-medium-emphasis mb-2 print-section-label">
            {{ t('churchPlantingProjection.sectionProjection') }}
          </p>
          <table
            class="print-meta mb-4"
            :aria-label="t('churchPlantingProjection.sectionProjection')"
          >
            <tbody>
              <tr>
                <th scope="row">{{ t('churchPlantingProjection.labelProjectedTo') }}</th>
                <td>{{ row.item.town || '—' }}</td>
                <th scope="row">{{ t('churchPlantingProjection.labelTownCityPopulation') }}</th>
                <td>{{ displayFormattedPopulation(row.item.population) || '—' }}</td>
              </tr>
              <tr>
                <th scope="row">{{ t('churchPlantingProjection.labelDistanceToTown') }}</th>
                <td>
                  {{ row.item.distance_to_town ?? '—' }}
                  <span v-if="row.item.distance_to_town_unit" class="text-medium-emphasis">
                    {{ row.item.distance_to_town_unit }}
                  </span>
                </td>
                <th scope="row">{{ t('churchPlantingProjection.proposedLeader') }}</th>
                <td>{{ row.item.proposed_leader_name || '—' }}</td>
              </tr>
              <tr>
                <th scope="row">{{ t('churchPlantingProjection.labelStartPreparations') }}</th>
                <td>
                  {{ formatDateTimeHumanReadable(displayStartDatePreparation(row.item)) || '—' }}
                </td>
                <th scope="row">{{ t('churchPlantingProjection.labelStartPioneering') }}</th>
                <td>
                  {{ formatDateTimeHumanReadable(displayStartDatePioneering(row.item)) || '—' }}
                </td>
              </tr>
            </tbody>
          </table>

          <table
            class="print-step-summary mb-4"
            :aria-label="t('churchPlantingProjection.sectionSteps')"
          >
            <thead>
              <tr>
                <th scope="col" class="print-step-corner text-caption">
                  {{ t('churchPlantingProjection.stepProgressSummaryLabel') }}
                </th>
                <th
                  v-for="s in stepIndices"
                  :key="`h-${s}`"
                  scope="col"
                  class="text-center text-caption font-weight-bold"
                >
                  {{ s }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" class="text-caption text-medium-emphasis">
                  {{ t('churchPlantingProjection.summaryStepCompleted') }}
                </th>
                <td
                  v-for="(s, idx) in stepIndices"
                  :key="`c-${s}`"
                  class="text-center"
                >
                  <span
                    class="print-check-ico"
                    :class="{
                      'print-check-ico--on': stepCompletedAt(row.item, idx),
                    }"
                  >
                    {{ stepCompletedAt(row.item, idx) ? '☑' : '☐' }}
                  </span>
                </td>
              </tr>
              <tr>
                <th scope="row" class="text-caption text-medium-emphasis">
                  {{ t('churchPlantingProjection.summaryDateCompleted') }}
                </th>
                <td
                  v-for="(s, idx) in stepIndices"
                  :key="`d-${s}`"
                  class="text-center text-body-2"
                >
                  {{ stepDateDone(row.item, idx) }}
                </td>
              </tr>
            </tbody>
          </table>

          <p class="text-overline text-medium-emphasis mb-2 print-section-label">
            {{ t('churchPlantingProjection.sectionSteps') }}
          </p>
          <p
            v-if="row.stepsErr"
            class="text-error text-body-2 mb-2"
          >
            {{ t('churchPlantingProjection.stepsLoadError') }}
          </p>

          <div v-else class="print-matrix-wrap">
            <table v-if="row.steps" class="print-matrix" :aria-label="t('churchPlantingProjection.sectionSteps')">
              <thead>
                <tr>
                  <th scope="col" class="print-matrix-corner text-caption text-medium-emphasis">
                    {{ t('churchPlantingProjection.matrixDateProposed') }}
                  </th>
                  <th
                    v-for="s in stepIndices"
                    :key="`mhd-${s}`"
                    scope="col"
                    class="text-center text-body-2 print-matrix-hd"
                  >
                    {{ formatDateTimeHumanReadable(row.steps[stepField(s, 'date_proposed')]) || '—' }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in rowIndices" :key="`r${r}`">
                  <th scope="row" class="text-caption print-matrix-row-title">
                    {{ row.steps?.[rowTitleField(r)] || '—' }}
                  </th>
                  <td
                    v-for="s in stepIndices"
                    :key="`c-${s}-${r}`"
                    class="text-caption print-matrix-cell"
                  >
                    <span v-if="!cellVal(row.steps, s, r)" class="text-medium-emphasis"> </span>
                    <template v-else>
                      <span class="print-check" :class="{ done: isDone(row.steps, s, r) }">
                        {{ isDone(row.steps, s, r) ? '☑' : '☐' }}
                      </span>
                      {{ cellVal(row.steps, s, r) }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.print-screen-only {
  @media print {
    display: none !important;
  }
}

/* Mỗi projection sang trang mới khi in; trang cuối không thêm trang trắng */
.print-projection--break-after {
  @media print {
    page-break-after: always;
    break-after: page;
  }
}

.print-preview {
  @media print {
    padding: 0 !important;
  }
}

.print-projection {
  @media print {
    margin-bottom: 0;
  }
}

.print-projection__title {
  @media print {
    margin-top: 0;
  }
}

.print-section-label {
  letter-spacing: 0.1em;
}

.print-section-title {
  @media print {
    margin-bottom: 8px;
  }
}

.print-meta,
.print-step-summary,
.print-matrix {
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid #bbb;
    padding: 6px 8px;
    text-align: left;
    vertical-align: middle;
  }
  th {
    background: #f0f0f0;
  }
  thead th {
    background: #eaeaea;
  }
}

.print-meta th[scope='row'] {
  width: 18%;
  min-width: 6rem;
  font-weight: 600;
}

.print-step-summary {
  min-width: 420px;
  th,
  td {
    font-size: 0.875rem;
  }
}

.print-step-corner {
  min-width: 6rem;
}

.print-check-ico {
  font-size: 1.1rem;
  line-height: 1;
  user-select: none;
}

.print-check-ico--on {
  color: #0d47a1;
  font-weight: 700;
}

.print-matrix-wrap {
  overflow-x: auto;
}

.print-matrix {
  min-width: 640px;
  th,
  td {
    vertical-align: top;
  }
  tbody th.print-matrix-row-title {
    max-width: 120px;
    background: #f5f5f5;
  }
  thead th.print-matrix-hd,
  .print-matrix-corner {
    background: #eaeaea;
  }
}

.print-check.done {
  color: #0d47a1;
  font-weight: 700;
}
</style>
