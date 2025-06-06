<script setup lang="ts">
import {useDeepModel} from '@/utils/objectUtil.js';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { globalDataStore } from '@/stores/globalDataStore';
import SelectInput from "@/components/input/SelectInput.vue";
const { t } = useI18n()

const modelValue = defineModel();

const items = ;
</script>

<template>
    <!-- <v-label class="text-wrap">{{field.label}}</v-label> -->
    
    <SelectInput
      :items="globalDataStore().currencies"
      v-model="modelValue"
    />
</template>

<style scoped lang="scss">

</style>