<script setup lang="ts">
import {ref, watch, computed, onMounted, defineAsyncComponent} from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import { churchService } from '@/services/churchService';
import DynamicTableDefault from "@/components/dynamic-table/DynamicTableDefault.vue";
import tableSchema from '@/table-schemas/churchTableSchema';
import { tableOptionsToParams } from '@/helpers/dataTableHelper';

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
  const data = await churchService.getListDaughter(
    props.churchId,
    tableOptionsToParams(options)
  )

  items.value = data.items;
  totalItems.value = data.total_pages;
}

const onEdit = (item: any) => {
  router.push({ name: 'ChurchEdit', params: { id: item.id } })
}

const onClone = (item) => {
  router.push({ name: 'ChurchClone', params: { id: item.id } })
}

const onDisable = async (item: any) => {
  if (!await dialogStore.confirm('Are you sure you want to disable?')) return
  await churchService.disable(item.id)
  
  fetchData()
}

const onUpdateOptions = (options) => {
  fetchData(options);
}

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
  <CardHeader :title="$t('church.dashboardDaugterChurchTitle')">
    <DynamicTableDefault
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:search="search"
      v-model:sort-by="sortBy"
      :total-items="totalItems"
      :headers="tableSchema.headers"
      :searches-config="tableSchema.searches"
      :items="items"
      :enabled-actions="['edit', 'disable']"
      @action:edit="onEdit"
      @action:disable="onDisable"
      @update:options="onUpdateOptions"
    >
      <template v-slot:item.attributes="{ item }">
        <div class="text-end text-no-wrap">
          <v-chip
            v-if="item?.is_msc"
            color="warning"
            :text="$t('churchTable.msc')"
            class="mr-2"
            size="small"
            label
          ></v-chip>
          <v-chip
            v-if="item?.is_mother_church"
            color="success"
            :text="$t('churchTable.mother')"
            class="mr-2"
            size="small"
            label
          ></v-chip>
        </div>
      </template>

      <template v-slot:item.name="{ item }">
        <v-btn
          color="primary"
          variant="text"
          :to="{ name: 'ChurchDetail', params: { id: item.id } }"
        >
        {{ item.name }}
        </v-btn>
      </template>
    </DynamicTableDefault>
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
