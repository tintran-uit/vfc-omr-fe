<script setup lang="ts">
import { useImagePreviewStore } from "@/stores/imagePreviewStore";

const store = useImagePreviewStore();
</script>

<template>
  <v-dialog
    v-model="store.open"
    class="app-image-preview-dialog"
    max-width="95vw"
    scrim="rgba(0, 0, 0, 0.88)"
    @click:outside="store.close()"
  >
    <div class="app-image-preview-dialog__frame">
      <v-btn
        class="app-image-preview-dialog__close"
        icon="$close"
        variant="flat"
        color="white"
        size="small"
        :aria-label="$t('close')"
        @click="store.close()"
      />

      <img
        v-if="store.src"
        :src="store.src"
        alt=""
        class="app-image-preview-dialog__image"
      >
    </div>
  </v-dialog>
</template>
