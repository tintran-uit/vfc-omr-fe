<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { createFormSchema } from '@/form-schemas/addChurchFormSchema';
import {churchService} from '@/services/churchService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const formSchema = createFormSchema();
const defaultData = ref({})

async function fetchDefaultData() {
  defaultData.value = await churchService.getDefaultFormData()
}

const handleSubmit = async (formData) => {
  try {
    await churchService.create(formData)

    router.push({ name: 'ChurchList' });
  } catch (e) {
    console.log('error', e);
  }
}

onMounted(() => {
  fetchDefaultData()
})
</script>

<template>

    <!-- Main Content -->
    <v-sheet color="grey lighten-4" class="pa-8">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <h1>{{ $t('church.addTitle') }}</h1>
          <v-btn 
            color="primary" 
            variant="outlined" 
            @click="router.push({ name: 'ChurchList' })"
          >
            <v-icon>$arrowLeft</v-icon> {{$t('backToList')}}
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="12" lg="12">
          <v-sheet class="pa-6" elevation="2" rounded="lg" color="white">
            <slot name="form">
              <DynamicFormDefault
                :form-schema="formSchema"
                @submit="handleSubmit"
                :init-data="defaultData"
              />
            </slot>
          </v-sheet>
        </v-col>
      </v-row>
    </v-sheet>
</template>

<style scoped lang="scss">

</style>