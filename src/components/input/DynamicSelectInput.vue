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

const translatedLabel = computed(() => label ? t(label) : '')
const translatedPlaceholder = computed(() => placeholder ? t(placeholder) : '')
const translatedNoDataText = computed(() => noDataText ? t(noDataText) : t('noData'))

const items = ref<any[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const pageSize = 25
const searchQuery = ref('')
const noMoreItems = ref(false)
let searchTimeout = null
let isSelecting = false

const _fetchItems = async function () {
  const items = await fetchItems({
    
  });


}

const onFocus = () => {return;
  if (items.value.length === 0) {
    _fetchItems()
  }
}

function onSearch(query) {
  if (isSelecting) return

  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    _fetchItems(true)
  }, 400) // debounce 400ms
}

function onUpdateModelValue(val) {
  isSelecting = true
  setTimeout(() => {
    isSelecting = false;
  }, 0);
}

function onIntersect({ entries }) {
  if (!entries?.length) return

  const entry = entries[0]
  if (entry.isIntersecting && !loadingMore.value && !noMoreItems.value) {
    _fetchItems()
  }
}

onMounted(() => {
  _fetchItems()
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
      :clearable="clearable"
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