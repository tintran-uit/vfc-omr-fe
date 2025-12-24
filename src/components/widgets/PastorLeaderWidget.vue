<script setup lang="ts">
import {ref, watch, computed, onMounted, defineAsyncComponent} from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import { userService } from '@/services/userService';

const props = withDefaults(
  defineProps<{
    userId: number,
  }>(),
  {
  }
)
const detail = ref({})
const fetchData = async (userId) => {
  detail.value = await userService.get(userId, false)
}
const headingClass = 'text-left font-weight-medium'


watch(
  () => props.userId,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      fetchData(newVal)
    }
  },
  { immediate: true }
)
</script>

<template>
  <CardHeader title="Pastor Leader Details">
    <v-table class="text-no-wrap bordered-table" density="compact" hover>
      <tbody>
        <tr>
          <th :class="headingClass">Full Name</th>
          <td>{{ detail?.name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Title</th>
          <td>{{ detail?.title }}</td>
        </tr>
        <tr>
          <th :class="headingClass">OMR #</th>
          <td>{{ detail?.id }}</td>
        </tr>
        <tr>
          <th :class="headingClass">User Name</th>
          <td>{{ detail?.username }}</td>
        </tr>
        <tr>
          <th :class="headingClass">OMR Role</th>
          <td>{{ detail?.role?.name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Language</th>
          <td>{{ detail?.language_name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Nation</th>
          <td>{{ detail?.country_name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Sensitive Nation</th>
          <td>{{ detail?.sensitive_nation ? 'Yes' : 'No' }}</td>
        </tr>
        <tr>
          <th :class="headingClass">E-mail</th>
          <td>{{ detail?.email_address }}</td>
        </tr>
        <tr>
          <th :class="headingClass">Phone</th>
          <td>{{ detail?.mobile_phone }}</td>
        </tr>
        <tr>
          <th :class="headingClass">From</th>
          <td>{{ detail?.church_name }}</td>
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
