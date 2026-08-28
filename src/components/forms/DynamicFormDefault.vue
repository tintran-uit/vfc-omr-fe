<script setup lang="ts">
import { useTemplateRef, onMounted, computed, ref, watch, watchEffect, nextTick } from "vue";
import { getNestedValue, setNestedValue, initFormData, resolveFieldDefault } from "@/utils/objectUtil.ts";
import { createFormRules } from "@/helpers/formRulesFactory";
import { useI18n } from "vue-i18n";
import { getColProps } from "@/helpers/formHelper";
import { unwrapErrorMap, normalizeFieldErrors, flattenErrorKeys, mapErrorsToFieldNames } from "@/utils/formErrors";
import PioneeringStartDateInput from "@/components/input/PioneeringStartDateInput.vue";
import InfoHelpDialog from "@/components/shared/InfoHelpDialog.vue";

const { t } = useI18n();

const formRef = useTemplateRef("formRef");
const { resolveRules } = createFormRules(t);
const props = withDefaults(
  defineProps<{
    pageTitle?: string;
    formSchema: Record<string, any>;
    meta: Record<string, any>;
    initData?: Record<string, any> | null;
    options?: Record<string, any>;
    mapper?: (source: any, destination: any) => any;
    breakLine: Boolean;
    showCancel?: boolean;
    backUrl?: string | Record<string, any>;
    formOnly?: boolean;
    /** Khi true: ẩn hàng tiêu đề + back mặc định; parent tự dựng header (vd. edit có icon). */
    hideFormHeader?: boolean;
  }>(),
  {
    // initData: null,
    options: () => ({}),
    meta: () => ({}),
    breakLine: false,
    showCancel: false,
    formOnly: false,
    hideFormHeader: false,
  },
);

const emit = defineEmits<{
  (e: "submit", payload: { values: Record<string, any> }): void;
  (e: "cancel"): void;
  // (e: 'reset'): void
  // (e: 'field-change', payload: { name: string; value: any }): void
  // (e: 'validation', result: ValidationEvent): void
  // (e: 'error', error: Error): void
}>();

const vCard = computed(() => (!props.formOnly ? "v-card" : "div"));
const vCardText = computed(() => (!props.formOnly ? "v-card-text" : "div"));

const validate = async function () {
  const { valid } = await formRef.value.validate();

  if (valid) {
    return true;
  }

  return false;
};

const reset = function () {
  formRef.value.reset();
};

const resetValidation = function () {
  formRef.value.resetValidation();
};

const formData = ref(props.formSchema.initData ? props.formSchema.initData() : {});

/** Field-level errors returned by the API (e.g. `{ username: ["..."] }`), keyed by field name. */
const serverErrors = ref<Record<string, string[]>>({});

function clearServerError(name: string) {
  if (!(name in serverErrors.value)) return;
  const next = { ...serverErrors.value };
  delete next[name];
  serverErrors.value = next;
}

const fields = computed(() =>
  props.formSchema.fields.map((field) => {
    const isText = ["TextInput", "PasswordInput", "TextareaInput"].includes(field.type);
    const isComputed = field.type === "computed";
    const fieldDefault = resolveFieldDefault(field.default ?? (isText ? "" : null));

    return {
      ...field,
      readonly: isComputed || Boolean(field.readonly),
      modelValue: computed({
        get: () => {
          const value = getNestedValue(formData.value, field.name, undefined);
          if (typeof value === "function") return value();
          return value ?? fieldDefault;
        },
        set: (val) => {
          if (isComputed) return;
          setNestedValue(formData.value, field.name, val, fieldDefault);
          // The user is fixing this field — drop the stale server-side error.
          clearServerError(field.name);
        },
      }),
    };
  }),
);

/** Merge schema `attrs` with any server-side error messages for this field. */
function fieldAttrs(field: Record<string, any>) {
  const messages = serverErrors.value[field.name];
  return messages?.length
    ? { ...(field?.attrs || {}), "error-messages": messages }
    : field?.attrs || {};
}

function isFieldVisible(field: Record<string, any>) {
  const showWhen = field.showWhen;
  if (!showWhen) return true;

  if (typeof showWhen === "function") {
    return showWhen(formData.value, context.value);
  }

  const value = getNestedValue(formData.value, showWhen.field);
  if ("equals" in showWhen) {
    if (showWhen.equals === true) return value === true || value === 1;
    if (showWhen.equals === false) return value === false || value === 0;
    return value === showWhen.equals;
  }
  if (showWhen.truthy) return Boolean(value);

  return true;
}

