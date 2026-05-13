<script setup lang="ts">
import { ref, watch } from 'vue';
import CardHeader from '../shared/CardHeader.vue';
import { churchPlantingProjectionService } from '@/services/churchPlantingProjectionService';
import { formatDateTimeHumanReadable } from '@/helpers/dateTimeHelper';
import {
  displayFormattedPopulation,
  displayStartDatePioneering,
} from '@/helpers/churchPlantingProjectionDisplay';
import { range } from '@/utils/arrayUtil'

const props = withDefaults(
  defineProps<{
    churchId: number,
  }>(),
  {
  }
)

const projections = ref([])
const fetchData = async (churchId) => {
  const {items} = await churchPlantingProjectionService.getListByChurchWithStep(churchId, false)

  projections.value = items
}

const headingClass = 'text-left font-weight-medium'
const steps = range(1, 6)

watch(
  () => props.churchId,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      fetchData(newVal)
    }
  },
  { immediate: true }
)
</script>

<template>
  <CardHeader :title="$t('churchPlantingProjection.dashboardTitle')">
    <v-table class="text-no-wrap cpp-widget-table table-grid-vtable" density="compact" hover>
      <thead>
        <tr>
          <th rowspan="2">{{ $t('churchPlantingProjection.proposedLaunchDate') }}</th>
          <th rowspan="2">{{ $t('churchPlantingProjection.targetTown') }}</th>
          <th rowspan="2">{{ $t('churchPlantingProjection.estPop') }}</th>
          <th rowspan="2">{{ $t('churchPlantingProjection.proposedLeader') }}</th>
          <th colspan="6" class="text-center">{{ $t('churchPlantingProjection.stepProgressSummaryLabel') }}</th>
        </tr>
        <tr>
          <th v-for="step in steps" :key="step" class="text-center">{{ step }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="projection in projections" :key="projection.id">
          <td>{{ formatDateTimeHumanReadable(displayStartDatePioneering(projection)) }}</td>
          <td>{{ projection.town }}</td>
          <td>{{ displayFormattedPopulation(projection.population) || '—' }}</td>
          <td>{{ projection.proposed_leader_name }}</td>
          <td v-for="step in steps" :key="step">
            <v-icon v-if="projection?.steps_completed?.[step-1]" color="success">$checkboxMarkedOutline</v-icon>
            <v-icon v-else class="text-disabled">$checkboxBlankOutline</v-icon>
          </td>
        </tr>
        
      </tbody>
    </v-table>
  </CardHeader>
</template>

<style scoped lang="scss">
.cpp-widget-table.v-table {
  font-size: 0.875rem;
}

/* Lưới ô: class table-grid-vtable + _override.scss */
.cpp-widget-table.table-grid-vtable {
  :deep(.v-table__wrapper > table) {
    background: rgb(var(--v-theme-surface));
  }
  :deep(.v-table__wrapper > table th),
  :deep(.v-table__wrapper > table td) {
    padding: 8px 10px !important;
  }
  :deep(thead th) {
    background: rgba(var(--v-theme-primary), 0.06);
    font-weight: 600;
    color: rgba(var(--v-theme-on-surface), 0.85);
  }
}
</style>
