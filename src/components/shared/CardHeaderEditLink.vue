<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  to: RouteLocationRaw;
}>();
</script>

<template>
  <router-link
    :to="to"
    class="card-header-edit-link"
  >
    <v-icon
      icon="$edit"
      size="18"
    />
  </router-link>
</template>
