<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { churchPlantingProjectionService } from '@/services/churchPlantingProjectionService';
import { useMessageStore } from '@/stores/messageStore';
import YearMonthDayInput from '@/components/input/YearMonthDayInput.vue';
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
      <v-btn
        class="ms-2"
        size="small"
        variant="tonal"
        @click="load"
      >
        {{ t('churchPlantingProjection.retryLoad') }}
      </v-btn>
    </v-alert>

    <template v-else>
      <div class="d-flex flex-wrap align-center justify-space-between ga-2 mb-3">
        <div class="text-overline text-medium-emphasis mb-0">
          {{ t('churchPlantingProjection.sectionSteps') }}
        </div>
        <div class="text-caption text-medium-emphasis">
          {{ t('churchPlantingProjection.editStepsScrollHint') }}
        </div>
      </div>

      <div class="matrix-scroll">
        <div class="table-panel table-panel--matrix">
          <v-table
            class="edit-steps-vtable matrix-style table-grid-vtable"
            density="comfortable"
            hover
          >
            <thead>
              <!-- Step numbers as clear column headers -->
              <tr class="matrix-h-row matrix-h-row--steps">
                <th
                  class="text-caption font-weight-bold matrix-grid-cell matrix-corner"
                  scope="col"
                >
                  {{ t('churchPlantingProjection.editStepsNumberRow') }}
                </th>
                <th
                  v-for="s in stepIndices"
                  :key="`n-${s}`"
                  class="text-center matrix-grid-cell edit-steps__step-col"
                  scope="col"
                >
                  <span class="edit-steps__step-badge">{{ s }}</span>
                  <span class="d-block text-caption font-weight-medium mt-1">
                    {{ t('churchPlantingProjection.stepTitle', { step: s }) }}
                  </span>
                </th>
              </tr>

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
                  class="edit-steps__date matrix-grid-cell edit-steps__step-col"
                >
                  <YearMonthDayInput
                    v-model="form[stepField(s, 'date_proposed')]"
                    layout="monthTop"
                    density="compact"
                    mode="range"
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
                  class="edit-steps__date matrix-grid-cell edit-steps__step-col"
                >
                  <YearMonthDayInput
                    v-model="form[stepField(s, 'date_completed')]"
                    layout="monthTop"
                    density="compact"
                    mode="range"
                  />
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="r in rowIndices"
                :key="`row-${r}`"
                class="matrix-data-row"
                :class="r % 2 === 1 ? 'matrix-data-row--odd' : 'matrix-data-row--even'"
              >
                <th
                  scope="row"
                  class="matrix-row-title matrix-grid-cell"
                >
                  <v-label
                    :for="`row-title-${r}`"
                    class="mb-1 d-block text-caption text-medium-emphasis"
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
                  class="matrix-grid-cell edit-steps__step-col"
                >
                  <v-textarea
                    :id="`cell-${r}-${s}`"
                    v-model="form[cellValueKey(s, r)]"
                    :placeholder="t('churchPlantingProjection.rowPlaceholder')"
                    :rows="2"
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

      <div class="edit-steps__actions">
        <div class="d-flex justify-end">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            variant="flat"
            :loading="saving"
            :disabled="saving"
          >
            {{ t('churchPlantingProjection.saveSteps') }}
          </v-btn>
        </div>
      </div>
    </template>
  </v-form>
</template>

<style scoped lang="scss">
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
  min-width: 1180px;
}

.edit-steps-vtable.matrix-style :deep(.v-table__wrapper > table) {
  min-width: 1180px;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}

.edit-steps-vtable :deep(.v-table__wrapper > table th.matrix-grid-cell),
.edit-steps-vtable :deep(.v-table__wrapper > table td.matrix-grid-cell) {
  padding: 10px 12px;
  vertical-align: top;
}

/* Sticky first column */
.edit-steps-vtable :deep(thead th.matrix-corner),
.edit-steps-vtable :deep(tbody th.matrix-row-title) {
  position: sticky;
  left: 0;
  z-index: 2;
  width: 220px;
  min-width: 220px;
  max-width: 220px;
  box-shadow: 3px 0 8px -4px rgba(0, 0, 0, 0.12);
  background-clip: padding-box;
}

.edit-steps-vtable :deep(thead th.matrix-corner) {
  z-index: 3;
  background: rgba(var(--v-theme-primary), 0.1) !important;
}

.edit-steps__step-col {
  width: 160px;
  min-width: 160px;
}

.edit-steps__step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
}

.edit-steps-vtable :deep(tr.matrix-h-row) {
  th.matrix-grid-cell {
    background: rgba(var(--v-theme-primary), 0.06);
  }
}

.edit-steps-vtable :deep(tr.matrix-h-row--steps) {
  th.matrix-grid-cell {
    background: rgba(var(--v-theme-primary), 0.1);
    text-align: center;
  }
}

/* Zebra: class-based so sticky title + value cells stay in sync */
.edit-steps-vtable :deep(tbody tr.matrix-data-row--odd > .matrix-grid-cell) {
  background: rgb(var(--v-theme-surface)) !important;
}

.edit-steps-vtable :deep(tbody tr.matrix-data-row--even > .matrix-grid-cell) {
  background: rgba(var(--v-theme-on-surface), 0.04) !important;
}

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

  :deep(.ymd-monthTop__month) {
    margin-bottom: 4px;
  }

  :deep(.v-field),
  :deep(.v-field__input),
  :deep(input) {
    font-size: 0.8125rem;
    font-weight: 400;
  }
}

/* Inputs inherit bold from table headers — keep body text regular */
.edit-steps-vtable :deep(.matrix-row-title .v-field),
.edit-steps-vtable :deep(.matrix-row-title .v-field__input),
.edit-steps-vtable :deep(.matrix-row-title input),
.edit-steps-vtable :deep(td.matrix-grid-cell .v-field),
.edit-steps-vtable :deep(td.matrix-grid-cell .v-field__input),
.edit-steps-vtable :deep(td.matrix-grid-cell textarea) {
  font-weight: 400;
}

/* Inputs keep a solid surface background so editable areas stand out on zebra rows */
.edit-steps-vtable :deep(.matrix-grid-cell .v-field) {
  background: rgb(var(--v-theme-surface));
}

.edit-steps__actions {
  position: sticky;
  bottom: 0;
  z-index: 4;
  margin-top: 16px;
  margin-left: -8px;
  margin-right: -8px;
  padding: 12px 8px;
  background: rgba(var(--v-theme-surface), 0.94);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
