<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n'
import { userService } from '@/services/userService'
const { t } = useI18n()

import { computed } from 'vue'

type PastorId = string | number
type PastorOption = {
  id: PastorId
  name: string
}

const modelValue = defineModel<PastorId | null>()

const props = withDefaults(defineProps<{
  label?: string
  placeholder?: string
  itemTitle?: string | ((item: PastorOption) => string)
  itemValue?: string
  returnObject?: boolean
  noDataText?: string,
  clearable?: boolean
  rules?: (string | ((v: any) => boolean | string))[]
}>(), {
  clearable: true,
  rules: () => []
})

const translatedLabel = computed(() => props.label ? t(props.label) : '')
const translatedPlaceholder = computed(() => props.placeholder ? t(props.placeholder) : '')
const translatedNoDataText = computed(() => props.noDataText ? t(props.noDataText) : t('noData'))

const items = ref<PastorOption[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const itemsPerPage = 25
const searchQuery = ref('')
const activeSearchQuery = ref('')
const noMoreItems = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | null = null
let isSelecting = false
let selectedItem: PastorOption | null = null
let ignoreSelectedNameSearch = false

const getItemKey = (item: PastorOption) => String(item.id)

const mergeItems = (newItems: PastorOption[]) => {
  const merged = new Map(items.value.map(item => [getItemKey(item), item]))

  newItems.forEach(item => {
    merged.set(getItemKey(item), item)
  })

  items.value = Array.from(merged.values())
}


const fetchItems = async (reset = false) => {
  if (reset) {
    page.value = 1
    items.value = selectedItem ? [selectedItem] : []
    noMoreItems.value = false
  }
  
  if (noMoreItems.value) return

  // First time (page == 1) => toogle loading
  // nth time (page > 1) => toogle loadingMore
  loading.value = page.value === 1
  loadingMore.value = page.value > 1

  try {
    const params: { limit: number; page: number; name?: string } = {
      limit: itemsPerPage,
      page: page.value
    }
    
    if (activeSearchQuery.value) {
        params.name = activeSearchQuery.value;
    }
    
    const data = await userService.getPastorList(params, false);

      if (data.has_next) {
        noMoreItems.value = false
      } else {
        noMoreItems.value = true
      }

      const newItems = (data.items || []).map(item => {
        return {
          id: item.id,
          name: item.name,
        }
      })

      mergeItems(newItems)
    page.value++
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const fetchItem = async (id: PastorId) => {
  try {
    const data = await userService.get(id, false)
    if (data) {
      selectedItem = { id: data.id, name: data.name }
      
      mergeItems([selectedItem])
    }
  } catch (err) {
    console.error('Error fetching item by id:', err)
  }
}

const onFocus = () => {
  const isShowingSelectedName =
    selectedItem && searchQuery.value.trim() === selectedItem.name

  if (isShowingSelectedName) {
    activeSearchQuery.value = ''
    ignoreSelectedNameSearch = true
  }

  if (items.value.length === 0 || isShowingSelectedName) {
    fetchItems(Boolean(isShowingSelectedName))
  }
}

function onSearch(query: string) {
  if (isSelecting) return

  const normalizedQuery = (query || '').trim()

  if (searchTimeout) clearTimeout(searchTimeout)

  if (
    ignoreSelectedNameSearch &&
    selectedItem &&
    normalizedQuery === selectedItem.name
  ) {
    activeSearchQuery.value = ''
    ignoreSelectedNameSearch = false
    return
  }

  ignoreSelectedNameSearch = false
  activeSearchQuery.value = normalizedQuery

  searchTimeout = setTimeout(() => {
    fetchItems(true)
  }, 400)
}

function onUpdateModelValue(val: PastorId | null) {
  isSelecting = true
  selectedItem = items.value.find(item => String(item.id) === String(val)) || null
  activeSearchQuery.value = ''
  ignoreSelectedNameSearch = true

  setTimeout(() => {
    isSelecting = false;
  }, 0);
}

function onIntersect(isIntersecting: boolean) {
  if (!isIntersecting) return
  if (loadingMore.value || noMoreItems.value) return
  
  fetchItems()
}

onMounted(() => {
  fetchItems()
})

watch(
  () => modelValue.value,
  (id) => {
    if (id) {
      fetchItem(id)
    } else {
      selectedItem = null
      activeSearchQuery.value = ''
      ignoreSelectedNameSearch = false
    }
  },
  { immediate: true }
)
</script>

<template>
    <v-label class="text-wrap">{{ translatedLabel }}</v-label>
    <v-autocomplete
      v-model="modelValue"
      v-model:search="searchQuery"
      :items="items"
      role="link"
      color="primary"
      variant="outlined"
      density="compact"
      item-title="name"
      item-value="id"
      :placeholder="translatedPlaceholder"
      :loading="loading"
      :hide-no-data="loading"
      :no-data-text="translatedNoDataText"
      :clearable="clearable"
      :rules="rules"
      no-filter
      @focus="onFocus"
      @update:search="onSearch"
      @update:modelValue="onUpdateModelValue"
    >
      <!-- Slot hiển thị ở cuối danh sách -->
    <template #append-item>
      <div v-intersect="onIntersect" class="text-center py-2">
        <v-progress-circular
          v-if="loadingMore"
          indeterminate
          color="primary"
        />
        <!-- <div v-else-if="!noMoreItems">Scroll to load more</div>
        <div v-else>No more items</div> -->
      </div>
    </template>
    </v-autocomplete>
</template>

<style scoped lang="scss">

</style>