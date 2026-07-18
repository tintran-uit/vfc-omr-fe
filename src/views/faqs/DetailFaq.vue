<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/authStore";
import { faqService, type Faq } from "@/services/faqService";
import FormPageShell from "@/components/shared/FormPageShell.vue";

const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();

const faq = ref<Faq | null>(null);
const loadError = ref(false);

const id = computed(() => String(route.params.id ?? ""));

async function load() {
  loadError.value = false;
  faq.value = null;
  try {
    faq.value = await faqService.getById(id.value);
  } catch {
    loadError.value = true;
  }
}

watch(id, load, { immediate: true });
</script>

<template>
  <FormPageShell
    :title="faq?.question_header || t('faq.detailTitle')"
    :back-url="{ name: 'FaqList' }"
  >
    <v-alert
      v-if="loadError"
      type="warning"
      variant="tonal"
      class="mb-4 print-hide"
    >
      {{ t("faq.loadError") }}
    </v-alert>

    <div v-else-if="faq">
      <div class="d-flex flex-wrap justify-end ga-2 mb-4 print-hide">
        <v-btn
          v-if="authStore.can('faq.update')"
          color="primary"
          variant="elevated"
          :to="{ name: 'FaqEdit', params: { id: id } }"
        >
          {{ t("dataTable.buttonEditTitle") }}
        </v-btn>
      </div>

      <div id="faq-print-area" class="faq-print pa-2">
        <h1 class="text-h5 font-weight-bold mb-3">
          {{ faq.question_header }}
        </h1>
        <div
          class="text-body-1 faq-print__answer mb-4"
          v-html="faq.answer"
        />
        <div v-if="faq.tags?.length" class="d-flex flex-wrap ga-2 align-center">
          <span class="text-caption text-medium-emphasis me-1">{{ t("faq.tags") }}:</span>
          <v-chip
            v-for="tag in faq.tags"
            :key="tag.id ?? tag.tag_name"
            size="small"
            variant="tonal"
          >
            {{ tag.tag_name }}
          </v-chip>
        </div>
      </div>

      <div class="d-flex justify-end mt-6 print-hide">
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="$printer"
          v-print="'#faq-print-area'"
        >
          {{ t("faq.print") }}
        </v-btn>
      </div>
    </div>
  </FormPageShell>
</template>

<style scoped lang="scss">
.faq-print__answer {
  :deep(p) {
    margin-bottom: 0.75em;
  }
  :deep(p:last-child) {
    margin-bottom: 0;
  }
  :deep(ul),
  :deep(ol) {
    margin: 0.5em 0 0.75em;
    padding-left: 1.25em;
  }
  :deep(a) {
    color: rgb(var(--v-theme-primary));
  }
}
</style>
