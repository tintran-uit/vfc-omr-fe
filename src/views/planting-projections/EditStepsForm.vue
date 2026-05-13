<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { churchPlantingProjectionService } from '@/services/churchPlantingProjectionService';
import { useMessageStore } from '@/stores/messageStore';
import {
  mergeStepsFromApi,
  buildStepsPatchBody,
  stepField,
  stepRowField,
  rowTitleField,
  stepIndices,
  rowIndices,
} from '@/utils/churchPlantingStepsModel';

const { t } = useI18n();
const messageStore = useMessageStore();

const props = withDefaults(
  defineProps<{
    projectionId: number;
    subheading: string;
  }>(),
  {}
);

const emit = defineEmits<{
  (e: 'saved'): void;
}>();

const form = ref<Record<string, any>>({});
const loadError = ref(false);
const loading = ref(true);
const saving = ref(false);

function normalizeGetPayload(raw: any) {
  if (!raw || typeof raw !== 'object') return null;
  return (raw as { data?: unknown }).data != null
    ? (raw as { data: Record<string, any> }).data
    : (raw as Record<string, any>);
}

async function load() {
  loading.value = true;
  loadError.value = false;
  try {
    const raw = await churchPlantingProjectionService.getSteps(props.projectionId, true);
    const p = normalizeGetPayload(raw) ?? raw;
    form.value = mergeStepsFromApi(p);
  } catch (e) {
    console.error(e);
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (Number.isFinite(props.projectionId)) {
    void load();
  } else {
    loadError.value = true;
    loading.value = false;
  }
});

watch(
  () => props.projectionId,
  (id) => {
    if (Number.isFinite(id)) void load();
  }
);

const cellValueKey = (s: number, r: number) => stepRowField(s, r, 'value');

