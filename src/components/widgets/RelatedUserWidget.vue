<script setup lang="ts">
import {ref, watch, computed, onMounted, defineAsyncComponent} from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import { userService } from '@/services/userService';
import tableSchema from '@/table-schemas/relatedUserTableSchema';
import { tableOptionsToParams } from '@/helpers/dataTableHelper';
import DynamicTableDefault from '@/components/tables/DynamicTableDefault.vue';
import defaultAvatar from '@/assets/images/users/avatar-default.svg';

const props = withDefaults(
  defineProps<{
    churchId: number,
  }>(),
  {
  }
)

const items = ref([])
const page = ref(1)
const itemsPerPage = ref(25)
const totalItems = ref(0)
const search = ref({})
const sortBy = ref([
  { key: 'id', order: 'desc' }
])

const fetchData = async function (options = {}) {
  const data = await userService.getRelatedUserListOfChurch(
    props.churchId,
    tableOptionsToParams(options),
    false
  )

  items.value = data.items;
  totalItems.value = data.total_pages;
}

const onUpdateOptions = (options) => {
  fetchData(options);
}

watch(
  () => props.churchId,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      fetchData({
        page: page.value,
        itemsPerPage: itemsPerPage.value,
        sortBy: sortBy.value,
        search: search.value
      })
    }
  },
  { immediate: true }
)
</script>

<template>
  <CardHeader title="Related Users">
    <DynamicTableDefault
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:search="search"
      v-model:sort-by="sortBy"
      :total-items="totalItems"
      :headers="tableSchema.headers"
      :searches-config="tableSchema.searches"
      :items="items"
    >
      <template v-slot:item.avatar="{ item }">
        <v-img :src="item?.photo_url || defaultAvatar" alt="User avatar"
    width="50"
    height="50"
    class="py-2"
     />
      </template>
      
      <template v-slot:item.full_name="{ item }">
        {{ item.first_name }} {{ item.last_name }}
      </template>
    </DynamicTableDefault>
  </CardHeader>
</template>

<style scoped>
.user-info-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5e5e5; /* viền ngoài nhẹ */
}

.user-info-table td {
  border: 1px solid #e5e5e5; /* viền cell nhẹ */
  padding: 8px 12px;
  vertical-align: middle;
}

.user-info-table tr:nth-child(even) {
  background-color: #fafafa; /* xen kẽ nhẹ cho dễ đọc */
}

.label-cell {
  width: 160px;
  font-weight: 600;
  color: #555;
  background-color: #f8f8f8;
}

.value-cell {
  color: #333;
}

.text-sm {
  font-size: 0.9rem;
}

.border-light {
  border: 1px solid #e5e5e5; /* avatar cũng có viền nhẹ */
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0; /* ngăn cách từng user */
}
</style>
