<script setup lang="ts">
import {ref, watch, computed, onMounted, defineAsyncComponent} from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import { churchService } from '@/services/churchService';
import { formatDate, getAge } from '@/helpers/dateTimeHelper';

const props = withDefaults(
  defineProps<{
    churchId: number,
  }>(),
  {
  }
)
const detail = ref({})
const fetchData = async (churchId) => {
  detail.value = await churchService.get(churchId)
}
const headingClass = 'text-left font-weight-medium'


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
          <th :class="headingClass">Church Name</th>
          <td>{{ detail?.name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Mother Church</th>
          <td>{{ detail?.motherChurch }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Language</th>
          <td>{{ detail?.language_name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Nation</th>
          <td>{{ detail?.sensitive_nation ? 'Yes' : 'No' }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Date of Birth</th>
          <td>{{ formatDate(detail?.date_of_birth) }} [{{ getAge(detail?.date_of_birth) }} Yrs old]</td>
        </tr>
        <tr>
          <th :class="headingClass">Email</th>
          <td>{{ detail?.email }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Office Phone</th>
          <td>{{ detail?.office_phone }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Website</th>
          <td>{{ detail?.website }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Fb</th>
          <td>{{ detail?.face }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Instagram</th>
          <td>{{ detail?.xxx }}</td>
        </tr>
        <tr>
          <th :class="headingClass">YouTube</th>
          <td>{{ detail?.xxx }}</td>
        </tr>
      </tbody>
    </v-table>

    <v-expansion-panels multiple>
      <!-- 🏠 Service Address -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon start>mdi-home-map-marker</v-icon>
          Service Address
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-table class="text-no-wrap bordered-table" hover density="comfortable">
            <tbody>
              <tr>
                <th :class="headingClass">Street</th>
                <td>{{ detail.service_address_street }}</td>
              </tr>
              <tr>
                <th :class="headingClass">Postal Code</th>
                <td>{{ detail?.service_address_postal_code }}</td>
              </tr>
              <tr>
                <th :class="headingClass">We are meeting</th>
                <td>{{ detail?.service_venue }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 🏢 Office Address -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon start>mdi-office-building-marker</v-icon>
          Office Address
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-table class="text-no-wrap bordered-table" hover density="comfortable">
            <tbody>
              <tr>
                <th :class="headingClass">Street</th>
                <td>{{ detail?.office_address_street }}</td>
              </tr>
              <tr>
                <th :class="headingClass">Postal Code</th>
                <td>{{ detail?.office_address_postal_code }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- ℹ️ More -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon start>mdi-information-outline</v-icon>
          More
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-table class="text-no-wrap bordered-table" hover density="comfortable">
            <tbody>
              <tr>
                <th :class="headingClass">OMR #</th>
                <td>{{ detail?.id }}</td>
              </tr>
              <tr>
                <th :class="headingClass">Church Type</th>
                <td>{{ detail?.church_type_name }}</td>
              </tr>
              <tr>
                <th :class="headingClass">Church Network</th>
                <td>{{ detail?.church_network_name }}</td>
              </tr>
              <tr>
                <th :class="headingClass">Geographic Region</th>
                <td>{{ detail?.geographical_region_name }}</td>
              </tr>
              <tr>
                <th :class="headingClass">Geographic Region Tree</th>
                <td>{{ detail?.xxx }}</td>
              </tr>
              <tr>
                <th :class="headingClass">Church Apostolic Region</th>
                <td>{{ detail?.church_region_name }}</td>
              </tr>
              <tr>
                <th :class="headingClass">Language Region</th>
                <td>{{ detail?.xxx }}</td>
              </tr>
              <tr>
                <th :class="headingClass">Local Currency</th>
                <td>{{ detail?.currency_name }}</td>
              </tr>
              <!-- <tr>
                <th :class="headingClass">Reason for Disabling</th>
                <td>---</td>
              </tr> -->
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
</style>
