<script setup lang="ts">
import {watch} from 'vue';

import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

const modelValue = defineModel();

</script>

<template>
  <v-textarea
    v-model="modelValue"
    :placeholder="translatedPlaceholder"
    :label="translatedLabel"
    :rules="rules"
    color="primary"
    variant="outlined"
    hide-details
    density="compact"
  ></v-textarea>
</template>

<style scoped>

</style>
