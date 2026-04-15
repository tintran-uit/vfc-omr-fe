<template>
  <RouterView></RouterView>

  <AppMessage />
  <AppConfirm />
  <AppLoading />
  <AppImagePreviewDialog />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppMessage from '@/components/global/AppMessage.vue';
import AppConfirm from './components/global/AppConfirm.vue';
import AppLoading from './components/global/AppLoading.vue';
import AppImagePreviewDialog from './components/global/AppImagePreviewDialog.vue';
</script>
