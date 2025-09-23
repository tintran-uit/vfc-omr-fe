<script setup lang="ts">
import {useTemplateRef, onMounted, computed, ref, defineEmits, watch} from 'vue'
import {getNestedValue, setNestedValue, initFormData} from '@/utils/objectUtil.ts'
import {createFormRules} from '@/helpers/formRulesFactory'
import { useI18n } from 'vue-i18n'
import {mapModel} from '@/utils/mapperUtil'
import CurrencySelectInput from '../input/CurrencySelectInput.vue'
import GeographicalRegionSelectInput from '../input/GeographicalRegionSelectInput.vue'
import CityInput from '../input/CityInput.vue'

const { t } = useI18n()

const formRef = useTemplateRef('formRef');
const {resolveRules} = createFormRules(t);
const props = withDefaults(
  defineProps<{
    formSchema: Record<string, any>
    initData?: Record<string, any> | null
    options?: Record<string, any>
    mapper?: (source: any, destination: any) => any
  }>(),
  {
    // initData: null,
    options: () => ({}),
  }
)

const emit = defineEmits<{
  (e: 'submit', payload: { values: Record<string, any> }): void
  // (e: 'reset'): void
  // (e: 'field-change', payload: { name: string; value: any }): void
  // (e: 'validation', result: ValidationEvent): void
  // (e: 'error', error: Error): void
}>()


const validate = async function () {
  const {valid} = await formRef.value.validate()

  if (valid) {
    return true
  }

  return false;
}

const reset = function () {
  formRef.value.reset()
}

const resetValidation = function () {
  formRef.value.resetValidation();
}

const formData = ref(
  props.formSchema.initData ? props.formSchema.initData() : {}
);

const fields = [...props.formSchema.fields];

fields.map(field => {
  const isText = ['TextInput', 'PasswordInput', 'TextareaInput'].includes(field.type)
  field.modelValue = computed({
    get: () => getNestedValue(formData.value, field.name, field.default || (isText ? '' : null)),
    set: val => setNestedValue(formData.value, field.name, val, field.default || (isText ? '' : null))
  })
})

const handleSubmit = async (e) => {
  const {valid} = await formRef.value.validate()

  if (valid) {
    emit('submit', formData.value)
  }
}

watch(
  () => props.initData,
  (val) => {
    if (val) {
      mapModel(formData.value, val, {})
      
      if (typeof props.mapper === 'function') {
        props.mapper(val, formData.value)
      }
    }
  },
  {immediate: true}
)
</script>

<template>
  <v-sheet class="mx-auto">
    <v-form ref="formRef" @submit.prevent="handleSubmit">
      <v-row dense>
        <template v-for="(field, index) in fields" :key="index">
          <v-col cols="12" md="6">
            <v-label class="mb-1" v-if="field.label" :for="`field-${field.name}-${index}`">
              {{ $t(field.label)}}
              <span class="text-error" v-if="field?.rules?.includes('required')">*</span>
              <v-tooltip :text="$t(field.description)" v-if="field.description" class="ml-2">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" size="16" color="primary">
                      $informationOutline
                    </v-icon>
                  </template>
                </v-tooltip>
            </v-label>

            <SelectInput
              v-if="field.type === 'SelectInput'"
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              :items="options[field.optionName]"
              v-bind="field?.attrs || {}"
              :id="`field-${field.name}-${index}`"
            />
            <PasswordInput
              v-else-if="field.type === 'PasswordInput'"
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              :id="`field-${field.name}-${index}`"
            />
            <ChurchSelectInput
              v-else-if="field.type === 'ChurchSelectInput'"
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              :items="options[field.optionName]"
              :id="`field-${field.name}-${index}`"
            />
            <MultiTextInput
              v-else-if="field.type === 'MultiTextInput'"
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              :id="`field-${field.name}-${index}`"
            />
            <YearMonthDayInput
              v-else-if="field.type === 'YearMonthDayInput'"
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              :items="options[field.optionName]"
              :id="`field-${field.name}-${index}`"
            />
            <YesNoInput
              v-else-if="field.type === 'YesNoInput'"
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              v-bind="field?.attrs || {}"
              :id="`field-${field.name}-${index}`"
            />
            <PhotoUploadInput
              v-else-if="field.type === 'PhotoUploadInput'"
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              v-bind="field?.attrs || {}"
              :initial-image="field?.initialImageKey ? initData?.[field.initialImageKey] : null"
              :id="`field-${field.name}-${index}`"
            />
            <CurrencySelectInput
              v-else-if="field.type === 'CurrencySelectInput'"
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              v-bind="field?.attrs || {}"
              :id="`field-${field.name}-${index}`"
            />
            <ServiceVenueSelectInput
              v-else-if="field.type === 'ServiceVenueSelectInput'"
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              v-bind="field?.attrs || {}"
              :id="`field-${field.name}-${index}`"
            />
            <GeographicalRegionSelectInput
              v-else-if="field.type === 'GeographicalRegionSelectInput'"
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              v-bind="field?.attrs || {}"
              :id="`field-${field.name}-${index}`"
            />
            <CityInput
              v-else-if="field.type === 'CityInput'"
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              v-bind="field?.attrs || {}"
              :id="`field-${field.name}-${index}`"
            />
            <TextareaInput
              v-else-if="field.type === 'TextareaInput'"
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              v-bind="field?.attrs || {}"
              :id="`field-${field.name}-${index}`"
              />
            <TextInput
              v-else
              :rules="resolveRules(field)"
              v-model="field.modelValue.value"
              v-bind="field?.attrs || {}"
              :id="`field-${field.name}-${index}`"
            ></TextInput>
          </v-col>
        </template>
      </v-row>

      <v-row class="mt-4">
      <v-col cols="12" class="text-end">
        <v-btn type="submit" color="primary" variant="flat">
          {{ $t('common.save') }}
        </v-btn>
      </v-col>
    </v-row>
      
      <!-- <div class="d-flex flex-column">
        <v-btn
          class="mt-4"
          color="success"
          block
          type="submit"
        >
          Validate
        </v-btn> -->

        <!--        <v-btn-->
        <!--          class="mt-4"-->
        <!--          color="success"-->
        <!--          block-->
        <!--          @click="validate"-->
        <!--        >-->
        <!--          Validate-->
        <!--        </v-btn>-->

        <!--        <v-btn-->
        <!--          class="mt-4"-->
        <!--          color="error"-->
        <!--          block-->
        <!--          @click="reset"-->
        <!--        >-->
        <!--          Reset Form-->
        <!--        </v-btn>-->

        <!--        <v-btn-->
        <!--          class="mt-4"-->
        <!--          color="warning"-->
        <!--          block-->
        <!--          @click="resetValidation"-->
        <!--        >-->
        <!--          Reset Validation-->
        <!--        </v-btn>-->
      <!-- </div> -->
    </v-form>
  </v-sheet>
</template>

<style scoped>

</style>
