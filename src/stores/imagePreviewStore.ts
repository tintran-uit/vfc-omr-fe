import { defineStore } from 'pinia'

export const useImagePreviewStore = defineStore('imagePreview', {
  state: () => ({
    open: false,
    src: '',
  }),

  actions: {
    show(src: string) {
      this.src = src
      this.open = true
    },
    close() {
      this.open = false
      this.src = ''
    },
  },
})
