<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLoadingStore } from "@/stores/loadingStore";

const loadingStore = useLoadingStore();

</script>

<template>
  <v-overlay
    :model-value="loadingStore.isLoading"
    class="align-center justify-center"
    persistent
    opacity="0.8"
    scrim="rgba(255,255,255,0.8)"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    />
  </v-overlay>
</template>

<style scoped>

</style>
