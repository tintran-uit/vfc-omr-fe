<script setup lang="ts">
import { dashboardService } from '@/services/dashboardService';
import { computed, onMounted, ref, provide } from 'vue';
import { churchService } from '@/services/churchService';
import { userService } from '@/services/userService';
import OverviewChurch from '@/views/churches/OverviewChurch.vue';
import { usePastorChurchStore } from '@/stores/pastorChurchStore';

const pastorChurchStore = usePastorChurchStore();
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
    const churchId = dashboardData.value?.dashboard_info?.church_id;
    await fetchChurchDetail(churchId);
    pastorChurchStore.setSelectedChurchId(churchId ?? churchDetail.value?.id);
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

const switchToChurch = async (churchId) => {
  pastorChurchStore.setSelectedChurchId(churchId);

  await fetchProfileByChurchId(churchId);
  await fetchChurchDetail(churchId);
  pastorChurchStore.setSelectedChurchId(churchId ?? churchDetail.value?.id);
}
</script>

<template>
  <OverviewChurch>
    <template v-slot:switch="{ title }">
      <v-menu>
        <template #activator="{ props: menuProps }">
          <v-tooltip :text="$t('church.switchAnotherChurches')" location="top">
            <template #activator="{ props: tooltipProps }">
              <h1 class="overview-church-header__title">
                <button
                  type="button"
                  v-bind="{ ...menuProps, ...tooltipProps }"
                  class="church-switch-trigger"
                >
                  <span>{{ title }}</span>
                  <v-icon icon="$menuDown" size="20" class="church-switch-caret" />
                </button>
              </h1>
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
.church-switch-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.church-switch-caret {
  flex: 0 0 auto;
  color: #1c1c1e;
  pointer-events: none;
}

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