<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { dashboardService } from '@/services/dashboardService';

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  let churchId: number | string | null | undefined = authStore.user?.church_id;
  try {
    const profile = await dashboardService.getProfile();
    churchId = profile?.dashboard_info?.church_id ?? churchId;
  } catch {
    // keep fallback
  }
  if (churchId) {
    await router.replace({
      name: 'PlantingProjectionAdd',
      params: { churchId: String(churchId) },
    });
    return;
  }
  await router.replace({ name: 'ChurchList' });
});
</script>

<template>
  <v-container class="py-8 d-flex justify-center">
    <v-progress-circular indeterminate color="primary" />
  </v-container>
</template>
