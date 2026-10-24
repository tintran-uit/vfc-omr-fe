<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useVerseStore } from "@/stores/verseStore";

const { t } = useI18n();
const verseStore = useVerseStore();
const pending = ref(false);
const loading = ref(true);

const form = reactive({
  verse_heading: "",
  verse_body: "",
});

const errors = reactive({
  verse_heading: "",
  verse_body: "",
});

onMounted(async () => {
  try {
    await verseStore.fetch(true);
    form.verse_heading = verseStore.heading;
    form.verse_body = verseStore.body;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

function required(field: keyof typeof errors, labelKey: string) {
  if (!String(form[field] ?? "").trim()) {
    errors[field] = t("validation.required", { field: t(labelKey) });
    return false;
  }
  errors[field] = "";
  return true;
}

async function submit() {
  const ok = [
    required("verse_heading", "bibleVerse.heading"),
    required("verse_body", "bibleVerse.body"),
  ].every(Boolean);
  if (!ok) return;

  pending.value = true;
  try {
    await verseStore.change({
      verse_heading: form.verse_heading.trim(),
      verse_body: form.verse_body.trim(),
    });
    form.verse_heading = verseStore.heading;
    form.verse_body = verseStore.body;
  } catch (error) {
    console.error(error);
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <FormPageShell
    title-key="bibleVerse.title"
    hide-back
  >
    <v-form @submit.prevent="submit">
      <div class="mb-4">
        <v-label class="mb-1">
          {{ $t("bibleVerse.heading") }}
          <span class="text-error">*</span>
        </v-label>
        <v-text-field
          v-model="form.verse_heading"
          variant="outlined"
          density="compact"
          hide-details="auto"
          :disabled="loading"
          :error-messages="errors.verse_heading"
          @update:model-value="errors.verse_heading = ''"
        />
      </div>

      <div class="mb-4">
        <v-label class="mb-1">
          {{ $t("bibleVerse.body") }}
          <span class="text-error">*</span>
        </v-label>
        <v-textarea
          v-model="form.verse_body"
          variant="outlined"
          density="compact"
          hide-details="auto"
          rows="8"
          auto-grow
          :disabled="loading"
          :error-messages="errors.verse_body"
          @update:model-value="errors.verse_body = ''"
        />
      </div>

      <div class="d-flex justify-end">
        <v-btn
          color="primary"
          type="submit"
          :loading="pending"
          :disabled="loading"
        >
          {{ $t("save") }}
        </v-btn>
      </div>
    </v-form>
  </FormPageShell>
</template>
