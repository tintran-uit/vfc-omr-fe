<script setup lang="ts">
import { ref } from "vue";
import FormPageShell from "@/components/shared/FormPageShell.vue";

defineProps<{
  titleKey: string;
  description?: string;
  errorMessage?: string;
  submitting?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{ (e: "submit"): void }>();

const formRef = ref();

const onSubmit = async () => {
  const { valid } = (await formRef.value?.validate()) ?? { valid: true };
  if (!valid) return;

  emit("submit");
};
</script>

<template>
  <FormPageShell :title-key="titleKey">
    <p
      v-if="description"
      class="text-body-2 text-medium-emphasis mb-4"
    >
      {{ description }}
    </p>

    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ errorMessage }}
    </v-alert>

    <v-form
      ref="formRef"
      @submit.prevent="onSubmit"
    >
      <v-row>
        <slot />
      </v-row>

      <div class="d-flex justify-end mt-6">
        <v-btn
          color="primary"
          type="submit"
          :loading="submitting"
          :disabled="loading"
        >
          <v-icon
            icon="$download"
            start
          />
          {{ $t("generateReport.generateButton") }}
        </v-btn>
      </div>
    </v-form>
  </FormPageShell>
</template>
