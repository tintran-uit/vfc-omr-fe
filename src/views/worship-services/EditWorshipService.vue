<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { createFormSchema } from '@/form-schemas/addWorshipServiceFormSchema';
import { worshipServiceService } from '@/services/worshipServiceService';
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
const churchId = computed(() => route.params.churchId);
const id = computed(() => route.params.id);
const formSchema = createFormSchema();
const formRef = ref();
const editData = ref(null);

const fetchEditData = async function (id) {
  if (!id) return;
  try {
    const data = await worshipServiceService.getById(id);
    
    editData.value = data;
  } catch (e) {
    console.log('error', e);
  }
}

const handleSubmit = async (formData) => {
  try {
    await worshipServiceService.update(id.value, formData)

    router.push({ name: 'WorshipServiceList' });
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t('genericSaveError'));
    }
  }
}

watch(
  () => id.value,
  async (id) => {
    if (!id) return
    fetchEditData(id)
  },
  { immediate: true }
)
</script>

<template>

    <!-- Main Content -->
    <v-sheet color="grey lighten-4" class="pa-8">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <h1>{{ $t('worshipService.editTitle', {id: id}) }}</h1>
          <v-btn 
            color="primary" 
            variant="outlined" 
            @click="router.push({ name: 'WorshipServiceList' })"
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
                :options="options"
                :form-schema="formSchema"
                :init-data="editData"
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