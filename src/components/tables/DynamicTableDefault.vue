<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useDialogStore } from '@/stores/dialogStore';
import { useI18n } from 'vue-i18n';

const dialogStore = useDialogStore()
const { t } = useI18n();
const page = defineModel('page', { default: 1 })
const itemsPerPage = defineModel('itemsPerPage', { default: 25 })
const sortBy = defineModel('sortBy', { default: () => [] })
const searches = defineModel('searches', { default: () => [] })
const disableDialog = ref(false)
const disableItem = ref(null)
const disableReason = ref('')
let disableCb = null

const props = withDefaults(
  defineProps<{
    items: unknown[],
    headers: Array<{ key: string; title: string; sortable?: boolean; removable?: boolean }>,
    // itemsPerPage?: number,
    // totalPages?: number,
    totalItems?: number,
    searchesConfig?: Array<{ name: string; label: string }>,
    // total?: number,
    // loading: boolean,
    // options: any,
    // onOptionsChange: (opts: any) => void,
    // onAction: (action: string, item: any) => void
    enabledActions?:string[],
    actionTitles?: Record<string, string>,
    emptyPlaceholder?: string,
    pageTitle?: string,
    hideTitle?: boolean,
    hideHeader?: boolean
  }>(),
  {
    totalItems: 0,
    itemsPerPage: 25,
    searchesConfig: () => [],
    enabledActions: () => [],
    actionTitles: () => ({
      edit: "dataTable.buttonEditTitle",
      delete: "dataTable.buttonDeleteTitle",
      clone: "dataTable.buttonCloneTitle",
      assignOverseer: "dataTable.buttonAssignOverseerTitle",
      disable: "dataTable.buttonDisableTitle",
      enable: "dataTable.buttonEnableTitle",
    }),
    emptyPlaceholder: '-',
    hideTitle: false,
    hideHeader: false
  }
)

const totalPages = computed(() => Math.ceil(props.totalItems / itemsPerPage.value))

const emit = defineEmits<{
  (e: 'update:options', value: unknown): void
  (e: 'action', payload: { action: string, item: unknown }): void
  (e: 'filter-change', value: unknown): void
  (e: 'action:edit', value: unknown): void
  (e: 'action:delete', value: unknown): void
  (e: 'action:assignOverseer', value: unknown): void
  (e: 'action:clone', value: unknown): void
  (e: 'action:disable', value: unknown): void
  (e: 'action:enable', value: unknown): void
}>()

const getColWidthPx = (key: string) => {
  if (key === 'id') return '72px'
  if (key === 'actions') return '120px'
  return undefined
}

const getCellStyle = (key: string) => {
  const w = getColWidthPx(key)
  if (!w) return undefined
  return {
    width: w,
    minWidth: w,
    maxWidth: w,
    overflow: 'hidden',
  }
}

