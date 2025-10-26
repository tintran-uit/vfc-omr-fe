import { churchNetworkService } from '@/services/churchNetworkService'
import { defineStore } from 'pinia'

export const useChurchNetworkStore = defineStore('churchNetwork', {
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
        const items = await churchNetworkService.getAll()
        this.options = items.map((c: any) => ({
          name: c.name,
          id: c.id,
        }))
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