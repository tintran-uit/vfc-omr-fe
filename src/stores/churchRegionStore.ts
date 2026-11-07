import { churchRegionService } from '@/services/churchRegionService'
import { defineStore } from 'pinia'
import { flatten } from '@/utils/objectUtil'

function asTree(items: Array<{ id: number; parent_id?: number | null; left?: number; name: string }>) {
  const sorted = [...items].sort((a, b) => (a.left ?? 0) - (b.left ?? 0))
  const nodes = sorted.map((item) => ({ ...item, children: [] as Array<{ id: number; name: string; children: unknown[] }> }))
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const roots: typeof nodes = []

  for (const node of nodes) {
    const parent = node.parent_id != null ? byId.get(node.parent_id) : undefined
    if (parent) parent.children.push(node)
    else roots.push(node)
  }

  return roots
}

export const useChurchRegionStore = defineStore('churchRegion', {
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
        const items = await churchRegionService.getAll()
        this.options = flatten(asTree(items), (node, level) => ({
          id: node.id,
          name: "-".repeat(level) + " " + node.name,
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