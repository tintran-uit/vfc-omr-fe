<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import peopleIcon from '@/assets/images/metrics/people.svg'
import givingIcon from '@/assets/images/metrics/giving.svg'
import plantIcon from '@/assets/images/metrics/plant.svg'
import growthIcon from '@/assets/images/metrics/growth.svg'
import { churchService } from '@/services/churchService';
import PastorLeaderWidget from '@/components/widgets/PastorLeaderWidget.vue';
import ChurchDetailWidget from '@/components/widgets/ChurchDetailWidget.vue';
import { dashboardService } from '@/services/dashboardService';
import OverviewChurch from './OverviewChurch.vue';
import { userService } from '@/services/userService';

const props = withDefaults(
  defineProps<{
    
  }>(),
  {
    
  }
)
const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const selectedChurch = ref({})
const selectedChurchId = ref(null)
const churchDetail = ref({})
provide('churchDetail', churchDetail)
const dashboardData = ref({})
provide('dashboardData', dashboardData)
const pastor = ref({})
provide('pastor', pastor)
const assignedChurches = computed(() => {
  return dashboardData.value?.assigned_churches || [];
})

const fetchData = async (churchId) => {
  try {
    churchDetail.value = await churchService.get(churchId);

    pastor.value = await userService.get(
      churchDetail.value?.pastor_id
    );
  } catch (error) {
    
  }
}

const fetchDashboardByChurch = async (churchId) => {
  try {
    dashboardData.value = await dashboardService.getProfileByChurchId(churchId);
  } catch (error) {
    console.error('Failed to fetch profile by church ID:', error);
  }
}

watch(
  () => route.params.id,
  (newId) => {
    id.value = newId;
  
    if (!newId) return;

    fetchData(newId);
    fetchDashboardByChurch(newId);
  },
  { immediate: true }
);
</script>

<template>
  <OverviewChurch />
 
</template>
<style scoped lang="scss">

</style>