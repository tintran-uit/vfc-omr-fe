<script setup lang="ts">
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { ref, watch, computed } from 'vue';
import DynamicForm from "@/components/forms/DynamicForm.vue";
import reportService from '@/services/reportService';
import reportSchemaForm from "@/schema-forms/ReportSchemaForm";
import {globalDataStore} from '@/stores/globalDataStore';

function loadGlobalData()
{
  globalData().countries;
}

</script>

<template>
  <button @click="loadGlobalData">Load global data</button>
</template>

<style scoped lang="scss">

</style>