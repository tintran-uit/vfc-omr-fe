<script setup lang="ts">
import {useDeepModel} from '@/utils/objectUtil.js';

const props = defineProps({
  form: Object,
  field: Object,
});

const model = useDeepModel(props.form, props.field.name);
</script>

<template>
    <v-label class="text-wrap">{{field.label}}</v-label>

    <v-text-field
    type="text"
    v-model="model"
    hide-details="auto"
    
    variant="outlined"
    class="mt-2"
    color="primary"
    placeholder=""
    ></v-text-field>
</template>

<style scoped lang="scss">

</style>