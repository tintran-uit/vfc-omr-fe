<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { computed, inject, onUnmounted, ref, shallowRef, watch } from 'vue';
import { useNavLogoStore } from '@/stores/navLogoStore';
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { formatDate } from '@/helpers/dateTimeHelper';
import defaultAvatar from '@/assets/images/users/avatar-default.svg';
import CardHeader from '@/components/shared/CardHeader.vue';
import peopleIcon from '@/assets/images/metrics/people.svg'
import growthIcon from '@/assets/images/metrics/growth.svg'
import accessIcon from '@/assets/images/metrics/access.png'
import dollarBillIcon from '@/assets/images/metrics/dollar-bill.png'
import angelIcon from '@/assets/images/metrics/angel.png'
import worldwideCurrencyIcon from '@/assets/images/metrics/worldwide-currency.png'
import cellGroupIcon from '@/assets/images/metrics/cell-group.png'
import educationMetricIcon from '@/assets/images/metrics/education.png'
import houseIcon from '@/assets/images/metrics/house.png'
import userIcon from '@/assets/images/metrics/user.png'
import houseUserIcon from '@/assets/images/metrics/house-user.png'
import chartIcon from '@/assets/images/metrics/chart.png'
import editIcon from '@/assets/images/metrics/edit.png'
import worshipIcon from '@/assets/images/metrics/worship.png'
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

const { smAndDown, mdAndUp } = useDisplay()
const { t } = useI18n()
const isMobile = computed(() => smAndDown.value)
const metricsExpanded = ref(false)
const churchPictureVisible = ref(false)
const metricHelpDialog = ref(false)
const metricHelpTitle = ref('')
const metricHelpContent = ref('')
const authStore = useAuthStore();
const navLogoStore = useNavLogoStore();
const churchDetail = inject('churchDetail')
const dashboardData = inject('dashboardData')
const pastor = inject('pastor')
const currencyCodeLocal = computed(() => churchDetail.value?.currency_name)
const regionLogoUrl = computed(
  () => dashboardData.value?.dashboard_info?.church_region_logo_url as string | undefined
);
const regionLogoAlt = computed(
  () => dashboardData.value?.dashboard_info?.church_region_name as string | undefined
);

watch(
  [regionLogoUrl, regionLogoAlt],
  ([url, alt]) => {
    navLogoStore.setOverride(url, alt);
  },
  { immediate: true }
);

onUnmounted(() => {
  navLogoStore.clearOverride();
});

const actions = computed(() => {
  if (!churchDetail.value?.id) return [];

  return [
    {
      title: 'dashboardMenu.monthlyData',
      iconSrc: chartIcon,
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
      iconSrc: editIcon,
      to: {
        name: 'ChurchEdit',
        params: {
          id: churchDetail.value?.id
        }
      }
    },
    {
      title: 'dashboardMenu.worshipServices',
      iconSrc: worshipIcon,
      to: {
        name: 'WorshipServiceList',
        params: {
          churchId: churchDetail.value?.id
        }
      }
    },
    {
      title: 'dashboardMenu.newPastorAndNewChurch',
      iconSrc: houseUserIcon,
      to: {
        name: 'ChurchAddWithNewPastor'
      }
    },
    {
      title: 'dashboardMenu.newPastor',
      iconSrc: userIcon,
      to: {
        name: 'UserAdd'
      }
    },
    {
      title: 'dashboardMenu.newChurch',
      iconSrc: houseIcon,
      to: {
        name: 'ChurchAdd'
      }
    },
  ]
})


const metrics = shallowRef([
  {
    name: 'dashboard.people',
    helpKey: 'dashboard.peopleHelp',
    earnKey: 'avg_attendance',
    percentKey: null,
    color: 'primary',
    icon: peopleIcon
  },
  {
    name: 'dashboard.growth',
    helpKey: 'dashboard.growthHelp',
    earnKey: null,
    percentKey: 'growth',
    color: 'primary',
    icon: growthIcon,
  },
  {
    name: 'dashboard.givingTithes',
    helpKey: 'dashboard.givingHelp',
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
    icon: dollarBillIcon,
  },
  {
    name: 'dashboard.churchPlants',
    helpKey: 'dashboard.churchPlantsHelp',
    earnKey: 'total_church_plants',
    percentKey: null,
    color: 'primary',
    icon: accessIcon,
  },
  {
    name: 'dashboard.givingMFP',
    helpTitleKey: 'dashboard.givingMFPHelpTitle',
    helpKey: 'dashboard.givingMFPHelp',
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
    icon: worldwideCurrencyIcon,
  },
  {
    name: 'dashboard.peopleInCG',
    helpKey: 'dashboard.peopleInCGHelp',
    earnKey: null,
    percentKey: 'percent_cell_group_attendance',
    color: 'primary',
    icon: cellGroupIcon,
  },
  {
    name: 'dashboard.peopleInGTAndLIW',
    helpTitleKey: 'dashboard.peopleInGTAndLIWHelpTitle',
    helpKey: 'dashboard.peopleInGTAndLIWHelp',
    earnKey: null,
    percentKey: 'percent_liw_students',
    color: 'primary',
    icon: educationMetricIcon,
  },
  {
    name: 'dashboard.newDecisions',
    helpKey: 'dashboard.newDecisionsHelp',
    earnKey: 'total_new_decisions',
    percentKey: null,
    color: 'primary',
    icon: angelIcon,
  },
])

