<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { computed, onMounted, ref, shallowRef, inject } from 'vue';
import { useDisplay } from 'vuetify'
import { formatDate } from '@/helpers/dateTimeHelper';
import peopleIcon from '@/assets/images/metrics/people.svg'
import givingIcon from '@/assets/images/metrics/giving.svg'
import plantIcon from '@/assets/images/metrics/plant.svg'
import growthIcon from '@/assets/images/metrics/growth.svg'
import worldwideIcon from '@/assets/images/metrics/worldwide.svg'
import educationIcon from '@/assets/images/metrics/education.svg'
import groupPeopleIcon from '@/assets/images/metrics/group-people.svg'
import ChurchDetailWidget from '@/components/widgets/ChurchDetailWidget.vue';
import PastorLeaderWidget from '@/components/widgets/PastorLeaderWidget.vue';
import RelatedUserWidget from '@/components/widgets/RelatedUserWidget.vue';
import ChurchPlantingProjectionWidget from '@/components/widgets/ChurchPlantingProjectionWidget.vue';
import AttachmentWidget from '@/components/widgets/AttachmentWidget.vue';
import DaugterChurchWidget from '@/components/widgets/DaugterChurchWidget.vue';
import AttendanceChartWidget from '@/components/widgets/AttendanceChartWidget.vue';
import ChurchPlantingChartWidget from '@/components/widgets/ChurchPlantingChartWidget.vue';
import { formatCompactCurrency } from '@/helpers/appHelper';

const props = withDefaults(
  defineProps<{
    // churchId: number,
  }>(),
  {
    
  }
)

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)
const authStore = useAuthStore();
const churchDetail = inject('churchDetail')
const dashboardData = inject('dashboardData')
const pastor = inject('pastor')
const currencyCodeLocal = computed(() => churchDetail.value?.currency_name)
const actions = computed(() => {
  if (!churchDetail.value?.id) return [];

  return [
    {
      title: 'dashboardMenu.monthlyData',
      icon: '$chartBar',
      to: {
        name: 'MonthlyDataAdd',
        params: {
          id: churchDetail.value?.id
        }
      },
      color: 'warning'
    },
    {
      title: 'dashboardMenu.editChurch',
      icon: '$edit',
      to: {
        name: 'ChurchEdit',
        params: {
          id: churchDetail.value?.id
        }
      }
    },
    {
      title: 'dashboardMenu.worshipServices',
      icon: '$handClap',
      to: {
        name: 'WorshipServiceList',
        params: {
          churchId: churchDetail.value?.id
        }
      }
    },
    {
      title: 'dashboardMenu.newPastorAndNewChurch',
      icon: '$plusCircleOutline',
      to: {
        name: 'ChurchAddWithNewPastor'
      }
    },
    {
      title: 'dashboardMenu.newPastor',
      icon: '$plusCircleOutline',
      to: {
        name: 'UserAdd'
      }
    },
    {
      title: 'dashboardMenu.newChurch',
      icon: '$plusCircleOutline',
      to: {
        name: 'ChurchAdd'
      }
    },
  ]
})


