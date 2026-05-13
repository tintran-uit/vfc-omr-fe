<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { churchRegionService } from '@/services/churchRegionService';
import DataTable from '@/components/tables/DataTable.vue';
import tableSchema from '@/table-schemas/geographicalRegionTableSchema';
import TablePageShell from "@/components/shared/TablePageShell.vue";
import TableSearchBox from "@/components/tables/TableSearchBox.vue";

defineOptions({ name: "ChurchRegionsList" });

const router = useRouter()
const items = ref([])
const searches = ref([])
const page = ref(1)
const itemsPerPage = ref(25)
const sortBy = ref([{ key: 'id', order: 'desc' }])

const fetchData = async () => {
  const data = await churchRegionService.getAll()
  items.value = data
}

const onEdit = (item: unknown) => {
  const it = item as { id: number | string }
  router.push({ name: 'ChurchRegionsEdit', params: { id: it.id } })
}

const onDelete = async (item: unknown) => {
  const it = item as { id: number | string }
  await churchRegionService.del(it.id)

  fetchData()
}

onMounted(() => {
  fetchData()
})

const onSearch = () => {
  page.value = 1
}
</script>

<template>
  <TablePageShell title-key="churchRegions.listTitle">
    <template #header-right>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
        @search="onSearch"
      />
      <v-btn
        color="primary"
        variant="outlined"
        @click="router.push({ name: 'ChurchRegionsAdd' })"
      >
        <v-icon>$plus</v-icon> {{ $t('addNew') }}
      </v-btn>
    </template>

    <DataTable
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      v-model:searches="searches"
      :headers="tableSchema.headers"
      :items="items"
      :enabled-actions="['edit', 'delete']"
      @action:delete="onDelete"
      @action:edit="onEdit"
    />
  </TablePageShell>
</template>

<style scoped lang="scss">

</style>