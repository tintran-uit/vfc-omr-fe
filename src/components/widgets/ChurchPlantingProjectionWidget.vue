<script setup lang="ts">
import {ref, watch, computed, onMounted, defineAsyncComponent} from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import { churchPlantingProjectionService } from '@/services/churchPlantingProjectionService';
import { formatDateTimeHumanReadable } from '@/helpers/dateTimeHelper';
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
    <v-table class="text-no-wrap bordered-table" density="compact" hover>
      <thead>
        <tr>
          <th rowspan="2">{{ $t('churchPlantingProjection.proposedLaunchDate') }}</th>
          <th rowspan="2">{{ $t('churchPlantingProjection.targetTown') }}</th>
          <th rowspan="2">{{ $t('churchPlantingProjection.estPop') }}</th>
          <th rowspan="2">{{ $t('churchPlantingProjection.proposedLeader') }}</th>
          <th colspan="6" class="text-center">{{ $t('churchPlantingProjection.stepProgressIndicator') }}</th>
        </tr>
        <tr>
          <th v-for="step in steps" :key="step" class="text-center">{{ step }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="projection in projections" :key="projection.id">
          <td>{{ formatDateTimeHumanReadable(projection.start_date_pioneering) }}</td>
          <td>{{ projection.town }}</td>
          <td>{{ projection.population }}</td>
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

<style scoped>
.bordered-table {
  border: 1px solid #ddd;
  width: 100%;
  font-size: 0.9rem;
}

.bordered-table th,
.bordered-table td {
  border-bottom: 1px solid #ddd;
  padding: 6px 12px !important;
  vertical-align: middle;
}

.bordered-table th {
  background-color: #f8f8f8;
  width: 35%;
  font-weight: 600;
  color: #333;
}

.bordered-table tr:last-child th,
.bordered-table tr:last-child td {
  border-bottom: none;
}
</style>
