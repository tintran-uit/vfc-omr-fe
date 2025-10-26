import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
  state: () => ({
    loading: false,
    errorMessage: null,
    errorDialog: false,
    infoMessage: null,
    infoDialog: false,
    confirmOpen: false,
    confirmMessage: null,
  }),
  actions: {
    info(message) {
      this.infoMessage = message;
      this.infoDialog = true;
    },
    error(message) {
      this.errorMessage = message;
      this.errorDialog = true;
    },
    closeError() {
      this.errorDialog = false;
      this.errorMessage = null;
    },
    confirm(message) {
      return new Promise((resolve) => {
        this.confirmOpen = true;
        this.confirmMessage = message;

        this.confirmResolve = resolve;
      });
    },
    confirmOk() {
      this?.confirmResolve(true);
    },
    confirmCancel() {
      this?.confirmResolve(false);
    }
  }
});