const handleSubmit = async (e) => {
  const { valid } = await formRef.value.validate();

  if (valid) {
    clearServerErrors();
    emit("submit", formData.value);
    return;
  }

  await nextTick();
  scrollToFirstError();
};

function scrollToFirstError() {
  const firstErrorEl = document.querySelector(
    ".v-input.error, .v-field--error",
  ) as HTMLElement | null;

  if (firstErrorEl) {
    firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    const focusable = firstErrorEl.querySelector("input, textarea, select") as HTMLElement | null;
    (focusable || firstErrorEl).focus?.();
  }
}

/**
 * Apply field-level errors returned by an API call (e.g. `{ username: "...", password: "..." }`)
 * to the matching fields, then scroll/focus the first one so the user notices it right away.
 *
 * Usage in a parent view's submit handler:
 *   try {
 *     await someService.create(formData);
 *   } catch (e) {
 *     formRef.value?.setServerErrors(extractApiError(e).errors);
 *   }
 */
async function setServerErrors(errors: Record<string, unknown> | null | undefined) {
  const schemaFields = props.formSchema?.fields || [];
  const fieldNames = schemaFields.map((f: any) => f.name).filter(Boolean);
  const normalized = mapErrorsToFieldNames(
    normalizeFieldErrors(flattenErrorKeys(unwrapErrorMap(errors))),
    fieldNames,
  );
  serverErrors.value = normalized;

  if (!Object.keys(normalized).length) return;

  await nextTick();
  // Vuetify may need a second paint before error-messages are in the DOM.
  await nextTick();

  const firstIndex = schemaFields.findIndex((f: any) => normalized[f.name]);
  const firstFieldName = firstIndex >= 0 ? schemaFields[firstIndex].name : null;

  const target = firstFieldName
    ? (document.getElementById(`field-${firstFieldName}-${firstIndex}`) as HTMLElement | null)
    : null;

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    const focusable = target.matches?.("input, textarea, select")
      ? target
      : (target.querySelector("input, textarea, select") as HTMLElement | null);
    focusable?.focus?.();
  } else {
    scrollToFirstError();
  }
}

function clearServerErrors() {
  serverErrors.value = {};
}

defineExpose({
  validate,
  reset,
  resetValidation,
  setServerErrors,
  clearServerErrors,
});

const fullWidthTypes = [
  "TextareaInput",
  "PhotoUploadInput",
  "FileUploadInput",
  "WorshipServiceInput",
];

// const getColProps = (field: any) => {
//   // ưu tiên schema
//   if (field.cols) return normalizeCols(field.cols);

//   // full width đặc biệt
//   if (fullWidthTypes.includes(field.type)) {
//     return { cols: 12 };
//   }

//   // default
//   return { cols: 12, md: 6 };
// };

function useComputedFields({ fields, formData, context }) {
  const computedFields = fields.filter((f) => f.type === "computed");

  computedFields.forEach((field) => {
    const dependsOn = field.dependsOn || {};

    const sources = Object.values(dependsOn).map((path) => {
      return () => getNestedValue(formData.value, path);
    });

    watch(
      sources,
      () => {
        const deps: Record<string, any> = {};

        // ✅ KHÔNG dùng index nữa
        for (const [key, path] of Object.entries(dependsOn)) {
          deps[key] = getNestedValue(formData.value, path);
        }

        const newValue = field.compute?.({
          deps,
          ...context.value,
        });

        const oldValue = getNestedValue(formData.value, field.name);

        if (newValue !== oldValue) {
          setNestedValue(formData.value, field.name, newValue);
        }
      },
      { immediate: true },
    );
  });
}

const context = computed(() => ({
  form: formData.value,
  meta: props.meta,
  t,
}));

useComputedFields({
  fields: props.formSchema?.fields || [],
  formData,
  context,
});

// const computedFields = computed(() => props.formSchema.fields.filter((f) => f.type === "computed"));
// watchEffect(() => {
//   computedFields.value.forEach((field) => {
//     let deps: Record<string, any> = {};

//     // support 2 kiểu dependsOn
//     if (Array.isArray(field.dependsOn)) {
//       field.dependsOn.forEach((path) => {
//         deps[path] = getNestedValue(formData.value, path);
//       });
//     } else if (field.dependsOn && typeof field.dependsOn === "object") {
//       Object.entries(field.dependsOn).forEach(([key, path]) => {
//         deps[key] = getNestedValue(formData.value, path);
//       });
//     }

