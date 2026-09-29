<script setup lang="ts">
import CardHeader from '../shared/CardHeader.vue';
import ChurchPlantingChart from '@/components/charts/ChurchPlantingChart.vue';

defineProps<{
  churchId: number
}>()
</script>

<template>
   <CardHeader :title="$t('chart.churchPlantingTitle')">
      <ChurchPlantingChart :church-id="churchId" />
   </CardHeader>
</template>

<style scoped>

</style>
