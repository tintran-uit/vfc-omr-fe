import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
  state: () => ({
    loading: false,
    errorMessage: null,
    message: null,
    dialog: false,
    errorDialog: false,
    errorMessage: null,
    confirmOpen: false,
    confirmMessage: null,
  }),
  actions: {
    showMessage(message) {
      this.message = message;
      this.dialog = true;
    },
    showSuccessMessage(message) {
      this.showMessage(message);
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