const metrics = shallowRef([
  {
    name: 'dashboard.people',
    text: 'dashboard.peopleText',
    earnKey: 'avg_attendance',
    percentKey: null,
    color: 'primary',
    icon: peopleIcon
  },
  {
    name: 'dashboard.growth',
    text: 'dashboard.growthText',
    earnKey: null,
    percentKey: 'growth',
    color: 'primary',
    icon: growthIcon,
  },
  {
    name: 'dashboard.givingTithes',
    text: 'dashboard.givingTithesText',
    // earnKey: ,
    earnFn: (item) => {
      if (!currencyCodeLocal) return 0; 

      if (currencyCodeLocal === 'USD') {
        return formatCompactCurrency(item['avg_monthly_giving'], currencyCodeLocal.value)
      }

      const localFormat = formatCompactCurrency(item['avg_monthly_giving'], currencyCodeLocal.value)
      const usdFormat = formatCompactCurrency(item['avg_monthly_giving_in_usd'], 'USD')
      return `${localFormat} (${usdFormat})`
    },
    percentKey: null,
    color: 'primary',
    icon: givingIcon,
  },
  {
    name: 'dashboard.churchPlants',
    text: 'dashboard.churchPlantsText',
    earnKey: 'total_church_plants',
    percentKey: null,
    color: 'primary',
    icon: plantIcon,
  },
  {
    name: 'dashboard.givingMFP',
    text: 'dashboard.givingMFPText',
    earnFn: (item) => {
      if (!currencyCodeLocal) return 0

      if (currencyCodeLocal === 'USD') {
        return formatCompactCurrency(item['avg_monthly_mfp_giving'], currencyCodeLocal.value)
      }

      const localFormat = formatCompactCurrency(item['avg_monthly_mfp_giving'], currencyCodeLocal.value)
      const usdFormat = formatCompactCurrency(item['avg_monthly_mfp_giving_in_usd'], 'USD')
      return `${localFormat} (${usdFormat})`
    },
    percentKey: null,
    color: 'primary',
    icon: worldwideIcon,
  },
  {
    name: 'dashboard.peopleInCG',
    text: 'dashboard.peopleInCGText',
    earnKey: null,
    percentKey: 'percent_cell_group_attendance',
    color: 'primary',
    icon: groupPeopleIcon,
  },
  {
    name: 'dashboard.peopleInGTAndLIW',
    text: 'dashboard.peopleInGTAndLIWText',
    earnKey: null,
    percentKey: 'percent_liw_students',
    color: 'primary',
    icon: educationIcon,
  },
  {
    name: 'dashboard.newDecisions',
    text: 'dashboard.newDecisionsText',
    earnKey: 'total_new_decisions',
    percentKey: null,
    color: 'primary',
    icon: groupPeopleIcon,
  },
])
</script>

<template>
  <v-card flat>
  <!-- Cover -->
  <v-img
  :src="churchDetail?.photo_url"
    cover
    class="church-cover bg-grey-darken-2"
  />
  
  <!-- Avatar + Info -->
  <v-container class="position-relative">
    <v-row>
      <!-- Avatar bên trái -->
      <v-col cols="12" sm="2" class="position-relative">
        <v-avatar
          size="149"
          class="elevation-4 profile-avatar"
        >
          <v-img :src="pastor?.photo_url" />
        </v-avatar>
        <div style="clear: both"></div>
      </v-col>

      <!-- User info ở giữa -->
      <v-col cols="12" sm="10" class="d-flex flex-column justify-center text-center text-sm-left">
        <v-row class="align-center">
          <v-col cols="12" md="8" class="text-medium-emphasis text-body-1">
            <div class="text-h4 mb-1 text-medium-emphasis">
              {{ pastor?.first_name }}  {{ pastor?.last_name }}
            </div>

            <div class="text-h4">
              {{ churchDetail?.name }}

              <!-- <template v-if="dashboardData?.dashboard_info?.verified_by_user_id">
                <v-tooltip>
                  <template #activator="{ props: tooltipProps }">
                    <v-icon v-bind="{ ...menuProps, ...tooltipProps }" class="text-success" size="20">$checkDecagramOutline</v-icon>
                  </template>

                  <span v-html="$t('church.verifiedBy', {
                      name: dashboardData?.dashboard_info?.verified_by_user_name,
                      date: formatDate(dashboardData?.dashboard_info?.verified_date, 'MMMM YYYY')
                    })"></span>
                </v-tooltip>
              </template> -->
            
              <slot name="switch" />
            </div>
            
            {{ churchDetail?.city_name }}, {{ churchDetail?.country_name }}<br />
            <span class="text-primary">{{ $t('church.lastMonthlyRecord') }}: {{ formatDate(dashboardData?.dashboard_info?.last_report_date, 'MMMM YYYY') || 'N/A' }}</span>
            <template v-if="dashboardData?.dashboard_info?.verified_by_user_id && false">
              <v-icon class="text-success" size="20">$checkDecagramOutline</v-icon>
              <span class="text-success" v-html="$t('church.visitedBy', {
                name: dashboardData?.dashboard_info?.verified_by_user_name,
                date: formatDate(dashboardData?.dashboard_info?.verified_date, 'MMMM YYYY')
              })"></span>
              </template>
            <span v-else class="text-warning">
              <v-icon >$exclamation</v-icon> {{ $t('church.needsVisit') }}
            </span>
          </v-col>
          <v-col cols="12" md="4" class="text-center text-md-right text-medium-emphasis text-body-1">
            <v-img
             :src="dashboardData?.dashboard_info?.church_region_logo_url"
             :alt="dashboardData?.dashboard_info?.church_region_name"
             :width="100"
             class="mx-auto mx-md-0"
             />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</v-card>

