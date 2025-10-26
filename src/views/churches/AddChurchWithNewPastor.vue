<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import {createFormSchema as createAddChurchFormSchema} from '@/form-schemas/addChurchFormSchema';
import { createFormSchema as createAddUserFormSchema} from '@/form-schemas/addUserFormSchema';
import DynamicFormMultiple from '@/components/forms/DynamicFormMultiple.vue';
import { useRoute, useRouter } from "vue-router";
import {churchService} from '@/services/churchService';
import { userService } from '@/services/userService';

const options = ref({});
const router = useRouter();
const churchSchema = createAddChurchFormSchema();
churchSchema.fields = churchSchema.fields.filter(f => f.name !== 'pastor_id')

const multipleSchema = {
  user: createAddUserFormSchema(),
  church: churchSchema,
}

const loadOptions = async function () {
  options.value = await userService.getFormData();
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
  loadOptions();
});
</script>

<template>

    <!-- Main Content -->
    <v-sheet color="grey lighten-4" class="pa-8">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <h1>{{ $t('church.addWithNewUserTitle') }}</h1>
          <!-- <v-btn 
            color="primary" 
            variant="outlined" 
            @click="router.push({ name: 'ChurchList' })"
          >
            <v-icon>$arrowLeft</v-icon> {{$t('backToList')}}
          </v-btn> -->
        </v-col>
      </v-row>
    </v-sheet>

    <DynamicFormMultiple
                :options="options"
                :form-schema="multipleSchema"
                :is-multi-part="true"
                @submit="handleSubmit"
              />
</template>

<style scoped lang="scss">

</style>