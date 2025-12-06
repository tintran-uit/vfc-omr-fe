<script setup lang="ts">
import {ref, watch, computed, onMounted} from 'vue'
import { useDialogStore } from '@/stores/dialogStore';
import { useI18n } from 'vue-i18n';

const dialogStore = useDialogStore()
const { t } = useI18n();
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
    enabledActions?:string[],
    actionTitles?: Record<string, string>,
    emptyPlaceholder?: string,
  }>(),
  {
    totalItems: 0,
    itemsPerPage: 25,
    enabledActions: [],
    actionTitles: {
      edit: "dataTable.buttonEditTitle",
      delete: "dataTable.buttonDeleteTitle",
      clone: "dataTable.buttonCloneTitle",
      assignOverseer: "dataTable.buttonAssignOverseerTitle",
      disable: "dataTable.buttonDisableTitle",
      enable: "dataTable.buttonEnableTitle",
    },
    emptyPlaceholder: '-'
  }
)

const totalPages = computed(() => Math.ceil(props.totalItems / itemsPerPage.value))

const emit = defineEmits<{
  (e: 'update:options', value: any): void
  (e: 'action', payload: { action: string, item: any }): void
  (e: 'filter-change', value: any): void
  (e: 'action:edit', value: any): void
  (e: 'action:delete', value: any): void
  (e: 'action:assignOverseer', value: any): void
  (e: 'action:clone', value: any): void
  (e: 'action:disable', value: any): void
  (e: 'action:enable', value: any): void
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
const handleActionEdit = (item) => {
  emit('action:edit', item)
}

const handleActionDelete = async (item) => {
  if (!await dialogStore.confirm(t('areYouSureWantToDelete'))) return
  emit('action:delete', item)
}

const handleActionClone = (item) => {
  emit('action:clone', item)
}

const handleAssignOverseerAction = (item) => {
  emit('action:assignOverseer', item)
}

const handleDisableAction = async (item) => {
  if (!await dialogStore.confirm(t('areYouSureWantToDisable'))) return
  emit('action:disable', item)
}

const handleEnableAction = async (item) => {
  if (!await dialogStore.confirm(t('areYouSureWantToEnable'))) return
  emit('action:enable', item)
}

onMounted(() => {
  emit('update:options', buildOptions())
})
</script>

<template>
   <v-row class="mb-2 pt-2 px-2" dense>
     <template v-for="(item, key) in searchesConfig" :key="key">
      <v-col cols="6" md="3">
        <v-text-field
              v-model="searchModel[item.name]"
              :placeholder="$t(item.label)"
              single-line
              variant="outlined"
              class="mb-3"
              @input="handleSearch"
              hide-details
            ></v-text-field>
        </v-col>
     </template>
    </v-row>

    <v-data-table-server
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      :items-length="totalItems"
      :headers="headers"
      :items="items"
      @update:options="handleUpdateOptions"
      class="bordered-table rounded-0"
      :no-data-text="$t('noData')"
    >
      <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
        <tr class="bg-containerBg">
          <template v-for="column in columns" :key="column.key">
            <th class="text-start text-uppercase text-caption font-weight-bold">
              <div class="d-flex align-center">
                <template v-if="column?.sortable === true">
                  <span
                    class="me-2 cursor-pointer"
                    @click="toggleSort(column)"
                  >
                {{ $t(column.title) }}
                </span>

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
                  >
                  {{ $t(column.title) }}
                </span>
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
                <v-tooltip :text="$t('dataTable.buttonEditTitle')">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon="$edit" size="x-small" @click="handleActionEdit(item)" v-if="enabledActions.includes('edit')" />
                  </template>
                </v-tooltip>
                
                <v-tooltip :text="$t('dataTable.buttonDeleteTitle')">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon="$delete" size="x-small" @click="handleActionDelete(item)" v-if="enabledActions.includes('delete')" />
                  </template>
                </v-tooltip>
                
                <v-tooltip :text="$t('dataTable.buttonCloneTitle')">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon="$copy" size="x-small" @click="handleActionClone(item)" v-if="enabledActions.includes('clone')" />
                  </template>
                </v-tooltip>
                
                <v-tooltip :text="$t('dataTable.buttonAssignOverseerTitle')">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon="$earthPlus" size="x-small" @click="handleAssignOverseerAction(item)" v-if="enabledActions.includes('assignOverseer')" />
                  </template>
                </v-tooltip>
                
               <v-tooltip :text="$t('dataTable.buttonDisableTitle')">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon="$cancel" size="x-small" @click="handleDisableAction(item)" v-if="enabledActions.includes('disable')" />
                  </template>
               </v-tooltip>

                <v-tooltip :text="$t('dataTable.buttonEnableTitle')">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon="$check" size="x-small" @click="handleEnableAction(item)" v-if="enabledActions.includes('enable')" />
                  </template>
                </v-tooltip>
              </div>
              <slot v-else :name="`item.${header.key}`" :item="item" :value="item[header.key]">
                {{ item[header.key] || emptyPlaceholder }}
              </slot>
            </td>
        </template>
        </tr>
      </template>


      <template #bottom>
        <v-row class="pa-4 align-center">
          <v-col cols="12" md="6" class="d-flex align-center">
            <span>
              {{ $t('pageText', {
                from: (page - 1) * itemsPerPage + 1,
                to: Math.min(page * itemsPerPage, totalItems),
                total: totalItems
              }) }}
            </span>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-pagination
              v-model="page"
              :length="totalPages"
              :total-visible="5"
              density="comfortable"
            />
          </v-col>
        </v-row>
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
