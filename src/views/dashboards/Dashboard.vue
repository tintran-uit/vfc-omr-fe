<script setup lang="ts">
import WidgetFive from '../widgets/statistics/components/WidgetFive.vue';
import { useAuthStore } from '@/stores/authStore';
import { dashboardService } from '@/services/dashboardService';
import { computed, onMounted, ref, shallowRef, provide } from 'vue';
import { RiseOutlined, FallOutlined, BankOutlined, UsergroupAddOutlined, MoneyCollectFilled } from '@ant-design/icons-vue';
import { formatDate } from '@/helpers/dateTimeHelper';
import SelectInput from '@/components/input/SelectInput.vue';
import peopleIcon from '@/assets/images/metrics/people.svg'
import givingIcon from '@/assets/images/metrics/giving.svg'
import plantIcon from '@/assets/images/metrics/plant.svg'
import growthIcon from '@/assets/images/metrics/growth.svg'
import groupPeopleIcon from '@/assets/images/metrics/group-people.svg'
import ChurchDetailWidget from '@/components/widgets/ChurchDetailWidget.vue';
import PastorLeaderWidget from '@/components/widgets/PastorLeaderWidget.vue';
import RelatedUserWidget from '@/components/widgets/RelatedUserWidget.vue';
import ChurchPlantingProjectionWidget from '@/components/widgets/ChurchPlantingProjectionWidget.vue';
import AttachmentWidget from '@/components/widgets/AttachmentWidget.vue';
import DaugterChurchWidget from '@/components/widgets/DaugterChurchWidget.vue';
import AttendanceChartWidget from '@/components/widgets/AttendanceChartWidget.vue';
import ChurchPlantingChartWidget from '@/components/widgets/ChurchPlantingChartWidget.vue';

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

const selectedChurch = ref({})
provide('churchDetail', selectedChurch)
const selectedChurchId = ref(null)
const dashboardData = ref({})
const assignedChurches = computed(() => {
  return dashboardData.value?.assigned_churches || [];
})
const metrics = shallowRef([
  {
    name: 'dashboard.people',
    earnKey: 'avg_attendance',
    percentKey: null,
    color: 'primary',
    icon: peopleIcon
  },
  {
    name: 'dashboard.growth',
    earnKey: null,
    percentKey: 'growth',
    color: 'primary',
    icon: growthIcon,
  },
  {
    name: 'dashboard.givingTithes',
    earnKey: 'avg_monthly_giving',
    percentKey: null,
    color: 'primary',
    icon: givingIcon,
  },
  {
    name: 'dashboard.churchPlants',
    earnKey: 'total_church_plants',
    percentKey: null,
    color: 'primary',
    icon: plantIcon,
  },
  {
    name: 'dashboard.givingMFP',
    earnKey: 'avg_monthly_mfp_giving',
    percentKey: null,
    color: 'primary',
    icon: givingIcon,
  },
  {
    name: 'dashboard.peopleInCG',
    earnKey: 'avg_cell_group_attendance',
    percentKey: null,
    color: 'primary',
    icon: groupPeopleIcon,
  },
  {
    name: 'dashboard.peopleInGTAndLIW',
    earnKey: 'avg_liw_students',
    percentKey: null,
    color: 'primary',
    icon: groupPeopleIcon,
  },
  {
    name: 'dashboard.newDecisions',
    earnKey: 'avg_new_decisions',
    percentKey: null,
    color: 'primary',
    icon: groupPeopleIcon,
  },
])

const fetchDefaultProfile = async () => {
  try {
    dashboardData.value = await dashboardService.getProfile();
    selectedChurch.value = dashboardData.value?.dashboard_info;
    selectedChurchId.value = selectedChurch.value?.church_id;
  } catch (error) {
    console.error('Failed to fetch default profile:', error);
  }
}

