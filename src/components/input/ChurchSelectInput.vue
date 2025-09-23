<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n'
import { churchService } from '@/services/churchService'
const { t } = useI18n()

import { computed } from 'vue'

const modelValue = defineModel<any>()

const props = withDefaults(defineProps<{
  label?: string
  placeholder?: string
  itemTitle?: string | ((item: any) => string)
  itemValue?: string
  returnObject?: boolean
  noDataText?: string,
  clearable?: boolean
}>(), {
  clearable: true
})

const translatedLabel = computed(() => props.label ? t(props.label) : '')
const translatedPlaceholder = computed(() => props.placeholder ? t(props.placeholder) : '')
const translatedNoDataText = computed(() => props.noDataText ? t(props.noDataText) : t('common.no_data'))

const items = ref<any[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const itemsPerPage = 25
const searchQuery = ref('')
const noMoreItems = ref(false)
let searchTimeout = null
let isSelecting = false


const fetchItems = async (reset = false) => {
  if (reset) {
    page.value = 1
    items.value = []
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
    
    if (searchQuery.value) {
        params.name = searchQuery.value;
    }
    
    const data = await churchService.getList(params);

      if (data.has_next) {
        noMoreItems.value = false
      } else {
        noMoreItems.value = true
      }

      items.value = [
        ...items.value,
        ...(data.items || []).map(item => {
          return {
            id: item.id,
            name: item.name,
          }
        })
      ]
    page.value++
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const fetchItem = async (id) => {
  try {
    const data = await churchService.get(id)
    if (data) {
      const item = { id: data.id, name: data.name }
      console.log('fetchitem data', data, item)
      if (!items.value.find(i => i.id === item.id)) {
        items.value.push(item)
      }
    }
  } catch (err) {
    console.error('Error fetching item by id:', err)
  }
}

const onFocus = () => {
  if (items.value.length === 0) {
    fetchItems()
  }
}

function onSearch(query) {
  if (isSelecting) return

  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    fetchItems(true)
  }, 400)
}

function onUpdateModelValue(val) {
  isSelecting = true
  setTimeout(() => {
    isSelecting = false;
  }, 0);
}

function onIntersect(
  isIntersecting: boolean,
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) {
  if (!isIntersecting) return
  if (loadingMore.value || noMoreItems.value) return
  
  fetchItems()
}

onMounted(() => {
  fetchItems()

  if (modelValue.value) {
    fetchItem(modelValue.value)
  }
})
</script>

<template>
    <v-label class="text-wrap">{{label}}</v-label>
    <v-autocomplete
      v-model="modelValue"
      v-model:search="searchQuery"
      :items="items"
      role="link"
      color="primary"
      variant="outlined"
      hide-details
      density="compact"
      item-title="name"
      item-value="id"
      :loading="loading"
      :hide-no-data="loading"
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