import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialogStore', {
  state: () => ({
    confirmOpen: false,
    confirmMessage: null,
    confirmResolve: null,
  }),
  actions: {
    confirm(message) {
      return new Promise((resolve) => {
        this.confirmOpen = true;
        this.confirmMessage = message;
        this.confirmResolve = resolve;
      });
    },
    confirmOk() {
      if (this.confirmResolve) {
        this.confirmResolve(true);
        this.reset();
      }
    },
    confirmCancel() {
      if (this.confirmResolve) {
        this.confirmResolve(false);
        this.reset();
      }
    },
    reset() {
      this.confirmOpen = false;
      this.confirmMessage = null;
      this.confirmResolve = null;
    },
  },
});