<v-card class="pa-4 mt-4" variant="text">
  <div
    class="d-flex flex-wrap"
    style="gap: 12px; justify-content: flex-end;"
  >
    <v-btn
      v-for="item in actions"
      :key="item.title"
      :to="item.to"
      variant="elevated"
      :color="item?.color || 'primary'"
      class="d-inline-flex align-center w-100 w-sm-auto"
    >
      <v-icon :icon="item.icon" size="20" class="mr-2" />
      <span class="text-body-2">{{ $t(item.title) }}</span>
    </v-btn>
  </div>
</v-card>


    <v-row class="my-0">
      <v-col cols="6" sm="6" md="3" v-for="(metric, i) in metrics" :key="i">
        <v-card elevation="0" class="h-100">
          <v-card variant="outlined" class="h-100">
            <v-card-text class="h-100">
              <div class="d-flex align-items-center justify-space-between">
                <v-row class="mb-0">
                  <v-col cols="3" class="d-flex align-center justify-center pb-0">
                    <v-img :src="metric.icon" alt="icon" width="40" height="40" />
                  </v-col>

                  <v-col cols="9" class="pb-0">
                    <h4 class="text-h4 d-flex align-center mb-0 indicator-value" v-if="metric.earnKey">
                      {{ dashboardData?.dashboard_indicators?.[metric.earnKey] || 0 }}
                    </h4>
                    <h4 class="text-h4 d-flex align-center mb-0 indicator-value" v-else-if="metric.percentKey">
                      {{ dashboardData?.dashboard_indicators?.[metric.percentKey] || 0 }}%
                    </h4>
                    <h4 class="text-h4 d-flex align-center mb-0 indicator-value" v-else-if="metric.earnFn && typeof(metric.earnFn) === 'function'">
                      <!-- <v-badge location="top right" color="error" content="9999"> -->
                        {{ metric.earnFn(dashboardData?.dashboard_indicators || 0) }}
                      <!-- </v-badge> -->
                    </h4>
                    <div class="text-body-1 font-weight-medium text-high-emphasis">
                      {{ $t(metric.name) }}
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      {{ $t(metric.text) }}
                    </div>
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
        <AttendanceChartWidget :church-id="churchDetail?.id" />
      </v-col>
    </v-row>
    <!-- #Attendance, giving & visit chart -->

    <!-- Church Planting chart -->
    <v-row>
      <v-col cols="12">
        <ChurchPlantingChartWidget :church-id="churchDetail?.id" />
      </v-col>
    </v-row>
    <!-- Church Planting chart -->


    <!-- ChurchDetail & PastorLeader -->
    <v-row>
      <v-col cols="12" md="6">
        <PastorLeaderWidget :user-id="churchDetail?.pastor_id" />
      </v-col>
      <v-col cols="12" md="6">
        <ChurchDetailWidget :church-id="churchDetail?.id" />
      </v-col>  
    </v-row>
    <!-- #ChurchDetail & PastorLeader -->

    <!-- Related user -->
    <v-row>
      <v-col cols="12">
        <RelatedUserWidget :church-id="churchDetail?.id" />
      </v-col>
    </v-row>
    <!-- #Related user -->

    <!-- Daugter church -->
    <v-row>
      <v-col cols="12">
        <DaugterChurchWidget :church-id="churchDetail?.id" />
      </v-col>
    </v-row>
    <!-- #Daugter church -->

    <!-- Church planting projection (pastor-only permission) -->
    <v-row v-if="authStore.can('church-planting.read')">
      <v-col cols="12">
          <ChurchPlantingProjectionWidget :church-id="churchDetail?.id" />
      </v-col>
    </v-row>
    <!-- #Church planting projection -->

    <!-- Attachement -->
    <v-row>
      <v-col cols="12">
          <AttachmentWidget :church-id="churchDetail?.id" />
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
   margin-top: -60px;
   display: block;
}

.church-cover {
  height: 180px;      // mobile
}

.church-cover img {
  object-position: center 30%;
}

@media (min-width: 768px) {
  .profile-avatar {
    position:absolute; 
    left:16px;
    margin-left: 0;
    margin-right: 0;
  }
}

@media (min-width: 600px) {
  .church-cover {
    height: 220px;    // tablet
  }
}

@media (min-width: 960px) {
  .church-cover {
    height: 260px;    // desktop
  }

  .profile-avatar {
    margin-top: -75px;
  }
}
</style>