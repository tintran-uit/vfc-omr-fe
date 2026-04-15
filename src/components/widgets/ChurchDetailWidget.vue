<script setup lang="ts">
import {ref, watch, computed, onMounted, defineAsyncComponent} from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import { churchService } from '@/services/churchService';
import { geographicalRegionService } from '@/services/geographicalRegionService';
import { formatDate, getAge } from '@/helpers/dateTimeHelper';
import { appFormatDate } from '@/helpers/appHelper';

const props = withDefaults(
  defineProps<{
    churchId: number,
  }>(),
  {
  }
)
const detail = ref({})
const geographicalRegionTree = ref('')
const headingClass = 'text-left font-weight-medium'
const getPath = function (node) {
  const path = [node.name]
  let current = node
  while (current.children && current.children.length > 0) {
    current = current.children[0]
    path.push(current.name)
  }
  return path.join(' > ')
}
const fetchData = async (churchId) => {
  detail.value = await churchService.get(churchId, false)

  // detail.value.twitter = 'https://twitter.com/examplechurch'
  // detail.value.instagram = 'https://instagram.com/examplechurch'
  // detail.value.facebook = 'https://facebook.com/examplechurch'
  // detail.value.website = 'https://www.examplechurch.org'

  // fetch extra - geo Ancestors
  const accestors = await geographicalRegionService.getListAncestor(detail.value?.geographical_region_id, false)

  geographicalRegionTree.value = getPath(accestors[0])
}

watch(
  () => props.churchId,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      fetchData(newVal)
    }
  },
  { immediate: true }
)
</script>

<template>
  <CardHeader title="Church Details">
    <v-table class="text-no-wrap bordered-table" density="compact" hover>
      <tbody>
        <tr>
          <th :class="headingClass">{{ $t('church.labelName') }}</th>
          <td>{{ detail?.name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('church.motherChurch') }}</th>
          <td>{{ detail?.parent_name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('church.language') }}</th>
          <td>{{ detail?.language_name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('church.labelCountry') }}</th>
          <td>{{ detail?.country_name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('church.sensitiveNation') }}</th>
          <td>
            <v-icon v-if="detail?.sensitive_nation" color="success">$checkboxMarkedOutline</v-icon>
            <v-icon v-else class="text-disabled">$checkboxBlankOutline</v-icon>
          </td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('church.labelDateOfBirth') }}</th>
          <td>
            <template v-if="detail?.date_of_birth">
              {{ $t('yearOld', {date: appFormatDate(detail?.date_of_birth), year: getAge(detail?.date_of_birth)}) }}
            </template>
          </td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('church.labelEmailAddress') }}</th>
          <td>{{ detail?.email }}</td>
        </tr>
        <tr>
          <th :class="headingClass"></th>
          <td>{{ detail?.office_phone }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t('church.links') }}</th>
          <td>
            <v-btn
              v-if="detail?.website"
              icon="$web"
              variant="text"
              :href="detail?.website"
              target="_blank"
              rel="noopener"
            />
            <v-btn
              v-if="detail?.facebook"
              icon="$facebook"
              variant="text"
              :href="detail?.facebook"
              target="_blank"
              rel="noopener"
            />
            <v-btn
              v-if="detail?.twitter"
              icon="$twitter"
              variant="text"
              :href="detail?.twitter"
              target="_blank"
              rel="noopener"
            />
            <v-btn
              v-if="detail?.instagram"
              icon="$instagram"
              variant="text"
              :href="detail?.instagram"
              target="_blank"
              rel="noopener"
            />
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-expansion-panels multiple>
      <!-- 🏠 Service Address -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t('church.serviceAddress') }}
        </v-expansion-panel-title>
        <v-expansion-panel-text class="pa-0">
          <v-table class="text-no-wrap bordered-table" hover density="comfortable">
            <tbody>
              <tr>
                <th :class="headingClass">{{ $t('church.street') }}</th>
                <td>{{ detail.service_address_street }}</td>
              </tr>
              <tr>
                <th :class="headingClass">{{ $t('church.postalCode') }}</th>
                <td>{{ detail?.service_address_postal_code }}</td>
              </tr>
              <tr>
                <th :class="headingClass">{{ $t('church.labelServiceVenue') }}</th>
                <td>{{ detail?.service_venue }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 🏢 Office Address -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t('church.officeAddress') }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-table class="text-no-wrap bordered-table" hover density="comfortable">
            <tbody>
              <tr>
                <th :class="headingClass">{{ $t('church.street') }}</th>
                <td>{{ detail?.office_address_street }}</td>
              </tr>
              <tr>
                <th :class="headingClass">{{ $t('church.postalCode') }}</th>
                <td>{{ detail?.office_address_postal_code }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- ℹ️ More -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t('more') }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-table class="text-no-wrap bordered-table" hover density="comfortable">
            <tbody>
              <tr>
                <th :class="headingClass">{{ $t('ormId') }}</th>
                <td>{{ detail?.id }}</td>
              </tr>
              <tr>
                <th :class="headingClass">{{ $t('church.labelChurchType') }}</th>
                <td>{{ detail?.church_type_name }}</td>
              </tr>
              <tr>
                <th :class="headingClass">{{ $t('church.labelChurchNetwork') }}</th>
                <td>{{ detail?.church_network_name }}</td>
              </tr>
              <tr>
                <th :class="headingClass">{{ $t('church.geographicRegion') }}</th>
                <td>{{ detail?.geographical_region_name }}</td>
              </tr>
              <tr>
                <th :class="headingClass">{{ $t('church.geographicRegionTree') }}</th>
                <td>{{ geographicalRegionTree }}</td>
              </tr>
              <tr>
                <th :class="headingClass">{{ $t('church.labelChurchRegion') }}</th>
                <td>{{ detail?.church_region_name }}</td>
              </tr>
              <tr>
                <th :class="headingClass">{{ $t('church.labelLanguageRegion') }}</th>
                <td>{{ detail?.language_region_name }}</td>
              </tr>
              <tr>
                <th :class="headingClass">{{ $t('church.labelCurrency') }}</th>
                <td>{{ detail?.currency_name }}</td>
              </tr>
              <tr v-if="detail?.disabled">
                <th :class="headingClass">{{ $t('church.reasonDisabling') }}</th>
                <td>{{ detail?.disabled_reason }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
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

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 !important;
}
</style>
