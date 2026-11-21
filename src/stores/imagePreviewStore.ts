import { defineStore } from 'pinia'

export const useImagePreviewStore = defineStore('imagePreview', {
  state: () => ({
    open: false,
    src: '',
    onEdit: null as null | (() => void),
  }),

  actions: {
    show(src: string, onEdit?: (() => void) | null) {
      this.src = src
      this.onEdit = onEdit ?? null
      this.open = true
    },
    close() {
      this.open = false
      this.src = ''
      this.onEdit = null
    },
  },
})
