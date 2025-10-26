<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
import { useCityStore } from '@/stores/cityStore.ts'
import { cityService } from '@/services/cityService';
import { useAuthStore } from '@/stores/authStore';

const modelValue = defineModel<any>();
const loading = ref(false)
const { t } = useI18n()
const cityStore = useCityStore()
const authStore = useAuthStore()
const options = ref<any[]>([])

onMounted(async () => {
  try {
    loading.value = true
    const items = await cityService.getAllByCountry(authStore.countryId)
    options.value = items.map((c: any) => ({
      name: c.name,
      id: c.id,
    }))
  } catch(e) {
    console.log('e', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
    <SelectInput
      :items="options"
      v-model="modelValue"
      v-bind="$attrs"
      item-value="id"
      item-title="name"
      :loading="loading"
      />
</template>

<style scoped lang="scss">

</style>