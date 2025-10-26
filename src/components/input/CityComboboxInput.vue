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

    this.options = items.map(item => item.name)
  } catch(e) {
    console.log('e', e)
  } finally {
    this.loaded = true
    this.loading = false
  }


  if (authStore.countryId) {
    const items = await cityStore.fetchByCountry(authStore.countryId)

  } else {
    await cityStore.fetchAll()
  }
})
</script>

<template>
    <v-combobox
      :items="options"
      color="primary"
      variant="outlined"
      hide-details
      density="compact"
      v-model="modelValue"
      :loading="loading"
      :clearable="true"
      :menu-props="{ offsetY: true, minWidth: 'auto' }"
    ></v-combobox>
</template>

<style scoped lang="scss">

</style>