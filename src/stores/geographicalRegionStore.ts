import { geographicalRegionService } from '@/services/geographicalRegionService'
import { defineStore } from 'pinia'
import { flatten } from '@/utils/objectUtil';

export const useGeographicalRegionStore = defineStore('geographicalRegion', {
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
        const {items} = await geographicalRegionService.getAll()

        const options = flatten(items, (node, level) => ({
          id: node.id,
          name: "-".repeat(level) + " " + node.name
        }));
        
        this.options = options
      } catch(e) {
        console.log('error', e)
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