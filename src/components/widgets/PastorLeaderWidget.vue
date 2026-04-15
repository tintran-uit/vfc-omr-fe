<script setup lang="ts">
import {ref, watch, computed, onMounted, defineAsyncComponent} from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import { userService } from '@/services/userService';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    userId: number,
    user?: Record<string, any> | null,
    title?: string
  }>(),
  {
    title: undefined
  }
)
const { t } = useI18n()
const cardTitle = computed(() => {
  return props.title ?? t('user.pastorLeaderDetails')
})
const detail = ref({})
const resolvedDetail = computed(() => {
  return props.user ?? detail.value
})
const fetchData = async (userId) => {
  detail.value = await userService.get(userId, false)
}
const headingClass = 'text-left font-weight-medium'


watch(
  () => props.userId,
  async (id) => {
    if (!id || props.user) return

    fetchData(id)
  },
  { immediate: true }
)
</script>

<template>
  <CardHeader :title="cardTitle">
    <v-table class="text-no-wrap bordered-table" density="compact" hover>
      <tbody>
        <tr>
          <th :class="headingClass">{{ $t('user.fullName') }}</th>
          <td>{{ resolvedDetail?.prefix }} {{ resolvedDetail?.name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('user.labelTitle') }}</th>
          <td>{{ resolvedDetail?.title }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('omrId') }}</th>
          <td>{{ resolvedDetail?.id }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('user.labelUsername') }}</th>
          <td>{{ resolvedDetail?.username }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('user.omrRole') }}</th>
          <td>{{ resolvedDetail?.role?.name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('user.language') }}</th>
          <td>{{ resolvedDetail?.language_name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('user.nation') }}</th>
          <td>{{ resolvedDetail?.country_name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('user.sensitiveNation') }}</th>
          <td>
            <v-icon v-if="resolvedDetail?.sensitive_nation" color="success">$checkboxMarkedOutline</v-icon>
            <v-icon v-else class="text-disabled">$checkboxBlankOutline</v-icon>
          </td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('user.labelEmailAddress') }}</th>
          <td>{{ resolvedDetail?.email_address }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('user.mobilePhone') }}</th>
          <td>{{ resolvedDetail?.mobile_phone }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('user.from') }}</th>
          <td>{{ resolvedDetail?.church_name }}</td>
        </tr>
      </tbody>
    </v-table>
  </CardHeader>
</template>

<style scoped>
.bordered-table {
  border: 1px solid #ddd;
  width: 100%;
  font-size: 0.9rem;
}

.bordered-table th,
.bordered-table td {
  border-bottom: 1px solid #ddd;
  padding: 6px 12px !important;
  vertical-align: middle;
}

.bordered-table th {
  background-color: #f8f8f8;
  width: 35%;
  font-weight: 600;
  color: #333;
}

.bordered-table tr:last-child th,
.bordered-table tr:last-child td {
  border-bottom: none;
}
</style>
