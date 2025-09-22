import { cityService } from '@/services/cityService'
import { defineStore } from 'pinia'
const countryId = 231

export const useCityStore = defineStore('city', {
  state: () => ({
    options: [] as Array<{ title: string; value: string }>,
    loading: false,
    loaded: false,
  }),
  actions: {
    async fetchForOptions(force = false) {
      if (this.loaded && !force) return
      try {
        this.loading = true
        const items = await cityService.getAllByCountry(countryId)

        this.options = items.map(item => item.name)
      } catch(e) {
        console.log('e', e)
      } finally {
        this.loaded = true
        this.loading = false
      }
    },
  },
  getters: {
    asyncOptions(state) {
      if (!state.loaded && !state.loading) {
        this.fetchForOptions()
      }
      return state.options
    },
  }
})