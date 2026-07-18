<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useLanguageStore } from "@/stores/languageStore";
import SelectInput from "./SelectInput.vue";

const modelValue = defineModel<any>();

defineProps<{
  labelOnField?: boolean
}>()

const languageStore = useLanguageStore();
</script>

<template>
  <div class="language-select-input">
    <SelectInput
      class="language-select-input__inner"
      :items="languageStore.asyncOptions"
      v-model="modelValue"
      :label-on-field="labelOnField"
      v-bind="$attrs"
      item-value="id"
      item-title="name"
      :loading="languageStore.loading"
    />
  </div>
</template>

<style scoped lang="scss">
.language-select-input {
  width: 100%;
  min-width: 0;
}

.language-select-input :deep(.v-autocomplete) {
  width: 100%;
}

.language-select-input :deep(.v-field) {
  width: 100%;
}

.language-select-input :deep(.v-field__input) {
  min-width: 0;
}

.language-select-input :deep(.v-select__selection),
.language-select-input :deep(.v-select__selection-text) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>