import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useLoadingStore = defineStore("loading", () => {
  const count = ref(0);

  const isLoading = computed(() => count.value > 0);

  function show() {
    count.value++;
  }

  function hide() {
    if (count.value > 0) {
      count.value--;
    }
  }

  return { isLoading, show, hide };
});