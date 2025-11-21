<script setup lang="ts">
import {ref, watch, computed, onMounted} from 'vue'
import { useI18n } from 'vue-i18n'

const {t} = useI18n()
const page = defineModel('page', { default: 1 })
const itemsPerPage = defineModel('itemsPerPage', { default: 25 })
const sortBy = defineModel('sortBy', { default: () => [] })

const props = withDefaults(
  defineProps<{
    items: any[],
    headers: any[],
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

const emit = defineEmits<{
  (e: 'filter-change', value: any): void
  (e: 'action:edit', value: any): void
  (e: 'action:delete', value: any): void
  (e: 'action:assignOverseer', value: any): void
  (e: 'action:clone', value: any): void
  (e: 'action:disable', value: any): void
  (e: 'action:enable', value: any): void
}>()

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
  emit('action:disable', item)
}

const handleEnableAction = async (item) => {
  emit('action:enable', item)
}
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

    <v-data-table
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="items"
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
    </v-data-table>
</template>

<style scoped>

</style>
