<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { createFormSchema } from '@/form-schemas/addChurchFormSchema';
import {churchService} from '@/services/churchService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;
const editData = ref(null);
const formSchema = createFormSchema();

const fetchEditData = async function (id) {
  if (!id) return;
  try {
    const data = await churchService.get(id);
    
    editData.value = data;
  } catch (e) {
    console.log('error', e);
  }
}

const handleSubmit = async (formData) => {
  console.log('formData', formData, formData.value);
  try {
    await churchService.update(id, formData)
  } catch (e) {
    console.log('error', e);
  }
}

onMounted(() => {
  fetchEditData(id);
});

const churchId = ref();
</script>

<template>

    <!-- Main Content -->
    <v-sheet color="grey lighten-4" class="pa-8">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <h1>{{ $t('church.editTitle', {id: id}) }}</h1>
          <v-btn 
            color="primary" 
            variant="outlined" 
            @click="router.push({ name: 'ChurchList' })"
          >
            <v-icon>$arrowLeft</v-icon> {{ $t('backToList') }}
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
                :init-data="editData"
              />
              
            </slot>
          </v-sheet>
        </v-col>
      </v-row>
    </v-sheet>
</template>

<style scoped lang="scss">

</style>