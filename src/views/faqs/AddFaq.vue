<script setup lang="ts">
import { createFormSchema } from "@/form-schemas/addFaqFormSchema";
import { faqService } from "@/services/faqService";
import { tagsRawToPayload } from "@/utils/faqPayload";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMessageStore } from "@/stores/messageStore";
import { extractApiError } from "@/utils/formErrors";
import { onMounted, ref } from "vue";

const router = useRouter();
const { t } = useI18n();
const messageStore = useMessageStore();
const languageStore = useLanguageStore();
const formSchema = createFormSchema();
const formRef = ref();

onMounted(() => {
  void languageStore.fetchForOptions();
});

const handleSubmit = async (formData: Record<string, unknown>) => {
  try {
    await faqService.create({
      question_header: String(formData.question_header ?? "").trim(),
      answer: String(formData.answer ?? "").trim(),
      language_id: Number(formData.language_id),
      tags: tagsRawToPayload(String(formData.tags_raw ?? "")),
    });
    await router.push({ name: "FaqList" });
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t("genericSaveError"));
    }
  }
};
</script>

<template>
  <FormPageShell
    title-key="faq.addTitle"
    :back-url="{ name: 'FaqList' }"
  >
    <DynamicFormDefault
      ref="formRef"
      :form-schema="formSchema"
      form-only
      hide-form-header
      @submit="handleSubmit"
    />
  </FormPageShell>
</template>
