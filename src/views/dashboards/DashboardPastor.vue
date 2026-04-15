<script setup lang="ts">
import { dashboardService } from '@/services/dashboardService';
import { computed, onMounted, ref, provide, watch } from 'vue';
import { churchService } from '@/services/churchService';
import { userService } from '@/services/userService';
import OverviewChurch from '@/views/churches/OverviewChurch.vue';

const selectedChurchId = ref()
const churchDetail = ref({})
provide('churchDetail', churchDetail)
const dashboardData = ref({})
provide('dashboardData', dashboardData)
const pastor = ref({})
provide('pastor', pastor)
const assignedChurches = computed(() => {
  return dashboardData.value?.assigned_churches || [];
})

const fetchDefaultProfile = async () => {
  try {
    dashboardData.value = await dashboardService.getProfile();
    selectedChurchId.value = dashboardData.value?.dashboard_info?.church_id;
    fetchChurchDetail(selectedChurchId.value)
  } catch (error) {
    console.error('Failed to fetch default profile:', error);
  }
}

const fetchProfileByChurchId = async (churchId) => {
  try {
    dashboardData.value = await dashboardService.getProfileByChurchId(churchId);
  } catch (error) {
    console.error('Failed to fetch profile by church ID:', error);
  }
}

const fetchChurchDetail = async (churchId) => {
  try {
    churchDetail.value = await churchService.get(churchId);

    pastor.value = await userService.get(
      churchDetail.value?.pastor_id
    );
  } catch (error) {
    console.error('Failed to fetch church detail:', error);
  }
}

onMounted(async () => {
  try {
    fetchDefaultProfile()
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
});

const switchToChurch = (churchId) => {
  selectedChurchId.value = churchId

  fetchProfileByChurchId(churchId)
  fetchChurchDetail(churchId)
}
</script>

<template>
  <OverviewChurch>
    <template v-slot:switch>
      <v-menu>
            <template #activator="{ props: menuProps }">
              <v-tooltip :text="$t('church.switchAnotherChurches')" location="top">
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    v-bind="{ ...menuProps, ...tooltipProps }"
                    icon="$swapHorizontal"
                    color="primary"
                    variant="text"
                  />
                </template>
              </v-tooltip>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, index) in assignedChurches"
                :key="index"
                @click="switchToChurch(item.id)"
              >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
    </template>
  </OverviewChurch>
</template>

<style scoped lang="scss">
.profile-avatar {
  position: relative;
    top: 0px;
    left: none;
  z-index:1;
   border: 1px solid white;
   margin-left: auto;
   margin-right: auto;
   margin-top: -70px;
   display: block;
}

@media (min-width: 768px) {
  .profile-avatar {
    position:absolute; 
    left:16px;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>