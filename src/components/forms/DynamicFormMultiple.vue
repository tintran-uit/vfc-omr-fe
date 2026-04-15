<script setup lang="ts">
import {useTemplateRef, onMounted, computed, ref, watch, toRef, reactive } from 'vue'
import {getNestedValue, setNestedValue, initFormData} from '@/utils/objectUtil.ts'
import {createFormRules} from '@/helpers/formRulesFactory'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from "vue-router";
import {mapModel} from '@/utils/mapperUtil'
import CardHeader from '@/components/shared/CardHeader.vue'
import UiChildCard from '@/components/shared/UiChildCard.vue'

const { t } = useI18n()
const router = useRouter();
const formRef = useTemplateRef('formRef');
const {resolveRules} = createFormRules(t);
const props = withDefaults(
  defineProps<{
    pageTitle?: string
    formSchema: Record<string, any>
    initData?: Record<string, any> | null
    options?: Record<string, any>
    mapper?: (source: any, destination: any) => any
    backUrl?: string | Record<string, any>
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

const isMultipleSchema = computed(() => {
  return Object.values(props.formSchema).every(
    (schema) => schema && typeof schema === 'object' && Array.isArray(schema.fields)
  ) && !Array.isArray((props.formSchema as any).fields)
})

// const formData = ref(
//   props.formSchema.initData ? props.formSchema.initData() : {}
// );
const formData = ref<Record<string, any>>({})
for (const [key, schema] of Object.entries(props.formSchema)) {
  formData.value[key] = schema.initData ? schema.initData() : {}
}

const virtualModelValue = reactive({})

const fields: any[] = []



for (const [schemaKey, schemaDef] of Object.entries(props.formSchema)) {
  schemaDef.fields.forEach((field, index) => {
    const isText = ['TextInput', 'PasswordInput', 'TextareaInput'].includes(field.type)

    const accessKey = `${schemaKey}.${field.name}`;
    field.accessKey = accessKey;
    virtualModelValue[accessKey] = computed({
      get: () =>
        getNestedValue(formData.value, accessKey, field.default || (isText ? '' : null)),
      set: (val) =>
        setNestedValue(formData.value, accessKey, val, field.default || (isText ? '' : null))
    })

    fields.push(field)
  })
}

// for (const [schemaKey, schemaDef] of Object.entries(props.formSchema)) {
//     const schemaData = schemaDef.initData ? schemaDef.initData() : {}
//     formData.value[schemaKey] = schemaData

//     schemaDef.fields.forEach((field: any) => {
//       const isText = ['TextInput', 'PasswordInput', 'TextareaInput'].includes(field.type)

//       field.modelValue = computed({
//   get() {
//     const val = getNestedValue(schemaData, field.name)
//     // Nếu là object mà input là TextInput → trả về chuỗi rỗng để tránh [object Object]
//     if (['TextInput', 'PasswordInput', 'TextareaInput'].includes(field.type)) {
//       if (val === undefined || val === null) return ''
//       if (typeof val === 'object') return '' // tránh [object Object]
//       return String(val)
//     }
//     return val
//   },
//   set(newVal) {
//     setNestedValue(schemaData, field.name, newVal)
//   }
// })

//       // field.modelValue = toRef(schemaData, field.name)

//       // const currentVal = virtualModelValue[field.accessKey]
//       // if (currentVal === undefined || currentVal === null || (isText && currentVal === '')) {
//       //   virtualModelValue[field.accessKey] = field.default ?? (isText ? '' : null)
//       // }

//       // field.modelValue = computed({
//       //   get: () =>
//       //     getNestedValue(schemaData, field.name, field.default || (isText ? '' : null)),
//       //   set: (val) =>
//       //     setNestedValue(schemaData, field.name, val, field.default || (isText ? '' : null)),
//       // })
//     })
//   }

const handleSubmit = async (e) => {
  const {valid} = await formRef.value.validate()

  if (valid) {
    emit('submit', formData.value)
    return
  }

  const firstErrorEl = document.querySelector(
    '.v-input.error, .v-field--error'
  ) as HTMLElement | null

  if (firstErrorEl) {
    firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    firstErrorEl.focus()
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
  <v-row class="my-2">
    <!-- title -->
    <v-col cols="12" md="6" class="d-flex align-center">
      <div class="text-h4 font-weight-medium">
        {{ pageTitle }}
      </div>
    </v-col>

    <!-- back button -->
    <v-col cols="12" md="6">
      <div class="d-flex justify-md-end">
        <slot name="header-right">
          <template v-if="backUrl">
            <v-btn 
            color="primary" 
            variant="outlined" 
            @click="router.push(backUrl)"
          >
            <v-icon>$arrowLeft</v-icon> {{$t('backToList')}}
          </v-btn>
          </template>
        </slot>
      </div>
    </v-col>
  </v-row>

    <v-form ref="formRef" @submit.prevent="handleSubmit">
      <template v-for="(schemaDef, schemaKey) in formSchema" :key="schemaKey">
        <UiChildCard :title="$t(schemaDef.name)" class="mt-5">
          <v-row dense>
            <template v-for="(field, index) in schemaDef.fields" :key="`${schemaKey}-${index}`">
              <v-col cols="12" md="6">
                <v-label class="mb-1" v-if="field.label" :for="`field-${field.name}-${index}`">
                  {{ $t(field.label)}}
                  <span class="text-error" v-if="field?.rules?.includes('required')">*</span>
                  <v-tooltip :text="$t(field.description)" v-if="field.description">
                      <template #activator="{ props }">
                        <v-icon v-bind="props" size="16" color="primary" class="ml-1">
                          $informationOutline
                        </v-icon>
                      </template>
                    </v-tooltip>
                </v-label>

                <SelectInput
                  v-if="field.type === 'SelectInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  :items="options[field.optionName]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <PasswordInput
                  v-else-if="field.type === 'PasswordInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  :id="`field-${field.name}-${index}`"
                />
                <ChurchSelectInput
                  v-else-if="field.type === 'ChurchSelectInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  :items="options[field.optionName]"
                  :id="`field-${field.name}-${index}`"
                />
                <MultiTextInput
                  v-else-if="field.type === 'MultiTextInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  :id="`field-${field.name}-${index}`"
                />
                <YearMonthDayInput
                  v-else-if="field.type === 'YearMonthDayInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  :items="options[field.optionName]"
                  :id="`field-${field.name}-${index}`"
                />
                <YesNoInput
                  v-else-if="field.type === 'YesNoInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <PhotoUploadInput
                  v-else-if="field.type === 'PhotoUploadInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :initial-image="field?.initialImageKey ? initData?.[field.initialImageKey] : null"
                  :id="`field-${field.name}-${index}`"
                />
                <CurrencySelectInput
                  v-else-if="field.type === 'CurrencySelectInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <ServiceVenueSelectInput
                  v-else-if="field.type === 'ServiceVenueSelectInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <GeographicalRegionSelectInput
                  v-else-if="field.type === 'GeographicalRegionSelectInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <CitySelectInput
                  v-else-if="field.type === 'CitySelectInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <PastorSelectInput
                  v-else-if="field.type === 'PastorSelectInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <ChurchTypeSelectInput
                  v-else-if="field.type === 'ChurchTypeSelectInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <ChurchNetworkSelectInput
                  v-else-if="field.type === 'ChurchNetworkSelectInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <ChurchRegionSelectInput
                  v-else-if="field.type === 'ChurchRegionSelectInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <CountrySelectInput
                  v-else-if="field.type === 'CountrySelectInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <LanguageSelectInput
                  v-else-if="field.type === 'LanguageSelectInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                />
                <TimeInput
                v-else-if="field.type === 'TimeInput'"
                :rules="resolveRules(field, formData)"
                v-model="virtualModelValue[field.accessKey]"
                v-bind="field?.attrs || {}"
                :id="`field-${field.name}-${index}`"
              />
              <LanguageRegionSelectInput
                v-else-if="field.type === 'LanguageRegionSelectInput'"
                :rules="resolveRules(field, formData)"
                v-model="virtualModelValue[field.accessKey]"
                v-bind="field?.attrs || {}"
                :id="`field-${field.name}-${index}`"
              />
              <FileUploadInput
                v-else-if="field.type === 'FileUploadInput'"
                :rules="resolveRules(field, formData)"
                v-model="virtualModelValue[field.accessKey]"
                v-bind="field?.attrs || {}"
                :id="`field-${field.name}-${index}`"
              />
              <PhotoCropperInput
                v-else-if="field.type === 'PhotoCropperInput'"
                :rules="resolveRules(field, formData)"
                v-model="virtualModelValue[field.accessKey]"
                v-bind="field?.attrs || {}"
                :id="`field-${field.name}-${index}`"
              />
                <TextareaInput
                  v-else-if="field.type === 'TextareaInput'"
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                  />
                <TextInput
                  v-else
                  :rules="resolveRules(field)"
                  v-model="virtualModelValue[field.accessKey]"
                  v-bind="field?.attrs || {}"
                  :id="`field-${field.name}-${index}`"
                ></TextInput>
              </v-col>
            </template>
          </v-row>
        </UiChildCard>
      </template>

      <v-row class="mt-4">
        <v-col cols="12" class="text-end">
          <v-btn type="submit" color="primary" variant="flat">
            {{ $t('save') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
</template>

<style scoped>

</style>
