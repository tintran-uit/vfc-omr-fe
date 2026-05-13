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
} from '@/helpers/churchPlantingProjectionDisplay';
const { t } = useI18n();
const authStore = useAuthStore();

const items = ref<Record<string, any>[]>([]);
const churchLabel = ref('');
const loadError = ref('');

const churchId = ref<number | null>(null);

const hasRows = computed(() => items.value.length > 0);

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
  churchId.value = Number(cid);
  try {
    const { items: data } = await churchPlantingProjectionService.getListByChurchWithStep(
      churchId.value,
      { page: 1, limit: 500 }
    );
    items.value = data || [];
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
  <v-container class="print-root py-4 py-md-6">
    <div class="d-flex flex-wrap align-center justify-space-between gap-2 mb-4 print-hide">
      <h1 class="text-h5 text-md-h4 font-weight-bold">
        {{ t('churchPlantingProjection.printTitleSimple') }}
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

    <v-alert v-if="loadError" type="warning" variant="tonal" class="mb-4 print-hide">
      {{ loadError }}
    </v-alert>

    <v-alert v-else-if="!hasRows" type="info" variant="tonal" class="print-hide">
      {{ t('noData') }}
    </v-alert>

    <div v-else class="printable-area">
      <table class="data-sheet" aria-label="Church planting projections">
        <thead>
          <tr>
            <th scope="col">{{ t('churchPlantingProjection.proposedChurchName') }}</th>
            <th scope="col">{{ t('churchPlantingProjection.targetTown') }}</th>
            <th scope="col">{{ t('churchPlantingProjection.proposedLeader') }}</th>
            <th scope="col">{{ t('churchPlantingProjection.estPop') }}</th>
            <th scope="col">{{ t('churchPlantingProjection.proposedLaunchDate') }}</th>
            <th scope="col">{{ t('churchPlantingProjection.stepProgressSummaryLabel') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.id">
            <td>{{ row.proposed_church_name || '—' }}</td>
            <td>{{ row.town || '—' }}</td>
            <td>{{ row.proposed_leader_name || '—' }}</td>
            <td>{{ displayFormattedPopulation(row.population) || '—' }}</td>
            <td>{{ formatDateTimeHumanReadable(displayStartDatePioneering(row)) || '—' }}</td>
            <td>
              <template v-if="row.steps_completed && row.steps_completed.length">
                {{ row.steps_completed.filter(Boolean).length }} / 6
              </template>
              <template v-else>—</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.print-hide {
  @media print {
    display: none !important;
  }
}

.data-sheet {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th,
  td {
    border: 1px solid rgba(0, 0, 0, 0.2);
    padding: 8px 10px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background: rgba(0, 0, 0, 0.04);
    font-weight: 600;
  }
}
</style>
