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
  ...(authStore.can('church.update') ? ['edit'] : []),
   ...(authStore.can('church.clone') ? ['clone'] : []),
    ...(authStore.can('church.disable') ? ['disable'] : []),
  ];
})

const fetchData = async function (options = {}) {
  const data = await churchService.getList(
    tableOptionsToParams(options)
  )
  items.value = data.items;
  totalItems.value = data.total;
}

const onEdit = (item: unknown) => {
  const it = item as { id: number | string }
  router.push({ name: 'ChurchEdit', params: { id: it.id } })
}

const onClone = (item) => {
  router.push({ name: 'ChurchClone', params: { id: item.id } })
}

const onDisable = async (item: unknown, reason: string) => {
  // Open popup disable
  const it = item as { id: number | string }
  await churchService.disable(it.id, reason)
  
  fetchData()
}

const onUpdateOptions = (options) => {
  fetchData(options);
}

const onSearch = () => {
  fetchData(buildOptions())
}

const buildOptions = () => {
  return {
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    searches: searches.value
  }
}
</script>

<template>
  <TablePageShell title-key="church.listTitle">
    <template #header-right>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
        @search="onSearch"
      />
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="primary"
            variant="outlined"
          >
            <v-icon>$plus</v-icon> {{ $t('addNew') }}
            <v-icon end>$chevronDown</v-icon>
          </v-btn>
        </template>

        <v-list density="compact">
          <v-list-item :to="{name: 'ChurchAdd'}">
            <v-list-item-title>{{ $t('church.addNewChurchBtn') }}</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{name: 'ChurchAddWithNewPastor'}">
            <v-list-item-title>{{ $t('church.addNewChurchWithPastorBtn') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
      @action:edit="onEdit"
      @action:clone="onClone"
      @action:disable="onDisable"
      @update:options="onUpdateOptions"
    >
    <template v-slot:[`item.attributes`]="{ item }">
      <div class="text-end text-no-wrap">
        <v-chip
          v-if="item?.is_mother_church"
          color="success"
          :text="$t('church.mother')"
          class="mr-2"
          size="small"
          label
        ></v-chip>
        <v-chip
          v-if="item?.is_msc"
          color="warning"
          :text="$t('church.msc')"
          class="mr-2"
          size="small"
          label
        ></v-chip>
        <v-chip
          v-if="item?.on_map"
          color="primary"
          :text="$t('church.onMap')"
          class="mr-2"
          size="small"
          label
        ></v-chip>
      </div>
    </template>

    <template v-slot:[`item.name`]="{ item }">
      <router-link
        class="dt-cell-link"
        :to="{ name: 'ChurchDetail', params: { id: item.id } }"
      >
        {{ item.name }}
      </router-link>
    </template>
    </DynamicTableDefault>
  </TablePageShell>
</template>

<style scoped lang="scss">

</style>