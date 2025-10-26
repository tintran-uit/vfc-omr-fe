<script setup lang="ts">
import {ref, watch, computed, onMounted, defineAsyncComponent} from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import tableSchema from '@/table-schemas/attachmentTableSchema';
import DynamicTableDefault from '@/components/dynamic-table/DynamicTableDefault.vue';
import { attachmentService } from '@/services/attachmentService';
import { tableOptionsToParams } from '@/helpers/dataTableHelper.ts';
import { useAuthStore } from '@/stores/authStore';

const props = withDefaults(
  defineProps<{
    churchId: number,
    title?: string
  }>(),
  {
    churchId: 76,
    title: 'Attachments'
  }
)

const emit = defineEmits<{
  
}>()

const items = ref<any[]>([])
const totalItems = ref(0)
const loading = ref(false)
const search = ref('')
const sortBy = ref([{ key: 'id', order: 'desc' }])
const page = ref(1)
const itemsPerPage = ref(50)
const actions = ref([])
const fetchData = async function (options = {}) {
  const data = await attachmentService.getListByChurchId(
    props.churchId,
    tableOptionsToParams(options)
  )
  items.value = data.items;
  totalItems.value = data.total_pages;
}

watch(
  () => props.churchId,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      page.value = 1
      await fetchData()
    }
  },
  { immediate: true }
)

watch([page, itemsPerPage, sortBy, search], () => {
  fetchData()
})
</script>

<template>
  <CardHeader title="Attachments">
    <DynamicTableDefault
                v-model:page="page"
                v-model:items-per-page="itemsPerPage"
                v-model:search="search"
                v-model:sort-by="sortBy"
                :total-items="totalItems"
                :headers="tableSchema.headers"
                :searches-config="tableSchema?.searches || []"
                :items="items"
                :enabled-actions="actions"
                @action:edit="onEdit"
              >
              <template v-slot:item.fileDownload="{ item }">
                <a :href="item.path" target="_blank">{{ item.attachment }}</a>
              </template>
            </DynamicTableDefault>
  </CardHeader>
</template>

<style scoped>

</style>
