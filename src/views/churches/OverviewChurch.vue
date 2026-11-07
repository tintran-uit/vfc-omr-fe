<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { computed, inject, ref, shallowRef } from 'vue';
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { formatDate } from '@/helpers/dateTimeHelper';
import defaultAvatar from '@/assets/images/users/avatar-default.svg';
import CardHeader from '@/components/shared/CardHeader.vue';
import InfoHelpDialog from '@/components/shared/InfoHelpDialog.vue';
import peopleIcon from '@/assets/images/metrics/group.png'
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
import { formatCompactCurrency, formatCurrency } from '@/helpers/appHelper';

defineProps<{
  roleLabel?: string
  coverHeader?: boolean
}>()

const { smAndDown, mdAndUp } = useDisplay()
const { t } = useI18n()
const isMobile = computed(() => smAndDown.value)
const metricsExpanded = ref(false)
const churchPictureVisible = ref(false)
const metricHelpDialog = ref(false)
const metricHelpTitle = ref('')
const metricHelpContent = ref('')
const authStore = useAuthStore();
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
      color: 'primary'
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
    helpTitleKey: 'dashboard.peopleHelpTitle',
    helpKey: 'dashboard.peopleHelp',
    earnKey: 'avg_attendance',
    percentKey: null,
    color: 'primary',
    icon: peopleIcon
  },
  {
    name: 'dashboard.growth',
    helpTitleKey: 'dashboard.growthHelpTitle',
    helpKey: 'dashboard.growthHelp',
    earnKey: null,
    percentKey: 'growth',
    color: 'primary',
    icon: growthIcon,
  },
  {
    name: 'dashboard.givingTithes',
    helpTitleKey: 'dashboard.givingHelpTitle',
    helpKey: 'dashboard.givingHelp',
    earnFn: (item) => formatMetricMoney(
      item['avg_monthly_giving'],
      item['avg_monthly_giving_in_usd'],
    ),
    percentKey: null,
    color: 'primary',
    icon: dollarBillIcon,
  },
  {
    name: 'dashboard.givingMFP',
    helpTitleKey: 'dashboard.givingMFPHelpTitle',
    helpKey: 'dashboard.givingMFPHelp',
    earnFn: (item) => formatMetricMoney(
      item['avg_monthly_mfp_giving'],
      item['avg_monthly_mfp_giving_in_usd'],
    ),
    percentKey: null,
    color: 'primary',
    icon: worldwideCurrencyIcon,
  },
  {
    name: 'dashboard.peopleInCG',
    helpTitleKey: 'dashboard.peopleInCGHelpTitle',
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
    helpTitleKey: 'dashboard.newDecisionsHelpTitle',
    helpKey: 'dashboard.newDecisionsHelp',
    earnKey: 'total_new_decisions',
    percentKey: null,
    color: 'primary',
    icon: angelIcon,
  },
  {
    name: 'dashboard.churchPlants',
    helpTitleKey: 'dashboard.churchPlantsHelpTitle',
    helpKey: 'dashboard.churchPlantsHelp',
    earnKey: 'total_church_plants',
    percentKey: null,
    color: 'primary',
    icon: accessIcon,
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

const isDashboardReady = computed(() => Object.keys(dashboardData.value || {}).length > 0)

const hasPastoralVisit = computed(() => !!dashboardInfo.value?.verified_by_user_id)

const visitDateText = computed(() =>
  formatDate(dashboardInfo.value?.verified_date, 'MMM YYYY')
)

const visitNameText = computed(() => dashboardInfo.value?.verified_by_user_name ?? '')

const lastReportText = computed(
  () => formatDate(dashboardInfo.value?.last_report_date, 'MMM YYYY') || '-'
)

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const visitByHtml = computed(() =>
  t('church.visitedBy', {
    date: escapeHtml(visitDateText.value),
    name: escapeHtml(visitNameText.value),
  })
)

const lastReportHtml = computed(() =>
  t('church.lastReport', {
    date: escapeHtml(lastReportText.value),
  })
)

const pastorDisplayName = computed(() => {
  const name = [pastor.value?.first_name, pastor.value?.last_name].filter(Boolean).join(' ')
  return name ? t('church.pastorName', { name }) : ''
})

const locationText = computed(() => churchDetail.value?.country_name || '')

type MetricDisplay = { primary: string; secondary: string }

function formatLocalMetricAmount(value: unknown, currency: string) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return ''
  if (Math.abs(amount) >= 1_000_000) {
    return formatCompactCurrency(amount, currency)
  }
  return formatCurrency(amount, currency, { maximumFractionDigits: 0 })
}

