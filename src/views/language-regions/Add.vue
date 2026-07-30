<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { createFormSchema } from '@/form-schemas/addLanguageRegionFormSchema';
import { languageRegionService } from '@/services/languageRegionService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { useMessageStore } from '@/stores/messageStore';
import { extractApiError } from '@/utils/formErrors';

const router = useRouter()
const { t } = useI18n();
const messageStore = useMessageStore();
const route = useRoute()
const options = ref({})
const formSchema = createFormSchema();
const formRef = ref();

const handleSubmit = async (formData) => {
  try {
    await languageRegionService.create(formData)

    router.push({ name: 'LanguageRegionsList' });
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t('genericSaveError'));
    }
  }
}
</script>

<template>

    <!-- Main Content -->
    <v-sheet color="grey lighten-4" class="pa-8">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <h1>{{ $t('languageRegions.addTitle') }}</h1>
          <v-btn 
            color="primary" 
            variant="outlined" 
            @click="router.push({ name: 'LanguageRegionsList' })"
          >
            <v-icon>$arrowLeft</v-icon> {{ $t('backToList') }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="10" lg="12">
          <v-sheet class="pa-6" elevation="2" rounded="lg" color="white">
            <slot name="form">
              <DynamicFormDefault
                ref="formRef"
                :form-schema="formSchema"
                @submit="handleSubmit"
              />
            </slot>
          </v-sheet>
        </v-col>
      </v-row>
    </v-sheet>
</template>

<style scoped lang="scss">

</style>