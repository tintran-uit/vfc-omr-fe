<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";
import { createFormSchema } from "@/form-schemas/changeEmailFormSchema";
import { userService } from "@/services/userService";
import { useMessageStore } from "@/stores/messageStore";
import { extractApiError } from "@/utils/formErrors";

const props = defineProps<{
  currentEmail?: string | null;
}>();

const emit = defineEmits<{
  (e: "saved", email: string): void;
}>();

const { t } = useI18n();
const messageStore = useMessageStore();
const dialog = ref(false);
const formRef = ref();
const formSchema = createFormSchema();

const initData = computed(() => ({
  old_email: props.currentEmail || "",
}));

async function handleSubmit(formData: Record<string, string>) {
  try {
    await userService.changeEmail({
      old_email: formData.old_email,
      new_email: formData.new_email,
      password: formData.password,
    });
    dialog.value = false;
    messageStore.info(t("user.emailChanged"));
    emit("saved", formData.new_email);
  } catch (e) {
    const { errors, message } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(message || t("genericSaveError"));
    }
  }
}

function handleCancel() {
  dialog.value = false;
}
</script>

<template>
  <v-btn
    color="primary"
    variant="tonal"
    class="text-none"
    @click="dialog = true"
  >
    <v-icon start>$email</v-icon>
    {{ $t("user.changeEmail") }}
  </v-btn>

  <v-dialog
    v-model="dialog"
    max-width="480"
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h3">
          {{ $t("user.changeEmail") }}
        </span>
        <v-btn
          icon
          variant="text"
          @click="dialog = false"
        >
          <v-icon>$close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ $t("user.changeEmailDescription") }}
        </p>
        <DynamicFormDefault
          v-if="dialog"
          ref="formRef"
          hide-form-header
          form-only
          show-cancel
          :form-schema="formSchema"
          :init-data="initData"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