//     // 👉 CALL compute
//     const value = field.compute?.({
//       deps,
//       ...context.value,
//     });

//     // 👉 SET value vào formData
//     if (value !== undefined) {
//       const oldValue = getNestedValue(formData.value, field.name);

//       if (value !== oldValue) {
//         setNestedValue(formData.value, field.name, value);
//       }
//     }
//   });
// });

const handleCancel = () => {
  formRef.value.reset();
  formRef.value.resetValidation();

  emit("cancel");
};

const helpDialogOpen = ref(false);
const helpDialogTitle = ref("");
const helpDialogContent = ref("");

const resolveFieldLabel = (field: Record<string, any>) => {
  if (!field.label) return "";
  return typeof field.label === "function" ? field.label(context.value) : t(field.label);
};

const openFieldHelp = (field: Record<string, any>) => {
  helpDialogTitle.value = resolveFieldLabel(field);
  helpDialogContent.value = field.description ? t(field.description) : "";
  helpDialogOpen.value = true;
};

watch(
  () => props.initData,
  (val) => {
    if (!val) return;

    const payload = val?.data ?? val;
    const merged = initFormData(props.formSchema?.fields || [], payload);
    const baseInit = props.formSchema?.initData?.() ?? {};

    formData.value = { ...baseInit, ...merged };

    if (typeof props.mapper === "function") {
      props.mapper(payload, formData.value);
    }
  },
  { immediate: true },
);
</script>

