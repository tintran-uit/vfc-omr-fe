<script setup lang="ts">
  import DynamicForm from "@/components/forms/DynamicForm.vue";
  import YesNoInput from "@/components/input/YesNoInput.vue";
import { ref } from "vue";

  const val = ref();

</script>

<template>
  <v-container>
    <v-row
        no-gutters
    >
      <!-- <v-col cols="6" sm="3" lg="3" v-for="n in 6" -->
             <!-- :key="n"> -->
        <!-- <v-text-field label="firstName" /> -->
      <!-- </v-col> -->

      <v-col>
        <YesNoInput v-model="val" />
        <pre>
            {{ val }}
        </pre>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

</style>