function formatUsdMetricLine(value: unknown) {
  const formatted = formatCurrency(value as number, 'USD', {
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  })
  if (!formatted) return ''
  return `USD ${formatted}`
}

function formatMetricMoney(localAmount: unknown, usdAmount: unknown): MetricDisplay {
  const currency = currencyCodeLocal.value
  if (!currency) return { primary: '0', secondary: '' }

  const primary = formatLocalMetricAmount(localAmount, currency) || '0'
  if (currency === 'USD') return { primary, secondary: '' }

  return { primary, secondary: formatUsdMetricLine(usdAmount) }
}

const getMetricDisplay = (metric: (typeof metrics.value)[number]): MetricDisplay => {
  const indicators = dashboardData.value?.dashboard_indicators
  if (metric.earnKey) {
    return { primary: String(indicators?.[metric.earnKey] ?? 0), secondary: '' }
  }
  if (metric.percentKey) {
    return { primary: `${indicators?.[metric.percentKey] ?? 0}%`, secondary: '' }
  }
  if (typeof metric.earnFn === 'function') {
    return metric.earnFn(indicators || {})
  }
  return { primary: '0', secondary: '' }
}

const hasChurchPhoto = computed(() => !!churchDetail.value?.photo_url)

type MetricItem = (typeof metrics.value)[number]

const openMetricHelp = (metric: MetricItem) => {
  metricHelpTitle.value = t(metric.helpTitleKey ?? metric.name)
  metricHelpContent.value = t(metric.helpKey)
  metricHelpDialog.value = true
}
</script>

