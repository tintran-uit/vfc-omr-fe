<script setup lang="ts">
import {useDialogStore} from '@/stores/dialogStore';

const confirmStore = useDialogStore()
</script>

<template>
  <v-dialog v-model="confirmStore.confirmOpen" max-width="480">
    <v-card>
      <v-card-text class="text-body-1 pt-6 app-confirm-message">
        {{ confirmStore.confirmMessage }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="confirmStore.confirmCancel()">Cancel</v-btn>
        <v-btn color="primary" text @click="confirmStore.confirmOk()">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.app-confirm-message {
  white-space: normal;
  word-break: break-word;
}
</style>