const fetchProfileByChurchId = async (churchId) => {
  try {
    dashboardData.value = await dashboardService.getProfileByChurchId(churchId);
    selectedChurch.value = dashboardData.value?.dashboard_info;
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

const onChangeChurch = (churchId) => {
  selectedChurchId.value = churchId
  fetchProfileByChurchId(churchId)
}
</script>

<template>
  <v-card flat>
  <!-- Cover -->
  <v-img
    :src="selectedChurch?.photo_url"
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
      <v-col cols="12" sm="10" class="d-flex flex-column justify-center text-center text-sm-left">
        <div class="text-h4 mb-1 text-medium-emphasis">
          {{ authStore.fullName }}
        </div>

        <div class="text-h4">
          {{ selectedChurch?.church_name }}
          <template v-if="selectedChurch?.verified_by_user_id">
            <v-tooltip>
              <template #activator="{ props: tooltipProps }">
                <v-icon v-bind="{ ...menuProps, ...tooltipProps }" class="text-success" size="20">$checkDecagramOutline</v-icon>
              </template>

              Verified by {{ selectedChurch?.verified_by_user_name }}<br />{{ formatDate(selectedChurch?.verified_date, 'MMMM YYYY') }}
            </v-tooltip>
          </template>
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
                @click="onChangeChurch(item.id)"
              >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        
        <v-row class="align-center">
          <v-col cols="8" class="text-medium-emphasis text-body-1">
            {{ selectedChurch?.city_name }}, {{ selectedChurch?.country_name }}<br />
            Last Monthly Record: {{ formatDate(selectedChurch?.last_report_date, 'MMMM YYYY') }}
          </v-col>
          <v-col cols="4" class="text-right text-medium-emphasis text-body-1">
            <v-img :src="selectedChurch?.church_region_logo_url" :alt="selectedChurch?.church_region_name" :width="100"></v-img>
          </v-col>
        </v-row>
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
                    <v-img :src="metric.icon" alt="icon" width="40" height="40" />
                  </v-col>

                  <v-col cols="7">
                    <h4 class="text-h4 d-flex align-center mb-0" v-if="metric.earnKey">
                      {{ dashboardData?.dashboard_indicators?.[metric.earnKey] || 0 }}
                    </h4>
                    <h4 class="text-h4 d-flex align-center mb-0" v-else-if="metric.percentKey">
                      {{ dashboardData?.dashboard_indicators?.[metric.percentKey] || 0 }}%
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
     <!-- <v-row class="pa-0" align="stretch">
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
    </v-row> -->

    <!-- Attendance, giving & visit chart -->
    <v-row>
      <v-col cols="12">
        <AttendanceChartWidget :church-id="selectedChurch?.church_id" />
      </v-col>
    </v-row>
    <!-- #Attendance, giving & visit chart -->

    <!-- Church Planting chart -->
    <!-- <v-row>
      <v-col cols="12">
        <ChurchPlantingChartWidget :church-id="selectedChurch?.church_id" />
      </v-col>
    </v-row> -->
    <!-- Church Planting chart -->


    <!-- ChurchDetail & PastorLeader -->
    <v-row>
      <v-col cols="12" md="6">
        <PastorLeaderWidget :user-id="selectedChurch?.pastor_id" />
      </v-col>
      <v-col cols="12" md="6">
        <ChurchDetailWidget :church-id="selectedChurch.church_id" />
      </v-col>  
    </v-row>
    <!-- #ChurchDetail & PastorLeader -->

    <!-- Related user -->
    <v-row>
      <v-col cols="12">
          <RelatedUserWidget :church-id="selectedChurch?.church_id" />
      </v-col>
    </v-row>
    <!-- #Related user -->

    <!-- Daugter church -->
    <v-row>
      <v-col cols="12">
          <DaugterChurchWidget :church-id="selectedChurch?.church_id" />
      </v-col>
    </v-row>
    <!-- #Daugter church -->

    <!-- Church planting projection -->
    <v-row>
      <v-col cols="12">
          <ChurchPlantingProjectionWidget :church-id="selectedChurch?.church_id" />
      </v-col>
    </v-row>
    <!-- #Church planting projection -->

    <!-- Attachement -->
    <v-row>
      <v-col cols="12">
          <AttachmentWidget :church-id="selectedChurch?.church_id" />
      </v-col>
    </v-row>
    <!-- #Attachement -->

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