<template>
  <!-- Pastor dashboard: pastor info on the left, church region logo on the right. -->
  <v-card
    v-if="coverHeader"
    flat
    class="overview-church-header overview-church-profile mb-4"
  >
    <div
      v-if="churchDetail?.photo_url"
      class="overview-church-cover"
    >
      <img
        :src="churchDetail.photo_url"
        :alt="churchDetail?.name || ''"
        class="overview-church-cover__img"
      />
    </div>
    <div class="overview-church-profile__row">
      <div class="overview-church-profile__main">
        <v-avatar
          class="overview-church-profile__avatar"
          :size="isMobile ? 72 : 96"
        >
          <v-img
            :src="pastor?.photo_url || defaultAvatar"
            cover
          />
        </v-avatar>
        <div class="overview-church-profile__text">
          <div class="overview-church-header__title-row">
            <slot
              name="switch"
              :title="churchDetail?.name"
            >
              <h1 class="overview-church-header__title">
                {{ churchDetail?.name }}
              </h1>
            </slot>
          </div>
          <div class="overview-church-header__meta">
            <div
              v-if="locationText"
              class="overview-church-header__location"
            >
              {{ locationText }}
            </div>
            <div
              v-if="isDashboardReady"
              class="overview-church-header__status"
            >
              <div
                class="overview-church-header__report"
                v-html="lastReportHtml"
              />
              <div
                v-if="hasPastoralVisit"
                class="overview-church-header__visit"
              >
                <v-icon
                  icon="$check"
                  size="15"
                  class="overview-church-header__visit-icon me-1"
                />
                <span
                  class="overview-church-header__visit-text"
                  v-html="visitByHtml"
                />
              </div>
              <div
                v-else
                class="overview-church-header__visit overview-church-header__visit--needed"
                v-html="t('church.needsVisit')"
              />
            </div>
          </div>
          <div
            v-if="pastorDisplayName"
            class="overview-church-profile__name"
          >
            {{ pastorDisplayName }}
          </div>
        </div>
      </div>
      <div
        v-if="regionLogoUrl"
        class="overview-church-profile__region"
      >
        <img
          :src="regionLogoUrl"
          :alt="regionLogoAlt || ''"
        />
      </div>
    </div>
  </v-card>

  <v-card
    v-else
    flat
    class="overview-church-header mb-4"
  >
    <v-card-text class="pa-4 pa-md-5">
      <div class="overview-church-header__row">
        <div class="overview-church-header__church">
          <div class="overview-church-header__title-row">
            <slot name="switch" :title="churchDetail?.name">
              <h1 class="overview-church-header__title">
                {{ churchDetail?.name }}
              </h1>
            </slot>
          </div>

          <div class="overview-church-header__meta">
            <div v-if="locationText" class="overview-church-header__location">
              {{ locationText }}
            </div>
            <div v-if="isDashboardReady" class="overview-church-header__status">
              <div v-if="hasPastoralVisit" class="overview-church-header__visit">
                <v-icon icon="$check" size="15" class="overview-church-header__visit-icon me-1" />
                <span class="overview-church-header__visit-text" v-html="visitByHtml" />
              </div>
              <div
                v-else
                class="overview-church-header__visit overview-church-header__visit--needed"
                v-html="t('church.needsVisit')"
              />
              <div class="overview-church-header__report" v-html="lastReportHtml" />
            </div>
          </div>
        </div>

        <div class="overview-church-header__pastor">
          <v-avatar size="56" class="overview-church-header__avatar">
            <v-img :src="pastor?.photo_url || defaultAvatar" cover />
          </v-avatar>
          <div class="overview-church-header__pastor-text">
            <div v-if="pastorDisplayName" class="overview-church-header__pastor-name">
              {{ pastorDisplayName }}
            </div>
            <div
              v-if="roleLabel || pastor?.role?.name || pastor?.role_name"
              class="overview-church-header__pastor-role"
            >
              {{ roleLabel || pastor?.role?.name || pastor?.role_name }}
            </div>
          </div>
        </div>
      </div>
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
              <div class="metric-card-body overview-church-metric">
              <div class="metric-card-body__icon overview-church-metric__icon">
                <v-img :src="metric.icon" alt="" width="36" height="36" />
              </div>
              <div class="metric-card-body__content">
                <h4 class="text-h4 mb-0 indicator-value">
                  {{ getMetricDisplay(metric).primary }}
                </h4>
                <div
                  v-if="getMetricDisplay(metric).secondary"
                  class="overview-church-metric__usd"
                >
                  {{ getMetricDisplay(metric).secondary }}
                </div>
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
                    <v-icon icon="$informationOutline" size="16" />
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
              <div class="metric-card-body overview-church-metric">
              <div class="metric-card-body__icon overview-church-metric__icon">
                <v-img :src="metric.icon" alt="" width="36" height="36" />
              </div>
              <div class="metric-card-body__content">
                <h4 class="text-h4 mb-0 indicator-value">
                  {{ getMetricDisplay(metric).primary }}
                </h4>
                <div
                  v-if="getMetricDisplay(metric).secondary"
                  class="overview-church-metric__usd"
                >
                  {{ getMetricDisplay(metric).secondary }}
                </div>
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
                    <v-icon icon="$informationOutline" size="16" />
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

  <v-card v-else class="px-0 py-4 mt-4 mb-4" variant="text">
    <div
      class="d-flex flex-wrap"
      style="gap: 8px; justify-content: flex-end;"
    >
      <v-btn
        v-for="item in actions"
        :key="item.title"
        :to="item.to"
        :variant="item?.color ? 'flat' : 'outlined'"
        :color="item?.color || undefined"
        :class="[
          'd-inline-flex align-center w-100 w-sm-auto overview-church-action-btn',
          { 'overview-church-action-btn--quiet': !item?.color },
        ]"
      >
        <span
          v-if="item.iconSrc"
          class="overview-church-action-btn__icon overview-church-action-btn__icon--themed"
          :style="{
            WebkitMaskImage: `url(${item.iconSrc})`,
            maskImage: `url(${item.iconSrc})`,
          }"
        />
        <v-icon v-else :icon="item.icon" size="20" class="overview-church-action-btn__icon" />
        <span class="overview-church-action-btn__label">{{ $t(item.title) }}</span>
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

  <InfoHelpDialog
    v-model="metricHelpDialog"
    :title="metricHelpTitle"
    :content="metricHelpContent"
  />
