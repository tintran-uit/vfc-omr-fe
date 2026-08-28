<script setup lang="ts">
defineProps<{
  title: string;
  content: string;
}>();

const open = defineModel<boolean>({ default: false });
</script>

<template>
  <v-dialog
    v-model="open"
    max-width="400"
  >
    <v-card
      rounded="lg"
      elevation="4"
    >
      <div class="d-flex align-center justify-space-between ga-3 px-4 pt-4 pb-3">
        <span class="text-h6 font-weight-bold text-high-emphasis">
          {{ title }}
        </span>
        <v-btn
          icon
          variant="text"
          size="small"
          :aria-label="$t('close')"
          @click="open = false"
        >
          <v-icon
            icon="$close"
            size="20"
          />
        </v-btn>
      </div>
      <v-divider />
      <div class="px-4 py-3 text-body-1 text-high-emphasis">
        {{ content }}
      </div>
    </v-card>
  </v-dialog>
</template>
