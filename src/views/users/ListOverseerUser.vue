<script setup lang="ts">
import { ref } from 'vue';
import {userService} from '@/services/userService.ts';
import DynamicTableDefault from "@/components/tables/DynamicTableDefault.vue";
import TablePageShell from "@/components/shared/TablePageShell.vue";
import TableSearchBox from "@/components/tables/TableSearchBox.vue";
import tableSchema from '@/table-schemas/overseerTableSchema.ts';
import { tableOptionsToParams } from '@/helpers/dataTableHelper.ts';

const items = ref([])
const page = ref(1)
const itemsPerPage = ref(25)
const totalItems = ref(0)
const searches = ref([])
const sortBy = ref([
  { key: 'id', order: 'desc' }
])

const fetchData = async function (options = {}) {
  const data = await userService.getOverseerList(
    tableOptionsToParams(options)
  )
  items.value = data.items;
  totalItems.value = data.total_pages;
}

const onAssignOverseer = () => {
  alert('This function is in building.')
}

const onUpdateOptions = (options) => {
  fetchData(options);
}

const buildOptions = () => {
  return {
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    searches: searches.value
  }
}

const onSearch = () => {
  fetchData(buildOptions())
}
</script>

<template>
  <TablePageShell title-key="user.listOverseerTitle">
    <template #header-right>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
        @search="onSearch"
      />
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
      :enabled-actions="['assignOverseer']"
      @action:assign-overseer="onAssignOverseer"
      @update:options="onUpdateOptions"
    >
      <template v-slot:[`item.name`]="{ item }">
        <a
          href="#"
          variant="text"
          class="text-primary"
        >
          {{ item.name }}
        </a>
      </template>
    </DynamicTableDefault>
  </TablePageShell>
</template>

<style scoped lang="scss">

</style>