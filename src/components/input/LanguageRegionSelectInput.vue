<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
import { languageRegionService } from '@/services/languageRegionService'

const modelValue = defineModel<any>();

const { t } = useI18n()
const items = ref<any[]>([])
const loading = ref(true)
const fetchList = async () => {
  loading.value = true
  try {
    items.value = await languageRegionService.getAll()
  } catch (error) {
    console.error('Failed to load language regions', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchList()
})
</script>

<template>
    <SelectInput
      :items="items"
      v-model="modelValue"
      v-bind="$attrs"
      item-value="id"
      item-title="name"
      :loading="loading"
      />
</template>

<style scoped lang="scss">

</style>