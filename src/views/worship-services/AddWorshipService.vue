<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { createFormSchema } from '@/form-schemas/addWorshipServiceFormSchema';
import { worshipServiceService } from '@/services/worshipServiceService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const options = ref({})
const churchId = computed(() => route.params.churchId);
const formSchema = createFormSchema();

const handleSubmit = async (formData) => {
  try {
    await worshipServiceService.createForChurch(churchId.value, formData)

    router.push({ name: 'WorshipServiceList' });
  } catch (e) {
    console.log('error', e);
  }
}
</script>

<template>

    <!-- Main Content -->
    <v-sheet color="grey lighten-4" class="pa-8">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <h1>{{ $t('worshipService.addTitle') }}</h1>
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