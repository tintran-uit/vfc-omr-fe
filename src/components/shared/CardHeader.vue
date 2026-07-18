<script setup lang="ts">
const props = defineProps({
  title: String
});
</script>

<template>
  <!-- -------------------------------------------------------------------- -->
  <!-- Card with Header & Footer -->
  <!-- -------------------------------------------------------------------- -->
  <v-card variant="outlined" elevation="0" class="bg-surface">
    <v-card-item class="bg-grey-lighten-4">
      <div class="d-flex justify-space-between align-center">
        <v-card-title class="text-h5 text-high-emphasis">{{ props.title }}</v-card-title>
        <div
          v-if="$slots.header"
          class="d-flex align-center flex-shrink-0 ms-2"
        >
          <slot name="header" />
        </div>
      </div>
    </v-card-item>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <slot />
    </v-card-text>
  </v-card>
</template>