<template>
  <v-row v-if="!hideFormHeader" class="my-2">
    <!-- title -->
    <v-col
      cols="12"
      md="6"
      class="d-flex align-center"
    >
      <div class="text-h4 font-weight-medium">
        {{ pageTitle }}
      </div>
    </v-col>

    <!-- back button -->
    <v-col
      cols="12"
      md="6"
    >
      <div class="d-flex justify-md-end">
        <slot name="header-right">
          <template v-if="backUrl">
            <v-btn
              color="primary"
              variant="outlined"
              @click="router.push(backUrl)"
            >
              <v-icon>$arrowLeft</v-icon> {{ $t("backToList") }}
            </v-btn>
          </template>
        </slot>
      </div>
    </v-col>
  </v-row>

  <component
    :is="vCard"
    variant="outlined"
    class="bg-surface"
  >
    <component :is="vCardText">
      <v-form
        ref="formRef"
        @submit.prevent="handleSubmit"
      >
        <v-row dense>
          <template
            v-for="(field, index) in fields"
            :key="index"
          >
            <!-- Type heading -->
            <v-col
              v-if="field.type === 'heading'"
              cols="12"
            >
              <h3 class="text-h6 font-weight-bold">
                {{ field.title }}
              </h3>
            </v-col>
            <!-- #Type heading -->

            <!-- Fields -->
            <v-col
              v-else-if="isFieldVisible(field)"
              v-bind="getColProps(field)"
            >
              <div
                class="w-100"
                :class="{ 'dynamic-form-photo-field': field.type === 'PhotoCropperInput' }"
              >
              <div
                v-if="field.label && !field.hideLabel"
                class="d-inline-flex align-center flex-wrap mb-1"
              >
                <v-label
                  class="mb-0"
                  :for="`field-${field.name}-${index}`"
                >
                  {{ typeof field.label === "function" ? field.label(context) : $t(field.label) }}

                  <span
                    class="text-error"
                    v-if="field?.rules?.includes('required')"
                    >*</span
                  >
                </v-label>
                <v-icon
                  v-if="field.description"
                  size="16"
                  color="primary"
                  class="ml-1 cursor-pointer"
                  role="button"
                  tabindex="0"
                  :aria-label="resolveFieldLabel(field)"
                  @mousedown.prevent
                  @click.stop.prevent="openFieldHelp(field)"
                  @keydown.enter.stop="openFieldHelp(field)"
                  @keydown.space.prevent.stop="openFieldHelp(field)"
                >
                  $informationOutline
                </v-icon>
              </div>

              <template v-if="field.component">
                <ChangePassword
                  v-if="field.type === 'ChangePassword'"
                  :user-id="initData?.id"
                />
                <component
                  v-else
                  :is="field.type"
                />
              </template>
              <template v-else>
                <SelectInput
                  v-if="field.type === 'SelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  :items="options[field.optionName]"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <PasswordInput
                  v-else-if="field.type === 'PasswordInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <ChurchSelectInput
                  v-else-if="field.type === 'ChurchSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  :items="options[field.optionName]"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <MultiTextInput
                  v-else-if="field.type === 'MultiTextInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <PioneeringStartDateInput
                  v-else-if="field.type === 'PioneeringStartDateInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  :preparation-date="
                    formData[field.preparationDateField || 'start_date_preparation']
                  "
                  :id="`field-${field.name}-${index}`"
                  v-bind="fieldAttrs(field)"
                />
                <YearMonthDayInput
                  v-else-if="field.type === 'YearMonthDayInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  :items="options[field.optionName]"
                  :id="`field-${field.name}-${index}`"
                  v-bind="fieldAttrs(field)"
                />
                <YesNoInput
                  v-else-if="field.type === 'YesNoInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <PhotoUploadInput
                  v-else-if="field.type === 'PhotoUploadInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :initial-image="field?.initialImageKey ? initData?.[field.initialImageKey] : null"
                  :id="`field-${field.name}-${index}`"
                />
                <CurrencySelectInput
                  v-else-if="field.type === 'CurrencySelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <ServiceVenueSelectInput
                  v-else-if="field.type === 'ServiceVenueSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <GeographicalRegionSelectInput
                  v-else-if="field.type === 'GeographicalRegionSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <CitySelectInput
                  v-else-if="field.type === 'CitySelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  :country-id="
                    getNestedValue(
                      formData,
                      field.countryField || 'country_id',
                    )
                  "
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <PastorSelectInput
                  v-else-if="field.type === 'PastorSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <ChurchTypeSelectInput
                  v-else-if="field.type === 'ChurchTypeSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <ChurchNetworkSelectInput
                  v-else-if="field.type === 'ChurchNetworkSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <ChurchRegionSelectInput
                  v-else-if="field.type === 'ChurchRegionSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <CountrySelectInput
                  v-else-if="field.type === 'CountrySelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <LanguageSelectInput
                  v-else-if="field.type === 'LanguageSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <WeekDayInput
                  v-else-if="field.type === 'WeekDayInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <TimeInput
                  v-else-if="field.type === 'TimeInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <LanguageRegionSelectInput
                  v-else-if="field.type === 'LanguageRegionSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <FileUploadInput
                  v-else-if="field.type === 'FileUploadInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <PhotoCropperInput
                  v-else-if="field.type === 'PhotoCropperInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :initial-image="field?.initialImageKey ? initData?.[field.initialImageKey] : null"
                  :id="`field-${field.name}-${index}`"
                />
                <WorshipServiceInput
                  v-else-if="field.type === 'WorshipServiceInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                  :services="options?.services || []"
                />
                <NumberInput
                  v-else-if="field.type === 'NumberInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :placeholder="field?.placeholder ? $t(field.placeholder) : ''"
                  :id="`field-${field.name}-${index}`"
                />
                <NumberFormattedInput
                  v-else-if="field.type === 'NumberFormattedInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :placeholder="field?.placeholder ? $t(field.placeholder) : ''"
                  :id="`field-${field.name}-${index}`"
                />
                <TextareaInput
                  v-else-if="field.type === 'TextareaInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :id="`field-${field.name}-${index}`"
                />
                <TextInput
                  v-else
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="fieldAttrs(field)"
                  :readonly="!!field.readonly"
                  :placeholder="field?.placeholder ? $t(field.placeholder) : ''"
                  :id="`field-${field.name}-${index}`"
                ></TextInput>
              </template>
              </div>
            </v-col>
          </template>
        </v-row>

        <slot
          name="actions"
          :submit="handleSubmit"
        >
          <v-row class="mt-4">
            <v-col
              cols="12"
              class="text-end"
            >
              <v-btn
                v-if="showCancel"
                type="button"
                variant="flat"
                @click="handleCancel"
              >
                {{ $t("cancel") }}
              </v-btn>
              <v-btn
                type="submit"
                color="primary"
                variant="flat"
              >
                {{ $t("save") }}
              </v-btn>
            </v-col>
          </v-row>
        </slot>
      </v-form>
    </component>
  </component>

  <InfoHelpDialog
    v-model="helpDialogOpen"
    :title="helpDialogTitle"
    :content="helpDialogContent"
  />
</template>

<style scoped lang="scss">
.dynamic-form-photo-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
