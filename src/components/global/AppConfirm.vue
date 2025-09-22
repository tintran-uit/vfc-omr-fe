<script setup lang="ts">
import { ref, watch } from 'vue'
import {useDialogStore} from '@/stores/dialogStore';

const confirmStore = useDialogStore()

</script>

<template>
  <v-dialog v-model="confirmStore.confirmOpen" max-width="400">
    <v-card>
      <v-card-title>{{ confirmStore.confirmMessage }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="confirmStore.confirmCancel()">Cancel</v-btn>
        <v-btn color="primary" text @click="confirmStore.confirmOk()">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
