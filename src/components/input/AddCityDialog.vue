<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { cityService } from "@/services/cityService";
import { useCountryStore } from "@/stores/countryStore";
import { useMessageStore } from "@/stores/messageStore";
import { extractApiError } from "@/utils/formErrors";

const props = withDefaults(
  defineProps<{
    countryId: number | string | null;
    initialName?: string;
  }>(),
  {
    initialName: "",
  },
);

const emit = defineEmits<{
  (e: "created", city: { id: number | string; name: string }): void;
}>();

const open = defineModel<boolean>({ default: false });

const { t } = useI18n();
const countryStore = useCountryStore();
const messageStore = useMessageStore();
const formRef = useTemplateRef("formRef");

const name = ref("");
const saving = ref(false);
const serverError = ref("");

const countryName = computed(() => {
  if (props.countryId == null || props.countryId === "") return "";
  const match = countryStore.asyncOptions.find(
    (item: { id: number | string; name: string }) =>
      String(item.id) === String(props.countryId),
  );
  return match?.name ?? "";
});

const nameRules = [
  (value: string) => !!String(value || "").trim() || t("validation.required", { field: t("city.labelName") }),
];

watch(open, async (isOpen) => {
  if (!isOpen) return;

  name.value = props.initialName?.trim() ?? "";
  serverError.value = "";
  await nextTick();
  formRef.value?.resetValidation();
});

async function handleSubmit() {
  if (props.countryId == null || props.countryId === "") return;

  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const trimmedName = name.value.trim();
  saving.value = true;
  serverError.value = "";

  try {
    await cityService.create({
      name: trimmedName,
      country_id: props.countryId,
    });

    const items = await cityService.getAllByCountry(props.countryId);
    const created = (items || []).find(
      (item: { id: number | string; name: string }) =>
        item.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    );

    if (!created) {
      serverError.value = t("city.createSelectManually");
      return;
    }

    emit("created", { id: created.id, name: created.name });
    messageStore.info(t("city.createSuccess"));
    open.value = false;
  } catch (error) {
    const { message, errors } = extractApiError(error);
    serverError.value = errors.name?.[0] || message || t("genericSaveError");
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <v-dialog
    v-model="open"
    max-width="440"
  >
    <v-card
      rounded="lg"
      elevation="4"
    >
      <div class="d-flex align-center justify-space-between ga-3 px-4 pt-4 pb-3">
        <span class="text-h6 font-weight-bold text-high-emphasis">
          {{ $t("city.addTitle") }}
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

      <v-form
        ref="formRef"
        class="px-4 py-4"
        @submit.prevent="handleSubmit"
      >
        <v-label class="mb-1 d-block">{{ $t("city.labelNation") }}</v-label>
        <v-text-field
          :model-value="countryName"
          variant="outlined"
          density="compact"
          readonly
          tabindex="-1"
          class="mb-4 input-field--readonly"
        />

        <v-label class="mb-1 d-block">{{ $t("city.labelName") }}</v-label>
        <v-text-field
          v-model="name"
          variant="outlined"
          density="compact"
          :rules="nameRules"
          autofocus
        />

        <div
          v-if="serverError"
          class="text-error text-body-2 mt-2"
        >
          {{ serverError }}
        </div>

        <div class="d-flex justify-end ga-2 mt-4">
          <v-btn
            type="button"
            variant="text"
            @click="open = false"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            :loading="saving"
          >
            {{ $t("save") }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