// Search
let searchTimeout = null;
const searchModel = ref({})
const searchPayload = computed(() => {
  return (props.searchesConfig ?? [])
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

const handleUpdateOptions = () => {
  emit('update:options', buildOptions())
}

const buildOptions = () => {
  return {
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    searches: searches.value ?? [],
  }
}

// When search is driven from outside (hide-header + TableSearchBox), keep options in sync.
watch(
  searches,
  () => {
    if (!props.hideHeader) return
    emit('update:options', buildOptions())
  },
  { deep: true },
)

// Handle actions
const handleActionEdit = (item: unknown) => {
  emit('action:edit', item)
}

const handleActionDelete = async (item: unknown) => {
  if (!await dialogStore.confirm(t('areYouSureWantToDelete'))) return
  emit('action:delete', item)
}

const handleActionClone = (item: unknown) => {
  emit('action:clone', item)
}

const handleAssignOverseerAction = (item: unknown) => {
  emit('action:assignOverseer', item)
}

const handleDisableAction = async (item: unknown) => {
  disableDialog.value = true;
  disableItem.value = item;

  disableCb = (reason) => {
    emit('action:disable', item, reason)
  }

  // if (!await dialogStore.confirm(t('areYouSureWantToDisable'))) return
  // emit('action:disable', item)
}
const onSubmitDisableAction = async() => {
  if (typeof(disableCb) === 'function') {
    disableCb(disableReason.value)

    closeDisableDialog()
  }
}
const closeDisableDialog = () => {
  disableDialog.value = false;
  disableItem.value = null;
  disableReason.value = '';
}

const handleEnableAction = async (item: unknown) => {
  if (!await dialogStore.confirm(t('areYouSureWantToEnable'))) return
  emit('action:enable', item)
}

onMounted(() => {
  emit('update:options', buildOptions())
})
</script>

<template>
  <v-row v-if="!hideHeader" class="mb-2 mt-2">
    <!-- title -->
    <v-col
      v-if="!hideTitle"
      cols="12"
      md="4"
      class="d-flex align-center"
    >
      <div class="text-h4 font-weight-medium">
        {{ pageTitle }}
      </div>
    </v-col>

    <!-- actions -->
    <v-col cols="12" :md="hideTitle ? 12 : 8">
      <div class="d-flex flex-column flex-md-row align-stretch align-md-center justify-md-end ga-2">

        <!-- search wrapper -->
        <div class="search-box">
          <template v-for="(item, key) in searchesConfig" :key="key">
            <v-text-field
              v-model="searchModel[item.name]"
              :placeholder="$t(item.label)"
              single-line
              variant="outlined"
              class=""
              @update:model-value="handleSearch"
              hide-details
              clearable
            >
              <template #prepend-inner>
                <v-icon icon="$magnify" />
              </template>
            </v-text-field>
          </template>
        </div>
        
        <slot name="header-right" />
      </div>
    </v-col>

  </v-row>

  <v-data-table-server
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    v-model:sort-by="sortBy"
    :items-length="totalItems"
    :headers="headers"
    :items="items"
    @update:options="handleUpdateOptions"
    class="bordered-table rounded-0 dt-table"
    :no-data-text="$t('noData')"
  >
    <template #colgroup>
      <colgroup>
        <col
          v-for="h in headers"
          :key="h.key"
          :style="{
            width: getColWidthPx(String(h.key)),
            maxWidth: getColWidthPx(String(h.key)),
          }"
        />
      </colgroup>
    </template>

    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
      <tr class="bg-containerBg">
        <template v-for="column in columns" :key="column.key">
          <th
            class="text-start text-uppercase text-caption font-weight-bold dt-col"
            :class="`dt-col--${column.key}`"
            :style="getCellStyle(String(column.key))"
          >
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
            </div>
          </th>
        </template>
      </tr>
    </template>

    <template v-slot:item="{ item }">
      <tr>
        <template v-for="header in headers" :key="header.key">
          <td
            class="dt-col"
            :class="`dt-col--${header.key}`"
            :style="getCellStyle(String(header.key))"
          >
            <div v-if="header.key === 'actions'" class="d-flex ga-2 text-no-wrap">
              <v-tooltip :text="$t('dataTable.buttonEditTitle')">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="$edit" variant="plain" size="small" @click="handleActionEdit(item)" v-if="enabledActions.includes('edit')" />
                </template>
              </v-tooltip>
              
              <v-tooltip :text="$t('dataTable.buttonDeleteTitle')">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="$delete" variant="plain" size="small" @click="handleActionDelete(item)" v-if="enabledActions.includes('delete')" />
                </template>
              </v-tooltip>
              
              <v-tooltip :text="$t('dataTable.buttonCloneTitle')">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="$copy"  variant="plain" size="small" @click="handleActionClone(item)" v-if="enabledActions.includes('clone')" />
                </template>
              </v-tooltip>
              
              <v-tooltip :text="$t('dataTable.buttonAssignOverseerTitle')">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="$earthPlus" variant="plain" size="small" @click="handleAssignOverseerAction(item)" v-if="enabledActions.includes('assignOverseer')" />
                </template>
              </v-tooltip>
              
              <v-tooltip :text="$t('dataTable.buttonDisableTitle')">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="$blockHelper" variant="plain" size="small" @click="handleDisableAction(item)" v-if="enabledActions.includes('disable')" />
                </template>
              </v-tooltip>

              <v-tooltip :text="$t('dataTable.buttonEnableTitle')">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="$check"  variant="plain" size="default" @click="handleEnableAction(item)" v-if="enabledActions.includes('enable')" />
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
  </v-data-table-server>

  <v-dialog v-model="disableDialog" max-width="480">
    <v-card rounded="lg">
      <v-card-title class="text-h6">
        {{ $t('church.disableReason') }}
      </v-card-title>

      <v-card-text>
        <v-textarea
          v-model="disableReason"
          rows="3"
          auto-grow
          :rules="[v => !!v || $t('reasonIsRequired')]"
          required
        />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="closeDisableDialog">
          Cancel
        </v-btn>
        <v-btn
          color="error"
          :disabled="!disableReason.trim()"
          @click="onSubmitDisableAction"
        >
          Disable
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dt-col {
  min-width: 0; /* prevent columns from expanding too much */
}

/* keep ID small + readable */
.dt-col--id {
  width: 72px;
  max-width: 72px;
  white-space: nowrap;
}

/* keep actions compact even when few columns */
.dt-col--actions {
  width: 120px;
  max-width: 120px;
  white-space: nowrap;
}

/* Force width constraints to be respected */
.dt-table :deep(.v-table__wrapper > table) {
  table-layout: fixed;
  width: 100%;
}

/* Nice UX when name gets long */
.dt-col--name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Actions: never let content push the column wider */
.dt-col--actions > div {
  max-width: 100%;
  overflow: hidden;
}
</style>
