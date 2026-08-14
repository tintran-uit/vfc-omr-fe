<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDialogStore } from '@/stores/dialogStore'
import EllipsisTooltip from '@/components/ui/EllipsisTooltip.vue'

const {t} = useI18n()
const page = defineModel('page', { default: 1 })
const itemsPerPage = defineModel('itemsPerPage', { default: 25 })
const sortBy = defineModel('sortBy', { default: () => [] })
const searches = defineModel<Array<{ key: string; value: unknown }>>('searches', { default: () => [] })
const dialogStore = useDialogStore()

const props = withDefaults(
  defineProps<{
    items: unknown[],
    headers: Array<{ key: string; title: string; sortable?: boolean; removable?: boolean }>,
    enabledActions?:string[],
    actionTitles?: Record<string, string>,
    emptyPlaceholder?: string,
    hideFooter?: boolean,
    /** When set, replaces default translated `noData` for empty table body. */
    noDataMessage?: string | null,
  }>(),
  {
    itemsPerPage: 25,
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
    hideFooter: false,
    noDataMessage: null,
  }
)

const getItemValueAsString = (item: unknown, key: string) => {
  const v = (item as Record<string, unknown>)?.[key]
  if (v == null) return ''
  if (Array.isArray(v)) return v.map(x => String(x ?? '')).join(' ')
  return String(v)
}

const filteredItems = computed(() => {
  const active = (searches.value ?? []).filter(s => {
    const v = s?.value
    return v !== '' && v !== null && v !== undefined
  })
  if (active.length === 0) return props.items

  return props.items.filter(it => {
    return active.every(s => {
      const hay = getItemValueAsString(it, String(s.key)).toLowerCase()
      const needle = String(s.value).toLowerCase()
      return hay.includes(needle)
    })
  })
})

const totalItems = computed(() => filteredItems.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))

watch([filteredItems, itemsPerPage], () => {
  if (page.value > totalPages.value) page.value = totalPages.value
  if (page.value < 1) page.value = 1
})

const emit = defineEmits<{
  (e: 'filter-change', value: unknown): void
  (e: 'action:edit', value: unknown): void
  (e: 'action:delete', value: unknown): void
  (e: 'action:assignOverseer', value: unknown): void
  (e: 'action:clone', value: unknown): void
  (e: 'action:disable', value: unknown): void
  (e: 'action:enable', value: unknown): void
}>()

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
  emit('action:disable', item)
}

const handleEnableAction = async (item: unknown) => {
  emit('action:enable', item)
}

const noDataTextResolved = computed(() => {
  if (props.noDataMessage != null && String(props.noDataMessage).trim() !== "") {
    return props.noDataMessage;
  }
  return t("noData");
});

const formatCellText = (value: unknown) => {
  if (value == null || value === '') return ''
  if (Array.isArray(value)) return value.map(x => String(x ?? '')).join(' ')
  return String(value)
}

const isPlainCell = (key: string) => !['actions', 'attributes', 'avatar'].includes(key)

const shouldAlwaysTooltip = (key: string) => ['name', 'full_name', 'question_header'].includes(key)
</script>

<template>
    <v-data-table
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="filteredItems"
      class="bordered-table rounded-0 dt-table"
      :no-data-text="noDataTextResolved"
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
                {{ column.title ? $t(column.title) : '' }}
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
                  {{ column.title ? $t(column.title) : '' }}
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
            <td>
              <template v-if="header.key === 'actions'">
                <slot name="item.actions" :item="item">
                  <div class="d-flex ga-2 text-no-wrap">
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
                    <v-btn v-bind="props" icon="$blockHelper" size="x-small" @click="handleDisableAction(item)" v-if="enabledActions.includes('disable')" />
                  </template>
               </v-tooltip>

                <v-tooltip :text="$t('dataTable.buttonEnableTitle')">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon="$check" size="x-small" @click="handleEnableAction(item)" v-if="enabledActions.includes('enable')" />
                  </template>
                </v-tooltip>
                  </div>
                </slot>
              </template>
              <template v-else-if="header.key === 'disabled'">
                {{ item.disabled ? $t('yes') : $t('no') }}
              </template>
              <slot
                v-else-if="!isPlainCell(header.key)"
                :name="`item.${header.key}`"
                :item="item"
                :value="item[header.key]"
              />
              <EllipsisTooltip
                v-else
                :text="formatCellText(item[header.key])"
                :always="shouldAlwaysTooltip(header.key)"
              >
                <slot :name="`item.${header.key}`" :item="item" :value="item[header.key]">
                  {{ item[header.key] || emptyPlaceholder }}
                </slot>
              </EllipsisTooltip>
            </td>
        </template>
        </tr>
      </template>

      <template v-if="!hideFooter" #bottom>
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
    </v-data-table>
</template>

<style scoped>

</style>