const PRIMARY_METRICS_COUNT = 4

const primaryMetrics = computed(() => metrics.value.slice(0, PRIMARY_METRICS_COUNT))
const secondaryMetrics = computed(() => metrics.value.slice(PRIMARY_METRICS_COUNT))
const showSecondaryMetricsToggle = computed(
  () => isMobile.value && secondaryMetrics.value.length > 0
)
const visibleSecondaryMetrics = computed(() => {
  if (mdAndUp.value || metricsExpanded.value) {
    return secondaryMetrics.value
  }
  return []
})

const dashboardInfo = computed(() => dashboardData.value?.dashboard_info)

const hasPastoralVisit = computed(() => !!dashboardInfo.value?.verified_by_user_id)

const visitDateText = computed(() =>
  formatDate(dashboardInfo.value?.verified_date, 'MMM YYYY')
)

const visitNameText = computed(() => dashboardInfo.value?.verified_by_user_name ?? '')

const lastReportText = computed(
  () => formatDate(dashboardInfo.value?.last_report_date, 'MMMM YYYY') || 'N/A'
)

const pastorDisplayName = computed(() => {
  const name = [pastor.value?.first_name, pastor.value?.last_name].filter(Boolean).join(' ')
  return name ? t('church.pastorName', { name }) : ''
})

const locationText = computed(() => {
  const country = churchDetail.value?.country_name
  const city = churchDetail.value?.city_name
  if (city && country) return `${city}, ${country}`
  return country || city || ''
})

const getMetricDisplayValue = (metric: (typeof metrics.value)[number]) => {
  const indicators = dashboardData.value?.dashboard_indicators
  if (metric.earnKey) {
    return indicators?.[metric.earnKey] ?? 0
  }
  if (metric.percentKey) {
    return `${indicators?.[metric.percentKey] ?? 0}%`
  }
  if (typeof metric.earnFn === 'function') {
    return metric.earnFn(indicators || {})
  }
  return 0
}

const hasChurchPhoto = computed(() => !!churchDetail.value?.photo_url)

type MetricItem = (typeof metrics.value)[number]

const openMetricHelp = (metric: MetricItem) => {
  metricHelpTitle.value = t(metric.helpTitleKey || metric.name)
  metricHelpContent.value = t(metric.helpKey)
  metricHelpDialog.value = true
}
</script>

