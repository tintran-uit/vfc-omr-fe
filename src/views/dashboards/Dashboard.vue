<script setup lang="ts">
// imported components
// import RecentOrder from './components/RecentOrder.vue';
// import TransactionHistory from './components/TransactionHistory.vue';
// import HelpSupport from './components/HelpSupport.vue';
import WidgetFive from '../widgets/statistics/components/WidgetFive.vue';
// import UniqueVisitor from '../../widgets/chart/components/UniqueVisitor.vue';
// import IncomeOverview from '../../widgets/chart/components/IncomeOverview.vue';
// import AnalyticsReport from './components/AnalyticsReport.vue';
// import SalesReport from '../../widgets/chart/components/SalesReport.vue';
// import Attendance from '../../widgets/chart/components/Attendance.vue';
// import Pie from '../../widgets/chart/components/Pie.vue';
import { useAuthStore } from '@/stores/authStore';
import { dashboardService } from '@/services/dashboardService';
import { computed, onMounted, ref, shallowRef } from 'vue';
import { RiseOutlined, FallOutlined, BankOutlined, UsergroupAddOutlined, MoneyCollectFilled } from '@ant-design/icons-vue';
import SelectInput from '@/components/input/SelectInput.vue';

const menus = [
  {
    title: 'dashboardMenu.monthlyData',
    icon: '$chartBar',
  },
  {
    title: 'dashboardMenu.editChurch',
    icon: '$edit',
  },
  {
    title: 'dashboardMenu.worshipServices',
    icon: '$plusCircleOutline',
  },
  {
    title: 'dashboardMenu.newPastorAndNewChurch',
    icon: '$plusCircleOutline'
  },
  {
    title: 'dashboardMenu.newPastor',
    icon: '$plusCircleOutline'
  },
  {
    title: 'dashboardMenu.newChurch',
    icon: '$plusCircleOutline'
  },
]

const authStore = useAuthStore();

const profile = ref({})
const assignedChurches = computed(() => {
  return profile.value.assigned_churches || [];
})
const currentChurchId = ref(null)
const currentChurch = computed(() => {console.log('ccid', currentChurchId.value)
  return assignedChurches.value.find(church => church.id === currentChurchId.value) || null;
})
const metrics = shallowRef([
  {
    name: 'dashboard.people',
    earnKey: 'avg_attendance',
    percentKey: null,
    color: 'primary',
    icon: '$accountGroup',
  },
  {
    name: 'dashboard.giving',
    earnKey: 'avg_monthly_giving',
    percentKey: null,
    color: 'primary',
    icon: '$currencyUsd',
  },
  {
    name: 'dashboard.churchPlants',
    earnKey: 'church_plants',
    percentKey: null,
    color: 'primary',
    icon: '$church',
  },
  {
    name: 'dashboard.growth',
    earnKey: null,
    percentKey: 'growth',
    color: 'primary',
    icon: '$trendingUp',
  },
])

const fetchDefaultProfile = async () => {
  try {
    profile.value = await dashboardService.getProfile();console.log('f', profile.value.dashboard_metrics.church_id)
    currentChurchId.value = profile.value.dashboard_metrics.church_id
  } catch (error) {
    console.error('Failed to fetch default profile:', error);
  }
}

const fetchProfileByChurchId = async (churchId) => {
  try {
    profile.value = await dashboardService.getProfileByChurchId(churchId);
  } catch (error) {
    console.error('Failed to fetch profile by church ID:', error);
  }
}

onMounted(async () => {
  try {
    fetchDefaultProfile();
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
});

const go = (item) => {
  console.log("Go to:", item.title)
}

const handleChangeProfile = (churchId) => {
  currentChurchId.value = churchId
  fetchProfileByChurchId(churchId)
}
</script>

<template>
  <v-card flat>
  <!-- Cover -->
  <v-img
    :src="currentChurch?.photo_url"
    height="150"
    cover
    class="bg-grey-darken-2"
    style="background-color: #ccc;"
  >
  </v-img>

  <!-- Avatar + Info -->
  <v-container class="position-relative">
    <v-row>
      <!-- Avatar bên trái -->
      <v-col cols="12" sm="2" class="position-relative">
        <v-avatar
          size="149"
          class="elevation-4 profile-avatar"
        >
          <v-img :src="authStore.avatarUrl" />
        </v-avatar>
        <div style="clear: both"></div>
      </v-col>

      <!-- User info ở giữa -->
      <v-col cols="12" sm="6" class="d-flex flex-column justify-center text-center text-sm-left">
        <div class="text-h4">
          {{ currentChurch?.name }}
          <v-menu>
            <template #activator="{ props: menuProps }">
              <v-tooltip text="Switch to another church" location="top">
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
                @click="handleChangeProfile(item.id)"
              >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div class="text-h5 font-weight-bold mb-1 text-medium-emphasis">
          {{ authStore.fullName }} ({{ authStore.user?.role?.name }})
        </div>
      </v-col>
    </v-row>
  </v-container>
</v-card>

    <v-row class="my-0">
      <v-col cols="6" sm="6" md="3" v-for="(metric, i) in metrics" :key="i">
        <v-card elevation="0" class="h-100">
          <v-card variant="outlined" class="h-100">
            <v-card-text class="h-100">
              <div class="d-flex align-items-center justify-space-between">
                <v-row class="mb-0">
                  <v-col cols="3" class="d-flex align-center justify-center">
                    <v-icon color="primary" class="mr-2 align-middle" :icon="metric.icon" size="36"></v-icon>
                  </v-col>

                  <v-col cols="7">
                    <h4 class="text-h4 d-flex align-center mb-0" v-if="metric.earnKey">
                      {{ profile?.dashboard_metrics?.[metric.earnKey] || 0 }}
                    </h4>
                    <h4 class="text-h4 d-flex align-center mb-0" v-else-if="metric.percentKey">
                      {{ profile?.dashboard_metrics?.[metric.percentKey] || 0 }}%
                    </h4>
                    <h6 class="text-h6 text-lightText mb-1">
                      {{ $t(metric.name) }}
                    </h6>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>

    <!-- Menu -->
    <v-container fluid>
    <v-row class="pa-0" align="stretch">
      <v-col
        v-for="(menu, idx) in menus"
        :key="idx"
        cols="12"
        md="6"
        class="d-flex"
      >
        <a href="#" class="link-item d-flex align-center w-100 text-primary">
          <v-icon size="24" class="me-3 text-primary">{{ menu.icon }}</v-icon>
          <span class="text-body-1">{{ $t(menu.title) }}</span>
        </a>
      </v-col>
    </v-row>
  </v-container>
     <!-- #Menu -->

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