<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { createFormSchema } from '@/form-schemas/editUserFormSchema';
import {userService as service} from '@/services/userService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { useRoute, useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { useMessageStore } from '@/stores/messageStore';
import { extractApiError } from '@/utils/formErrors';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const messageStore = useMessageStore();
const options = ref({});
const id = route.params.id as string;
const editData = ref(null);
const formSchema = createFormSchema();
const formRef = ref();

const loadOptions = async function () {
  options.value = await service.getFormData();
}

const fetchEditData = async function (id) {
  if (!id) return;
  try {
    const data = await service.get(id);
    
    editData.value = data;
  } catch (e) {
    console.log('error', e);
  }
}

const handleSubmit = async (formData) => {
  try {
    await service.update(id, formData)

    router.push({ name: 'UserList' });
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t('genericSaveError'));
    }
  }
}

const mapperFn = function (source, destination) {
  destination.role_id = source.role ? source.role.id : null;
}

onMounted(() => {
  loadOptions();
  fetchEditData(id);
});
</script>

<template>

    <!-- Main Content -->
    <v-sheet color="grey lighten-4" class="pa-8">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <h1>{{ $t('user.editTitle', {id: id}) }}</h1>

          <v-btn 
            color="primary" 
            variant="outlined" 
            @click="router.push({ name: 'UserList' })"
          >
            <v-icon>$arrowLeft</v-icon> {{ $t('backToList') }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="12" lg="12">
          <v-sheet class="pa-6" elevation="2" rounded="lg" color="white">
            <!-- Slot để bỏ form -->
            <slot name="form">
              <DynamicFormDefault
                ref="formRef"
                :options="options"
                :form-schema="formSchema"
                @submit="handleSubmit"
                :init-data="editData"
                :mapper="mapperFn"
              />
              
            </slot>
          </v-sheet>
        </v-col>
      </v-row>
    </v-sheet>
</template>

<style scoped lang="scss">

</style>
