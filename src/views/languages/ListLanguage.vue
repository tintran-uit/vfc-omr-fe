<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from "vue-router";
import DynamicTableDefault from '@/components/tables/DynamicTableDefault.vue';
import { languageService } from '@/services/languageService';
import TablePageShell from "@/components/shared/TablePageShell.vue";
import TableSearchBox from "@/components/tables/TableSearchBox.vue";
import tableSchema from '@/table-schemas/languageTableSchema';
import { tableOptionsToParams } from '@/helpers/dataTableHelper';

const router = useRouter()
const items = ref([])

// Data table options
const page = ref(1)
const itemsPerPage = ref(25)
const totalItems = ref(0)
const searches = ref([])
const sortBy = ref([
  { key: 'id', order: 'desc' }
])

const buildOptions = () => {
  return {
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    searches: searches.value
  }
}

const fetchData = async function (options = {}) {
  const data = await languageService.getList(
    tableOptionsToParams(options)
  )
  items.value = data.items;
  totalItems.value = data.total;
}

const onEdit = (item: unknown) => {
  const it = item as { id: number | string }
  router.push({ name: 'LanguageEdit', params: { id: it.id } })
}

const onDelete = async (item: unknown) => {
  const it = item as { id: number | string }
  await languageService.del(it.id)
  fetchData(buildOptions())
}

const onUpdateOptions = (options) => {
  fetchData(options);
}

const onSearch = () => {
  fetchData(buildOptions())
}
</script>

<template>
  <TablePageShell title-key="language.listTitle">
    <template #header-right>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
        @search="onSearch"
      />
      <v-btn
        color="primary"
        variant="outlined"
        @click="router.push({ name: 'LanguageAdd' })"
      >
        <v-icon>$plus</v-icon> {{ $t('addNew') }}
      </v-btn>
    </template>

    <DynamicTableDefault
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:searches="searches"
      v-model:sort-by="sortBy"
      :hide-title="true"
      :hide-header="true"
      :total-items="totalItems"
      :headers="tableSchema.headers"
      :items="items"
      :enabled-actions="['edit', 'delete']"
      @action:edit="onEdit"
      @action:delete="onDelete"
      @update:options="onUpdateOptions"
    />
  </TablePageShell>
</template>

<style scoped lang="scss">

</style>