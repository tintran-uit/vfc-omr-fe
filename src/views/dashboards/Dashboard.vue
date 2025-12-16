<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useAuthStore } from '@/stores/authStore'
import DashboardAdmin from '@/views/dashboards/DashboardAdmin.vue'
import DashboardOverseer from '@/views/dashboards/DashboardOverseer.vue'
import DashboardPastor from '@/views/dashboards/DashboardPastor.vue'

const authStore = useAuthStore()

const dashboard = computed(() => {
  if (authStore.isRoleAdmin || authStore.isRoleSuperAdmin) {
    return DashboardAdmin
  } else if (authStore.isRoleOverseer) {
    return DashboardOverseer
  } else {
    return DashboardPastor
  }
})
</script>

<template>
  <component :is="dashboard" />
</template>

<style scoped lang="scss">

</style>