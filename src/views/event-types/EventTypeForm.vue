<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import ColorField from "@/components/input/ColorField.vue";
import {
  EVENT_MEETING_TYPES,
  normalizeMeetingType,
  type EventTypePayload,
} from "@/services/eventTypesService";

const props = defineProps<{
  initial?: Partial<EventTypePayload> | null;
  pending?: boolean;
}>();

const emit = defineEmits<{
  submit: [payload: EventTypePayload];
}>();

const { t } = useI18n();

const meetingTypeItems = computed(() =>
  EVENT_MEETING_TYPES.map((item) => ({
    value: item.value,
    title: t(item.labelKey),
  })),
);

const form = reactive({
  name: "",
  color: "#19E7AD",
  cell_color: "#BE19E7",
  meeting_type: "",
});

const errors = reactive({
  name: "",
  color: "",
  cell_color: "",
  meeting_type: "",
});

watch(
  () => props.initial,
  (value) => {
    if (!value) return;
    form.name = String(value.name ?? "");
    form.color = String(value.color ?? "");
    form.cell_color = String(value.cell_color ?? "");
    form.meeting_type = normalizeMeetingType(value.meeting_type);
  },
  { immediate: true },
);

function required(field: keyof typeof errors, labelKey: string) {
  if (!String(form[field] ?? "").trim()) {
    errors[field] = t("validation.required", { field: t(labelKey) });
    return false;
  }
  errors[field] = "";
  return true;
}

function submit() {
  const ok = [
    required("name", "eventType.labelName"),
    required("color", "eventType.textColor"),
    required("cell_color", "eventType.cellColor"),
    required("meeting_type", "eventType.meetingType"),
  ].every(Boolean);
  if (!ok) return;

  emit("submit", {
    name: form.name.trim(),
    color: form.color.trim(),
    cell_color: form.cell_color.trim(),
    meeting_type: normalizeMeetingType(form.meeting_type),
  });
}
</script>

<template>
  <v-form @submit.prevent="submit">
    <div class="mb-4">
      <v-label class="mb-1">
        {{ $t("eventType.labelName") }}
        <span class="text-error">*</span>
      </v-label>
      <v-text-field
        v-model="form.name"
        variant="outlined"
        density="compact"
        hide-details="auto"
        :error-messages="errors.name"
        @update:model-value="errors.name = ''"
      />
    </div>

    <div class="mb-4">
      <v-label class="mb-1">
        {{ $t("eventType.textColor") }}
        <span class="text-error">*</span>
      </v-label>
      <ColorField
        v-model="form.color"
        :label="$t('eventType.textColor')"
        :error-messages="errors.color"
        @update:model-value="errors.color = ''"
      />
    </div>

    <div class="mb-4">
      <v-label class="mb-1">
        {{ $t("eventType.cellColor") }}
        <span class="text-error">*</span>
      </v-label>
      <ColorField
        v-model="form.cell_color"
        :label="$t('eventType.cellColor')"
        :error-messages="errors.cell_color"
        @update:model-value="errors.cell_color = ''"
      />
    </div>

    <div class="mb-4">
      <v-label class="mb-1">
        {{ $t("eventType.meetingType") }}
        <span class="text-error">*</span>
      </v-label>
      <v-select
        v-model="form.meeting_type"
        :items="meetingTypeItems"
        item-value="value"
        item-title="title"
        variant="outlined"
        density="compact"
        hide-details="auto"
        :error-messages="errors.meeting_type"
        @update:model-value="errors.meeting_type = ''"
      />
    </div>

    <div class="d-flex justify-end">
      <v-btn
        color="primary"
        type="submit"
        :loading="pending"
      >
        {{ $t("save") }}
      </v-btn>
    </div>
  </v-form>
</template>
