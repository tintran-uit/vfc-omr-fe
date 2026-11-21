<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { worshipServiceService } from '@/services/worshipServiceService';
import { churchService } from '@/services/churchService';
import tableSchema from '@/table-schemas/worshipServiceTableSchema';
import { useI18n } from 'vue-i18n';
import DynamicTableDefault from '@/components/tables/DynamicTableDefault.vue';
import TablePageShell from "@/components/shared/TablePageShell.vue";

const router = useRouter()
const route = useRoute()
const { t } = useI18n();
const items = ref<Array<Record<string, unknown>>>([])
const church = ref<{ name?: string } | null>(null)
const page = ref(1)
const itemsPerPage = ref(25)
const sortBy = ref([{ key: 'id', order: 'desc' }])
const churchId = computed(() => route.params.churchId)

const sortedItems = computed(() => {
  const list = [...items.value]
  const sort = sortBy.value?.[0]
  if (!sort?.key) return list

  const direction = sort.order === 'desc' ? -1 : 1
  return list.sort((a, b) => {
    const left = a?.[sort.key] ?? ''
    const right = b?.[sort.key] ?? ''
    return String(left).localeCompare(String(right), undefined, { numeric: true }) * direction
  })
})

const pagedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  return sortedItems.value.slice(start, start + itemsPerPage.value)
})

const fetchData = async function (id) {
  const data = await worshipServiceService.getListByChurch(id)
  items.value = Array.isArray(data) ? data : []
}

const fetchChurchDetail = async (id) => {
  church.value = await churchService.getById(id)
}

const onEdit = (item: unknown) => {
  const it = item as { id: number | string }
  router.push({ name: 'WorshipServiceEdit', params: { churchId: churchId.value, id: it.id } })
}

function formatServiceTime(time: unknown) {
  const value = String(time ?? '')
  const match = value.match(/^(\d{1,2}):(\d{2})/)
  if (!match) return value
  return `${match[1].padStart(2, '0')}:${match[2]}`
}

watch(
  () => churchId.value,
  async (id) => {
    if (!id) return
    page.value = 1
    fetchChurchDetail(id)
    fetchData(id)
  },
  { immediate: true }
)
</script>

<template>
  <TablePageShell
    :title="t('worshipService.listTitle', { churchName: church?.name })"
    :title-md="12"
    :header-right-md="0"
  >
    <DynamicTableDefault
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      :hide-title="true"
      :hide-header="true"
      :total-items="items.length"
      :headers="tableSchema.headers"
      :items="pagedItems"
      :enabled-actions="['edit']"
      @action:edit="onEdit"
    >
      <template #item.time="{ item }">
        {{ formatServiceTime(item.time) }}
      </template>
    </DynamicTableDefault>
  </TablePageShell>
</template>
