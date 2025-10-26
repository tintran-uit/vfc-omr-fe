<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { createFormSchema } from '@/form-schemas/addUserFormSchema';
import {userService} from '@/services/userService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/messageStore';

const router = useRouter()
const options = ref({})
const formSchema = createFormSchema();

const loadOptions = async function () {
  options.value = await userService.getFormData();
}

const handleSubmit = async (formData) => {
  try {
    await userService.create(formData)

    router.push({ name: 'UserList' });
  } catch (e) {
    console.log('error', e);
  }
}

onMounted(() => {
  loadOptions();
});
</script>

<template>

    <!-- Main Content -->
    <v-sheet color="grey lighten-4" class="pa-8">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <h1>{{ $t('user.addTitle') }}</h1>
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
        <v-col cols="12" md="10" lg="12">
          <v-sheet class="pa-6" elevation="2" rounded="lg" color="white">
            <slot name="form">
              <DynamicFormDefault
                :options="options"
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