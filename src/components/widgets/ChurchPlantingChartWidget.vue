<script setup lang="ts">
import {ref, watch, computed, onMounted, defineAsyncComponent, inject } from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import { graphService } from '@/services/graphService';
import { useI18n } from 'vue-i18n';
import ChurchPlantingChart from '@/components/charts/ChurchPlantingChart.vue';

const props = withDefaults(
  defineProps<{
    churchId: number
  }>(),
  {}
)
const { t } = useI18n()
const churchDetail = inject('churchDetail')

</script>

<template>
   <CardHeader :title="t('chart.churchPlantingTitle', {churchName: churchDetail?.church_name})">
      <ChurchPlantingChart :church-id="churchId" />
   </CardHeader>
</template>

<style scoped>

</style>
