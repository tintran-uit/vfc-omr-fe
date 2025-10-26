import { churchTypeService } from '@/services/churchTypeService'
import { defineStore } from 'pinia'

export const useChurchTypeStore = defineStore('churchType', {
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
        const items = await churchTypeService.getAll()
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
      // khi lần đầu tiên gọi getter, nếu chưa load thì fetch
      if (!state.loaded && !state.loading) {
        this.fetchForOptions()
      }
      return state.options
    },
  }
})