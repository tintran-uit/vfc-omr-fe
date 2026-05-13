<script setup lang="ts">
import { computed, ref } from "vue";

defineOptions({ name: "SupportSendPage" });

import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import CardHeader from "@/components/shared/CardHeader.vue";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";
import { createSupportFormSchema } from "@/form-schemas/supportFormSchema";
import { supportService } from "@/services/supportService";
import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const messageStore = useMessageStore();
const isSubmitting = ref(false);

const displayNameForIntro = computed(() => authStore.fullName || "—");

/** Closure reads latest name when initData() runs in DynamicFormDefault */
const formSchema = createSupportFormSchema(() => authStore.fullName || "—");

const introText = computed(() =>
  t("support.intro", { name: displayNameForIntro.value }),
);

const handleSubmit = async (formData: Record<string, unknown>) => {
  try {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    await supportService.submit({
      name: String(formData.name ?? ""),
      subject: String(formData.subject ?? ""),
      message: String(formData.message ?? ""),
    });
    messageStore.info(t("support.submitSuccess"));
    await router.replace({ name: "Dashboard" });
  } catch (e) {
    console.error("support submit", e);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <CardHeader :title="$t('support.title')">
    <div class="pa-5">
      <p class="text-body-1 text-medium-emphasis support-intro mb-6">
        {{ introText }}
      </p>

      <DynamicFormDefault
        form-only
        hide-form-header
        :form-schema="formSchema"
        @submit="handleSubmit"
      >
        <template #actions="{ submit }">
          <v-row class="mt-4">
            <v-col
              cols="12"
              class="text-end"
            >
              <v-btn
                type="button"
                color="primary"
                variant="flat"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                class="px-6"
                @click="submit"
              >
                {{ $t("support.submit") }}
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </DynamicFormDefault>
    </div>
  </CardHeader>
</template>

<style scoped lang="scss">
.support-intro {
  white-space: pre-line;
}
</style>
