<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { createFormSchema } from "@/form-schemas/addFaqFormSchema";
import { faqService } from "@/services/faqService";
import { tagsRawToPayload } from "@/utils/faqPayload";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useMessageStore } from "@/stores/messageStore";
import { extractApiError } from "@/utils/formErrors";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const languageStore = useLanguageStore();
const messageStore = useMessageStore();

const id = computed(() => String(route.params.id ?? ""));
const formSchema = createFormSchema();
const editData = ref<Record<string, unknown> | null>(null);
const loadError = ref(false);
const formRef = ref();

const tagsToRaw = (tags: { tag_name?: string }[] | undefined) =>
  (tags ?? []).map((x) => x.tag_name).filter(Boolean).join(", ");

const fetchEditData = async () => {
  loadError.value = false;
  editData.value = null;
  if (!id.value) return;
  try {
    const data = await faqService.getById(id.value);
    editData.value = {
      question_header: data.question_header ?? "",
      answer: data.answer ?? "",
      language_id: data.language_id != null ? Number(data.language_id) : null,
      tags_raw: tagsToRaw(data.tags),
    };
  } catch {
    loadError.value = true;
  }
};

watch(id, fetchEditData, { immediate: true });

onMounted(() => {
  void languageStore.fetchForOptions();
});

const handleSubmit = async (formData: Record<string, unknown>) => {
  try {
    await faqService.update(id.value, {
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
    :title="t('faq.editTitle', { id: id })"
    :back-url="{ name: 'FaqList' }"
  >
    <v-alert
      v-if="loadError"
      type="warning"
      variant="tonal"
      class="mb-4"
    >
      {{ t("faq.loadError") }}
    </v-alert>

    <DynamicFormDefault
      v-if="editData"
      ref="formRef"
      :form-schema="formSchema"
      :init-data="editData"
      form-only
      hide-form-header
      @submit="handleSubmit"
    />
  </FormPageShell>
</template>
