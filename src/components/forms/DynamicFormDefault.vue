<script setup lang="ts">
import { useTemplateRef, onMounted, computed, ref, watch, watchEffect } from "vue";
import { getNestedValue, setNestedValue } from "@/utils/objectUtil.ts";
import { createFormRules } from "@/helpers/formRulesFactory";
import { useI18n } from "vue-i18n";
import { mapModel } from "@/utils/mapperUtil";
import { getColProps } from "@/helpers/formHelper";
import PioneeringStartDateInput from "@/components/input/PioneeringStartDateInput.vue";

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

const fields = computed(() =>
  props.formSchema.fields.map((field) => {
    const isText = ["TextInput", "PasswordInput", "TextareaInput"].includes(field.type);
    const isComputed = field.type === "computed";

    return {
      ...field,
      readonly: isComputed || Boolean(field.readonly),
      modelValue: computed({
        get: () =>
          getNestedValue(formData.value, field.name, field.default || (isText ? "" : null)),
        set: (val) => {
          if (isComputed) return;
          setNestedValue(formData.value, field.name, val, field.default || (isText ? "" : null));
        },
      }),
    };
  }),
);

const handleSubmit = async (e) => {
  const { valid } = await formRef.value.validate();

  if (valid) {
    emit("submit", formData.value);
    return;
  }

  const firstErrorEl = document.querySelector(
    ".v-input.error, .v-field--error",
  ) as HTMLElement | null;

  if (firstErrorEl) {
    firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    firstErrorEl.focus();
  }
};

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

watch(
  () => props.initData,
  (val) => {
    if (val) {
      mapModel(formData.value, val, {});

      if (typeof props.mapper === "function") {
        props.mapper(val, formData.value);
      }
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
              v-else
              v-bind="getColProps(field)"
            >
              <v-label
                class="mb-1"
                v-if="field.label && !field.hideLabel"
                :for="`field-${field.name}-${index}`"
              >
                {{ typeof field.label === "function" ? field.label(context) : $t(field.label) }}

                <span
                  class="text-error"
                  v-if="field?.rules?.includes('required')"
                  >*</span
                >
                <v-tooltip
                  :text="$t(field.description)"
                  v-if="field.description"
                >
                  <template #activator="{ props }">
                    <v-icon
                      v-bind="props"
                      size="16"
                      color="primary"
                      class="ml-1"
                    >
                      $informationOutline
                    </v-icon>
                  </template>
                </v-tooltip>
              </v-label>

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
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <PasswordInput
                  v-else-if="field.type === 'PasswordInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  :id="`field-${field.name}-${index}`"
                />
                <ChurchSelectInput
                  v-else-if="field.type === 'ChurchSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  :items="options[field.optionName]"
                  :id="`field-${field.name}-${index}`"
                />
                <MultiTextInput
                  v-else-if="field.type === 'MultiTextInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
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
                  v-bind="field?.attrs || {}"
                />
                <YearMonthDayInput
                  v-else-if="field.type === 'YearMonthDayInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  :items="options[field.optionName]"
                  :id="`field-${field.name}-${index}`"
                  v-bind="field?.attrs || {}"
                />
                <YesNoInput
                  v-else-if="field.type === 'YesNoInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <PhotoUploadInput
                  v-else-if="field.type === 'PhotoUploadInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :initial-image="field?.initialImageKey ? initData?.[field.initialImageKey] : null"
                  :id="`field-${field.name}-${index}`"
                />
                <CurrencySelectInput
                  v-else-if="field.type === 'CurrencySelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <ServiceVenueSelectInput
                  v-else-if="field.type === 'ServiceVenueSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <GeographicalRegionSelectInput
                  v-else-if="field.type === 'GeographicalRegionSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <CitySelectInput
                  v-else-if="field.type === 'CitySelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <PastorSelectInput
                  v-else-if="field.type === 'PastorSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <ChurchTypeSelectInput
                  v-else-if="field.type === 'ChurchTypeSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <ChurchNetworkSelectInput
                  v-else-if="field.type === 'ChurchNetworkSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <ChurchRegionSelectInput
                  v-else-if="field.type === 'ChurchRegionSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <CountrySelectInput
                  v-else-if="field.type === 'CountrySelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <LanguageSelectInput
                  v-else-if="field.type === 'LanguageSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <WeekDayInput
                  v-else-if="field.type === 'WeekDayInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <TimeInput
                  v-else-if="field.type === 'TimeInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <LanguageRegionSelectInput
                  v-else-if="field.type === 'LanguageRegionSelectInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <FileUploadInput
                  v-else-if="field.type === 'FileUploadInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <PhotoCropperInput
                  v-else-if="field.type === 'PhotoCropperInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :initial-image="field?.initialImageKey ? initData?.[field.initialImageKey] : null"
                  :id="`field-${field.name}-${index}`"
                />
                <WorshipServiceInput
                  v-else-if="field.type === 'WorshipServiceInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                  :services="options?.services || []"
                />
                <NumberInput
                  v-else-if="field.type === 'NumberInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :placeholder="field?.placeholder ? $t(field.placeholder) : ''"
                  :id="`field-${field.name}-${index}`"
                />
                <NumberFormattedInput
                  v-else-if="field.type === 'NumberFormattedInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :placeholder="field?.placeholder ? $t(field.placeholder) : ''"
                  :id="`field-${field.name}-${index}`"
                />
                <TextareaInput
                  v-else-if="field.type === 'TextareaInput'"
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <TextInput
                  v-else
                  :rules="resolveRules(field, formData)"
                  v-model="field.modelValue.value"
                  v-bind="field?.attrs || {}"
                  :readonly="!!field.readonly"
                  :placeholder="field?.placeholder ? $t(field.placeholder) : ''"
                  :id="`field-${field.name}-${index}`"
                ></TextInput>
              </template>
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
</template>

<style scoped></style>
