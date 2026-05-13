<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { dashboardService } from '@/services/dashboardService';

const router = useRouter();
const authStore = useAuthStore();

const redirectToProjectionList = async () => {
  try {
    const profile = await dashboardService.getProfile();
    const churchId = profile?.dashboard_info?.church_id ?? authStore.user?.church_id;

    if (churchId) {
      router.replace({ name: 'PlantingProjectionList', params: { churchId } });
      return;
    }
  } catch (error) {
    const churchId = authStore.user?.church_id;

    if (churchId) {
      router.replace({ name: 'PlantingProjectionList', params: { churchId } });
      return;
    }
  }

  router.replace({ name: 'ChurchList' });
};

onMounted(() => {
  redirectToProjectionList();
});
</script>

<template>
  <v-container class="py-8">
    <v-progress-circular
      indeterminate
      color="primary"
    />
  </v-container>
</template>

<style scoped lang="scss">
</style>
