<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { geographicalRegionService } from '@/services/geographicalRegionService';
import DataTable from '@/components/tables/DataTable.vue';
import tableSchema from '@/table-schemas/geographicalRegionTableSchema';
import TablePageShell from "@/components/shared/TablePageShell.vue";
import TableSearchBox from "@/components/tables/TableSearchBox.vue";

defineOptions({ name: "GeographicalRegionsList" });

const router = useRouter()
const items = ref([])
const searches = ref([])
const page = ref(1)
const itemsPerPage = ref(25)
const sortBy = ref([{ key: 'id', order: 'desc' }])

const fetchData = async () => {
  const flattenedItems = await geographicalRegionService.getAllFlattened()
  items.value = flattenedItems
}

const onEdit = (item: unknown) => {
  const it = item as { id: number | string }
  router.push({ name: 'GeographicalRegionsEdit', params: { id: it.id } })
}

const onDelete = async (item: unknown) => {
  const it = item as { id: number | string }
  await geographicalRegionService.del(it.id)

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
  <TablePageShell title-key="geographicalRegions.listTitle">
    <template #header-right>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
        @search="onSearch"
      />
      <v-btn
        color="primary"
        variant="outlined"
        @click="router.push({ name: 'GeographicalRegionsAdd' })"
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
    >
      <template v-slot:[`item.name`]="{ item }">
        <span class="text-medium-emphasis">
          {{ item.namePath.slice(0, -1).join(' > ') }}
        </span>

        <span v-if="item.namePath.length > 1" class="text-grey">
          &nbsp;>&nbsp;
        </span>

        <span>
          {{ item.namePath[item.namePath.length - 1] }}
        </span>
      </template>
    </DataTable>
  </TablePageShell>
</template>

<style scoped lang="scss">

</style>