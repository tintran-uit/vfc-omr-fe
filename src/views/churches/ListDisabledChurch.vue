<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import {churchService} from '@/services/churchService.ts';
import DynamicTableDefault from "@/components/tables/DynamicTableDefault.vue";
import TablePageShell from "@/components/shared/TablePageShell.vue";
import TableSearchBox from "@/components/tables/TableSearchBox.vue";
import tableSchema from '@/table-schemas/churchTableSchema.ts';
import { tableOptionsToParams } from '@/helpers/dataTableHelper.ts';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter()
const items = ref([])
const page = ref(1)
const itemsPerPage = ref(25)
const totalItems = ref(0)
const searches = ref([])
const sortBy = ref([
  { key: 'id', order: 'desc' }
])

const actions = computed(() => {
  return [
    ...(authStore.can('church.enable') ? ['enable'] : []),
  ];
})

const fetchData = async function (options = {}) {
  const data = await churchService.getDisabledList(
    tableOptionsToParams(options)
  )
  items.value = data.items;
  totalItems.value = data.total_pages;
}

const onEnable = async (item: unknown) => {
  const it = item as { id: number | string }
  await churchService.enable(it.id)
  
  fetchData()
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
  <TablePageShell title-key="church.listDisabledTitle">
    <template #header-right>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
        @search="onSearch"
      />
      <v-btn 
        color="primary" 
        variant="outlined" 
        @click="router.push({ name: 'ChurchAdd' })"
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
      :enabled-actions="actions"
      @action:enable="onEnable"
      @update:options="onUpdateOptions"
    >
      <template v-slot:[`item.attributes`]="{ item }">
        <div class="text-end text-no-wrap">
          <v-chip
            v-if="item?.is_msc"
            color="warning"
            :text="$t('church.msc')"
            class="mr-2"
            size="small"
            label
          ></v-chip>
          <v-chip
            v-if="item?.is_mother_church"
            color="success"
            :text="$t('church.mother')"
            class="mr-2"
            size="small"
            label
          ></v-chip>
        </div>
      </template>

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