async function onSave() {
  if (saving.value) return;
  saving.value = true;
  try {
    const body = buildStepsPatchBody(form.value);
    await churchPlantingProjectionService.updateSteps(props.projectionId, body);
    emit('saved');
  } catch (e) {
    console.error(e);
    messageStore.error(t('churchPlantingProjection.stepsSaveError'));
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <v-form
    class="edit-steps"
    @submit.prevent="onSave"
  >
    <v-row
      v-if="!loading && !loadError"
      no-gutters
      class="align-center mb-4"
    >
      <v-col cols="12" class="d-flex flex-wrap align-center ga-2">
        <v-icon color="error" size="22">$calendar</v-icon>
        <span class="text-body-2 text-medium-emphasis">
          {{ t('churchPlantingProjection.editStepsFor') }}
        </span>
        <span class="text-h6 font-weight-bold text-primary text-wrap">
          {{ subheading || '—' }}
        </span>
      </v-col>
    </v-row>

    <v-skeleton-loader
      v-if="loading"
      type="table-heading, table-tbody"
      class="bg-transparent"
    />

    <v-alert
      v-else-if="loadError"
      type="error"
      variant="tonal"
      class="mb-0"
    >
      {{ t('churchPlantingProjection.stepsLoadError') }}
      <v-btn class="ms-2" size="small" variant="tonal" @click="load">
        {{ t('churchPlantingProjection.retryLoad') }}
      </v-btn>
    </v-alert>

    <template v-else>
      <div class="text-overline text-medium-emphasis mb-2">
        {{ t('churchPlantingProjection.sectionSteps') }}
      </div>

      <div class="matrix-scroll">
        <div class="table-panel table-panel--matrix">
          <v-table
            class="edit-steps-vtable matrix-style table-grid-vtable"
            density="comfortable"
            hover
          >
            <thead>
              <tr class="matrix-h-row">
                <th
                  class="text-caption text-medium-emphasis matrix-grid-cell matrix-corner"
                  scope="row"
                >
                  {{ t('churchPlantingProjection.labelStepDateProposed') }}
                </th>
                <th
                  v-for="s in stepIndices"
                  :key="`p-${s}`"
                  scope="col"
                  class="edit-steps__date matrix-grid-cell"
                >
                  <YearMonthDayInput
                    v-model="form[stepField(s, 'date_proposed')]"
                    layout="monthTop"
                    density="compact"
                  />
                </th>
              </tr>
              <tr class="matrix-h-row">
                <th
                  class="text-caption text-medium-emphasis matrix-grid-cell matrix-corner"
                  scope="row"
                >
                  {{ t('churchPlantingProjection.labelStepDateCompleted') }}
                </th>
                <th
                  v-for="s in stepIndices"
                  :key="`c-${s}`"
                  scope="col"
                  class="edit-steps__date matrix-grid-cell"
                >
                  <YearMonthDayInput
                    v-model="form[stepField(s, 'date_completed')]"
                    layout="monthTop"
                    density="compact"
                  />
                </th>
              </tr>
              <tr class="matrix-h-row">
                <th
                  class="text-caption font-weight-bold matrix-grid-cell matrix-corner"
                  scope="row"
                >
                  {{ t('churchPlantingProjection.editStepsNumberRow') }}
                </th>
                <th
                  v-for="s in stepIndices"
                  :key="`n-${s}`"
                  class="text-center text-body-2 font-weight-bold matrix-grid-cell"
                  scope="col"
                >
                  {{ s }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in rowIndices"
                :key="`row-${r}`"
                class="matrix-data-row"
              >
                <th
                  scope="row"
                  class="matrix-row-title matrix-grid-cell"
                >
                  <v-label
                    :for="`row-title-${r}`"
                    class="mb-1 d-block text-caption"
                  >
                    {{ t('churchPlantingProjection.rowTitleLabel', { index: r }) }}
                  </v-label>
                  <v-text-field
                    :id="`row-title-${r}`"
                    v-model="form[rowTitleField(r)]"
                    density="compact"
                    hide-details
                    variant="outlined"
                    :name="`row${r}_title`"
                  />
                </th>
                <td
                  v-for="s in stepIndices"
                  :key="`v-${r}-${s}`"
                  class="matrix-grid-cell"
                >
                  <v-textarea
                    :id="`cell-${r}-${s}`"
                    v-model="form[cellValueKey(s, r)]"
                    :rows="3"
                    auto-grow
                    variant="outlined"
                    hide-details
                    class="text-body-2"
                    density="compact"
                    :aria-label="
                      t('churchPlantingProjection.stepTitle', { step: s }) +
                      ' — ' +
                      t('churchPlantingProjection.rowTitleLabel', { index: r })
                    "
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>

      <v-row class="mt-4">
        <v-col
          cols="12"
          class="text-end"
        >
          <v-btn
            type="submit"
            color="primary"
            size="large"
            variant="flat"
            :loading="saving"
            :disabled="saving"
          >
            {{ t('save') }}
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-form>
</template>

<style scoped lang="scss">
/* Giống List.vue matrix: panel + bảng lưới toàn cục từ .table-grid-vtable */
.matrix-scroll {
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

.edit-steps-vtable {
  min-width: 1000px;
}

.edit-steps-vtable.matrix-style :deep(.v-table__wrapper > table) {
  min-width: 1000px;
}

/* Padding ô giống List matrix */
.edit-steps-vtable :deep(.v-table__wrapper > table th.matrix-grid-cell),
.edit-steps-vtable :deep(.v-table__wrapper > table td.matrix-grid-cell) {
  padding: 8px 10px;
}

/* Sticky cột đầu (cuộn ngang) */
.edit-steps-vtable :deep(thead th.matrix-corner),
.edit-steps-vtable :deep(tbody th.matrix-row-title) {
  position: sticky;
  left: 0;
  z-index: 2;
  box-shadow: 3px 0 8px -4px rgba(0, 0, 0, 0.1);
  background-clip: padding-box;
}

.edit-steps-vtable :deep(thead th.matrix-corner) {
  z-index: 3;
  background: rgba(var(--v-theme-primary), 0.1) !important;
}

/* Hàng header date */
.edit-steps-vtable :deep(tr.matrix-h-row) {
  th.matrix-grid-cell {
    vertical-align: top;
    background: rgba(var(--v-theme-primary), 0.06);
  }
}

/* Zebra dữ liệu */
.edit-steps-vtable
  :deep(
    tbody tr.matrix-data-row:nth-child(odd) th.matrix-grid-cell,
    tbody tr.matrix-data-row:nth-child(odd) td.matrix-grid-cell
  ) {
  background: rgb(var(--v-theme-surface));
}
.edit-steps-vtable
  :deep(
    tbody tr.matrix-data-row:nth-child(even) th.matrix-grid-cell,
    tbody tr.matrix-data-row:nth-child(even) td.matrix-grid-cell
  ) {
  background: rgba(var(--v-theme-on-surface), 0.05);
}
.edit-steps-vtable :deep(tbody tr.matrix-data-row:nth-child(odd) th.matrix-row-title) {
  background: rgb(var(--v-theme-surface)) !important;
}
.edit-steps-vtable :deep(tbody tr.matrix-data-row:nth-child(even) th.matrix-row-title) {
  background: rgba(var(--v-theme-on-surface), 0.05) !important;
}

/* Ô chọn ngày: hàng đầu cột đã mô tả; ẩn label lặp của YearMonthDayInput */
.edit-steps__date {
  :deep(.v-input) {
    margin-top: 0;
  }
  :deep(.v-input .v-input__control) {
    min-width: 0;
  }
  :deep(.v-label) {
    display: none;
  }
  /* Fix: khoảng cách giữa Month và Day+Year */
  :deep(.ymd-monthTop__month) {
    margin-bottom: 2px;
  }
}
</style>
