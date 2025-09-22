<script setup lang="ts">
import {ref, watch, computed, onMounted} from 'vue'
import {useDialogStore} from '@/stores/dialogStore';

const dialogStore = useDialogStore()

interface SearchField {
  type: 'TextInput' | 'SelectInput';
  label: string;
  options?: { label: string; value: string }[];
}

const page = defineModel('page', { default: 1 })
const itemsPerPage = defineModel('itemsPerPage', { default: 25 })
const sortBy = defineModel('sortBy', { default: () => [] })
const searches = defineModel('searches', { default: () => [] })

const props = withDefaults(
  defineProps<{
    items: any[],
    headers: any[],
    // itemsPerPage?: number,
    // totalPages?: number,
    totalItems?: number,
    searchesConfig?: any[],
    // total?: number,
    // loading: boolean,
    // options: any,
    // onOptionsChange: (opts: any) => void,
    // onAction: (action: string, item: any) => void
    enabledActions?:string[]
  }>(),
  {
    totalItems: 0,
    itemsPerPage: 25,
    enabledActions: []
  }
)

const totalPages = computed(() => Math.ceil(props.totalItems / itemsPerPage.value))

const emit = defineEmits<{
  (e: 'update:options', value: any): void
  (e: 'action', payload: { action: string, item: any }): void
  (e: 'filter-change', value: any): void
  (e: 'action:update', value: any): void
  (e: 'action:delete', value: any): void
}>()

// Search
let searchTimeout = null;
const searchModel = ref({})
const searchPayload = computed(() => {
  return props.searchesConfig
    .filter(s => searchModel.value[s.name] !== '' && searchModel.value[s.name] !== null && searchModel.value[s.name] !== undefined)
    .map(s => ({
      key: s.name,
       value: searchModel.value[s.name]
      })
    )
})
const handleSearch = () => {
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    searches.value = searchPayload.value
    emit('update:options', buildOptions())
  }, 500)
}

const handleUpdateOptions = (val: any) => {
  emit('update:options', buildOptions())
}

const buildOptions = () => {
  return {
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    searches: searchPayload.value
  }
}

// Handle actions
const handleActionUpdate = (item) => {
  emit('action:update', item)
}

const handleActionDelete = async (item) => {
  emit('action:delete', item)
}

const handleActionClone = (item) => {
  emit('action:clone', item)
}

onMounted(() => {
  emit('update:options', buildOptions())
})
</script>

<template>
   <div class="d-flex flex-wrap gap-4 mb-4">
     <template v-for="(item, key) in searchesConfig" :key="key">
       <v-text-field
         v-model="searchModel[item.name]"
         :label="item.label"
         density="compact"
         variant="outlined"
         hide-details
         style="max-width: 200px;"
         @input="handleSearch"
       />
     </template>
   </div>


    <v-data-table-server
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      :items-length="totalItems"
      :headers="headers"
      :items="items"
      @update:options="handleUpdateOptions"
    >
      <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
        <tr>
          <template v-for="column in columns" :key="column.key">
            <th>
              <div class="d-flex align-center">
                <template v-if="column?.sortable === true">
                  <span
                    class="me-2 cursor-pointer"
                    @click="toggleSort(column)"
                    v-text="$t(column.title)"
                  ></span>

                  <v-icon
                    v-if="isSorted(column)"
                    :icon="getSortIcon(column)"
                    color="medium-emphasis"
                  ></v-icon>

                  <v-icon
                    v-if="column.removable"
                    color="medium-emphasis"
                    icon="$close"
                    @click="remove(column.key)"
                  ></v-icon>
                </template>
                <template v-else>
                  <span
                    class="me-2 cursor-pointer"
                    v-text="column.title"
                  ></span>
                </template>

                <!--              <v-select-->
                <!--                clearable-->
                <!--                chips-->
                <!--                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"-->
                <!--                multiple-->
                <!--              ></v-select>-->
              </div>
            </th>
          </template>
        </tr>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <template v-for="(header, index) in headers" :key="item.id">
            <td>
              <div v-if="header.key === 'actions'" class="d-flex ga-2 text-no-wrap">
                <v-btn icon="$edit" size="x-small" @click="handleActionUpdate(item)" v-if="enabledActions.includes('update')" />
                <v-btn icon="$delete" size="x-small" @click="handleActionDelete(item)" v-if="enabledActions.includes('delete')" />
                <v-btn icon="$copy" size="x-small" @click="handleActionClone(item)" v-if="enabledActions.includes('clone')" />
              </div>
              <slot v-else :name="`item.${header.key}`" :item="item" :value="item[header.key]">
                {{ item[header.key] }}
              </slot>
            </td>
        </template>
        </tr>
      </template>


      <template #bottom>
        <div class="d-flex justify-space-between align-center pa-2">
        <span>
          {{ $t('pageText', {
            from: (page - 1) * itemsPerPage + 1,
            to: Math.min(page * itemsPerPage, totalItems),
            total: totalItems
          }) }}
        </span>
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="5"
          density="comfortable"
        />
      </div>
      </template>


<!--      <template v-slot:tfoot>-->
<!--        <tr>-->
<!--          <td>-->
<!--            <v-text-field v-model="search2.id" class="ma-2" density="compact" placeholder="Search name..." hide-details></v-text-field>-->
<!--          </td>-->
<!--          <td>-->
<!--            <v-text-field v-model="search2.email" class="ma-2" density="compact" placeholder="Search Email..." hide-details></v-text-field>-->
<!--          </td>-->
<!--        </tr>-->
<!--      </template>-->
    </v-data-table-server>


  <!--  <div class="d-flex justify-space-between align-center py-2 px-4">-->
  <!--    &lt;!&ndash; Select items per page &ndash;&gt;-->
  <!--    <v-select-->
  <!--      v-model="localItemsPerPage"-->
  <!--      :items="perPageOptions"-->
  <!--      label="Items per page"-->
  <!--      dense-->
  <!--      hide-details-->
  <!--      style="max-width: 120px"-->
  <!--      @update:modelValue="onChangeItemsPerPage"-->
  <!--    ></v-select>-->

  <!--    &lt;!&ndash; Pagination control &ndash;&gt;-->
  <!--    <v-pagination-->
  <!--      v-model="localPage"-->
  <!--      :length="totalPages"-->
  <!--      total-visible="5"-->
  <!--      @update:modelValue="onChangePage"-->
  <!--    ></v-pagination>-->
  <!--  </div>-->
</template>

<style scoped>

</style>