<template>
  <!-- Header: church identity + pastor -->
  <v-card flat class="overview-church-header mb-4">
    <v-card-text class="pa-4 pa-md-6">
      <v-row class="align-md-center">
        <!-- Church info -->
        <v-col cols="12" md="7" class="overview-church-header__church">
          <div class="d-flex align-center flex-wrap ga-1 mb-2">
            <h1 class="text-h4 font-weight-bold mb-0 overview-church-header__title">
              {{ churchDetail?.name }}
            </h1>
            <slot name="switch" />
          </div>

          <div class="d-flex justify-space-between align-start ga-3">
            <span class="text-medium-emphasis overview-church-header__location overview-church-header__meta">
              {{ locationText }}
            </span>
            <div class="overview-church-header__status text-right">
              <div
                v-if="hasPastoralVisit"
                class="text-success overview-church-header__visit overview-church-header__meta"
              >
                <v-icon icon="$check" size="15" color="success" class="me-1" />
                <i18n-t keypath="church.visitedBy" tag="span">
                  <template #date>
                    <span class="font-weight-bold">{{ visitDateText }}</span>
                  </template>
                  <template #name>
                    <span class="font-weight-bold">{{ visitNameText }}</span>
                  </template>
                </i18n-t>
              </div>
              <div
                v-else
                class="text-warning overview-church-header__visit overview-church-header__meta"
              >
                <v-icon icon="$exclamation" size="15" color="warning" class="me-1" />
                {{ $t('church.needsVisit') }}
              </div>
              <div class="text-primary mt-1 overview-church-header__meta">
                {{ $t('church.lastReport') }}:
                <span class="font-weight-bold">{{ lastReportText }}</span>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Pastor -->
        <v-col
          cols="12"
          md="5"
          class="overview-church-header__pastor d-flex align-center justify-start justify-md-end"
        >
          <v-avatar size="64" class="overview-church-header__avatar elevation-1">
            <v-img :src="pastor?.photo_url || defaultAvatar" cover />
          </v-avatar>
          <div class="ms-3">
            <div class="text-h5 font-weight-bold text-primary">
              {{ pastorDisplayName }}
            </div>
            <div
              v-if="pastor?.role?.name || pastor?.role_name"
              class="text-body-1 text-medium-emphasis"
            >
              {{ pastor?.role?.name || pastor?.role_name }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- Primary metrics -->
  <v-row class="my-0">
    <v-col
      v-for="(metric, i) in primaryMetrics"
      :key="`primary-metric-${i}`"
      cols="6"
      md="3"
    >
      <v-card elevation="0" class="h-100">
        <v-card variant="outlined" class="h-100">
          <v-card-text class="h-100">
            <div class="metric-card-body">
              <div class="metric-card-body__icon">
                <v-img :src="metric.icon" alt="" width="40" height="40" />
              </div>
              <div class="metric-card-body__content">
                <h4 class="text-h4 mb-0 indicator-value">
                  {{ getMetricDisplayValue(metric) }}
                </h4>
                <div class="overview-church-metric__label-row">
                  <span class="overview-church-metric__name text-body-1 font-weight-medium text-medium-emphasis">
                    {{ $t(metric.name) }}
                  </span>
                  <button
                    type="button"
                    class="overview-church-metric__info-btn"
                    :aria-label="$t('dashboard.metricInfo')"
                    @click.stop="openMetricHelp(metric)"
                  >
                    <v-icon icon="$informationOutline" size="18" />
                  </button>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>

  <!-- Secondary metrics (always on desktop; expandable on mobile) -->
  <v-expand-transition>
    <v-row v-show="visibleSecondaryMetrics.length" class="my-0">
      <v-col
        v-for="(metric, i) in visibleSecondaryMetrics"
        :key="`secondary-metric-${i}`"
        cols="6"
        md="3"
      >
        <v-card elevation="0" class="h-100">
          <v-card variant="outlined" class="h-100">
            <v-card-text class="h-100">
              <div class="metric-card-body">
                <div class="metric-card-body__icon">
                  <v-img :src="metric.icon" alt="" width="40" height="40" />
                </div>
                <div class="metric-card-body__content">
                  <h4 class="text-h4 mb-0 indicator-value">
                    {{ getMetricDisplayValue(metric) }}
                  </h4>
                  <div class="overview-church-metric__label-row">
                    <span class="overview-church-metric__name text-body-1 font-weight-medium text-medium-emphasis">
                      {{ $t(metric.name) }}
                    </span>
                    <button
                      type="button"
                      class="overview-church-metric__info-btn"
                      :aria-label="$t('dashboard.metricInfo')"
                      @click.stop="openMetricHelp(metric)"
                    >
                      <v-icon icon="$informationOutline" size="18" />
                    </button>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-expand-transition>

  <div v-if="showSecondaryMetricsToggle" class="text-center my-3">
    <v-btn
      variant="text"
      color="primary"
      @click="metricsExpanded = !metricsExpanded"
    >
      {{ metricsExpanded ? $t('less') : $t('more') }}
      <v-icon
        :icon="metricsExpanded ? '$chevronUp' : '$chevronDown'"
        end
      />
    </v-btn>
  </div>

  <!-- Quick actions -->
  <v-card v-if="isMobile" class="mt-4 mb-4" variant="outlined" elevation="0">
    <v-list density="comfortable">
      <v-list-item
        v-for="item in actions"
        :key="item.title"
        :to="item.to"
        :base-color="item?.color || 'primary'"
      >
        <template #prepend>
          <span
            v-if="item.iconSrc"
            class="overview-church-action-btn__icon overview-church-action-btn__icon--themed me-3"
            :style="{
              WebkitMaskImage: `url(${item.iconSrc})`,
              maskImage: `url(${item.iconSrc})`,
            }"
          />
          <v-icon v-else :icon="item.icon" size="20" class="me-3" />
        </template>
        <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>

  <v-card v-else class="pa-4 mt-4 mb-4" variant="text">
    <div
      class="d-flex flex-wrap"
      style="gap: 12px; justify-content: flex-end;"
    >
      <v-btn
        v-for="item in actions"
        :key="item.title"
        :to="item.to"
        variant="outlined"
        :color="item?.color || 'primary'"
        class="d-inline-flex align-center w-100 w-sm-auto"
      >
        <span
          v-if="item.iconSrc"
          class="overview-church-action-btn__icon overview-church-action-btn__icon--themed mr-2"
          :style="{
            WebkitMaskImage: `url(${item.iconSrc})`,
            maskImage: `url(${item.iconSrc})`,
          }"
        />
        <v-icon v-else :icon="item.icon" size="20" class="mr-2" />
        <span class="text-body-2">{{ $t(item.title) }}</span>
      </v-btn>
    </div>
  </v-card>

  <!-- Attendance, giving & visit chart -->
  <v-row>
    <v-col cols="12">
      <AttendanceChartWidget :church-id="churchDetail?.id" />
    </v-col>
  </v-row>

  <!-- Church Planting chart -->
  <v-row>
    <v-col cols="12">
      <ChurchPlantingChartWidget :church-id="churchDetail?.id" />
    </v-col>
  </v-row>

  <!-- ChurchDetail & PastorLeader -->
  <v-row>
    <v-col cols="12" md="6">
      <PastorLeaderWidget :user-id="churchDetail?.pastor_id" />
    </v-col>
    <v-col cols="12" md="6">
      <ChurchDetailWidget :church-id="churchDetail?.id" />
    </v-col>
  </v-row>

  <!-- Related user -->
  <v-row>
    <v-col cols="12">
      <RelatedUserWidget :church-id="churchDetail?.id" />
    </v-col>
  </v-row>

  <!-- Daughter church -->
  <v-row>
    <v-col cols="12">
      <DaugterChurchWidget :church-id="churchDetail?.id" />
    </v-col>
  </v-row>

  <!-- Church planting projection -->
  <v-row v-if="authStore.can('church-planting.read')">
    <v-col cols="12">
      <ChurchPlantingProjectionWidget :church-id="churchDetail?.id" />
    </v-col>
  </v-row>

  <!-- Attachments -->
  <v-row>
    <v-col cols="12">
      <AttachmentWidget :church-id="churchDetail?.id" />
    </v-col>
  </v-row>

  <!-- Church picture (below attachments) -->
  <v-row v-if="hasChurchPhoto">
    <v-col cols="12">
      <CardHeader :title="$t('church.churchPicture')">
        <div class="pa-4 overview-church-picture-panel">
          <div class="overview-church-picture-panel__actions">
            <v-btn
              variant="outlined"
              color="primary"
              @click="churchPictureVisible = !churchPictureVisible"
            >
            {{ churchPictureVisible ? $t('church.hideChurchPicture') : $t('church.seeChurchPicture') }}
            <v-icon
              :icon="churchPictureVisible ? '$chevronUp' : '$chevronDown'"
              end
            />
          </v-btn>
          </div>
          <v-expand-transition>
            <div v-show="churchPictureVisible" class="overview-church-picture mt-4">
              <img
                :src="churchDetail?.photo_url"
                :alt="churchDetail?.name"
                class="overview-church-picture__img"
              />
            </div>
          </v-expand-transition>
        </div>
      </CardHeader>
    </v-col>
  </v-row>

  <v-dialog v-model="metricHelpDialog" max-width="400">
    <v-card rounded="lg" elevation="4">
      <div class="d-flex align-center justify-space-between ga-3 px-4 pt-4 pb-3">
        <span class="text-h6 font-weight-bold text-high-emphasis">
          {{ metricHelpTitle }}
        </span>
        <v-btn
          icon
          variant="text"
          size="small"
          :aria-label="$t('close')"
          @click="metricHelpDialog = false"
        >
          <v-icon icon="$close" size="20" />
        </v-btn>
      </div>
      <v-divider />
      <div class="px-4 py-3 text-body-1 text-high-emphasis">
        {{ metricHelpContent }}
      </div>
    </v-card>
  </v-dialog>
</template>
<style scoped lang="scss">
.overview-church-header__avatar {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.overview-church-header__title {
  line-height: 1.3;
}

.overview-church-header__meta {
  font-size: 0.8125rem;
  line-height: 1.125rem;
}

.overview-church-header__visit {
  flex-shrink: 0;
}

.overview-church-header__status {
  flex-shrink: 0;
  max-width: 55%;
}

.overview-church-header__location {
  flex: 1 1 auto;
  min-width: 0;
}

.overview-church-header__pastor {
  @media (max-width: 959px) {
    padding-top: 12px;
  }
}

.overview-church-metric__label-row {
  display: flex;
  align-items: center;
  width: 100%;
  line-height: 1.5rem;
  gap: 4px;
}

.overview-church-metric__name {
  flex: 1 1 auto;
  min-width: 0;
  line-height: 1.5rem;
}

.overview-church-metric__info-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.5rem;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgb(var(--v-theme-primary));
  cursor: pointer;
  line-height: 0;

  &:hover {
    opacity: 0.75;
  }

  &:focus-visible {
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 1px;
    border-radius: 50%;
  }
}
</style>