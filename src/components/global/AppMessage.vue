<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMessageStore } from '@/stores/messageStore';

const messageStore = useMessageStore();

</script>

<template>
  <v-dialog v-model="messageStore.dialog" max-width="400">
    <v-card color="error" dark>
      <v-card-title class="text-h6">
        
      </v-card-title>

      <v-card-text>
        {{ messageStore.message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="messageStore().dialog = false">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="messageStore.errorDialog" max-width="400" persistent>
    <v-card class="rounded-xl pa-4" elevation="10">
      <div class="d-flex align-center mb-4">
        <v-icon class="text-error me-2" size="28" icon="$alertOutline" />
        <span class="text-h6 font-weight-bold">{{ $t('message.errorTitle') }}</span>
      </div>

      <p class="text-body-1 text-error">
        {{ messageStore.errorMessage }}
      </p>

      <div class="d-flex justify-end mt-6">
        <v-btn color="error" variant="flat" rounded="lg" @click="messageStore.closeError">
          Close
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
