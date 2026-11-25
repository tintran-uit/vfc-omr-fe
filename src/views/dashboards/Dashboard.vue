<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useAuthStore } from '@/stores/authStore'
import DashboardAdmin from '@/views/dashboards/DashboardAdmin.vue'
import DashboardOverseer from '@/views/dashboards/DashboardOverseer.vue'
import DashboardPastor from '@/views/dashboards/DashboardPastor.vue'

const authStore = useAuthStore()

const dashboard = computed(() => {
  if (authStore.can('dashboard.admin')) {
    return DashboardAdmin
  }
  if (authStore.can('dashboard.overseer')) {
    return DashboardOverseer
  }
  return DashboardPastor
})
</script>

<template>
  <component :is="dashboard" />
</template>

<style scoped lang="scss">

</style>