</template>
<style scoped lang="scss">
// Sampled from the mobile app screenshot, not the CMS theme.
$app-text: #1c1c1e;
$app-caption: #636366;
$app-green: #248a3d;
$app-orange: #ff9500;

.overview-church-profile {
  overflow: hidden;
}

.overview-church-cover {
  aspect-ratio: 851 / 315;
  overflow: hidden;
  background: #e4e6eb;
}

.overview-church-cover__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.overview-church-profile__row {
  display: grid;
  grid-template-columns: minmax(0, 9fr) minmax(0, 3fr);
  align-items: center;
  column-gap: 24px;
  padding: 20px 24px;
}

.overview-church-profile__main {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.overview-church-profile__avatar {
  flex: 0 0 auto;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.overview-church-profile__text {
  flex: 1 1 auto;
  min-width: 0;
}

.overview-church-profile__name {
  margin-top: 8px;
  color: rgb(var(--v-theme-primary));
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
}

.overview-church-profile .overview-church-header__meta {
  margin-top: 4px;
  gap: 40px;
}

.overview-church-profile .overview-church-header__location {
  margin-top: 0;
  flex: 0 0 auto;
}

.overview-church-profile .overview-church-header__status {
  margin-top: 0;
  text-align: right;
  min-width: 0;
}

.overview-church-profile__region {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
}

.overview-church-profile__region img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 120px;
  object-fit: contain;
}

@media (max-width: 600px) {
  .overview-church-profile__row {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 16px;
    padding: 16px;
  }

  .overview-church-profile__region {
    justify-content: flex-start;
  }
}

.overview-church-header__row {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 960px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }
}

.overview-church-header__church {
  min-width: 0;
  flex: 1 1 auto;
}

.overview-church-header__title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;

  :deep(.overview-church-header__title) {
    margin: 0;
    color: $app-text;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
  }
}

.overview-church-header__title {
  margin: 0;
  color: $app-text;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
}

.overview-church-header__meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
}

.overview-church-header__location,
.overview-church-header__pastor-role {
  color: $app-caption;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.35;
}

.overview-church-header__location {
  min-width: 0;
}

.overview-church-header__status {
  flex: 0 1 auto;
  text-align: right;
  font-size: 0.8125rem;
  line-height: 1.35;
}

.overview-church-header__visit,
.overview-church-header__visit-icon {
  color: $app-green;
  font-size: 0.8125rem;
  line-height: 1.35;
}

.overview-church-header__visit--needed {
  color: $app-orange;
}

.overview-church-header__report {
  color: rgb(var(--v-theme-primary));
}

.overview-church-header__pastor {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;

  @media (min-width: 960px) {
    padding-left: 28px;
    border-left: 1px solid rgb(var(--v-theme-borderLight));
  }
}

.overview-church-header__avatar {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.overview-church-header__pastor-name {
  color: rgb(var(--v-theme-primary));
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
}

.overview-church-metric__icon {
  flex: 0 0 36px;
}

.overview-church-metric__usd {
  margin-top: 2px;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  color: rgba(var(--v-theme-on-surface), 0.45);
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