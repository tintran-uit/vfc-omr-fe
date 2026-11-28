<script setup lang="ts">
defineProps<{
  goal: number;
}>();
</script>

<template>
  <v-tooltip :text="$t('goalValue', { value: `${goal}%` })">
    <template #activator="{ props: tipProps }">
      <v-chip
        v-bind="tipProps"
        size="small"
        variant="tonal"
        class="metric-goal-mark"
      >
        {{ goal }}%
      </v-chip>
    </template>
  </v-tooltip>
</template>

<style scoped>
.metric-goal-mark {
  flex-shrink: 0;
}
</style>
