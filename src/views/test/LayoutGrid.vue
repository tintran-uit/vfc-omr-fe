<script setup lang="ts">
  import DynamicForm from "@/components/forms/DynamicForm.vue";
import { ref } from "vue";

  const item = ref({
    user: {
      address: {
        route: '37',
        street: 'Ky Con',
        district: '1'
      },
      avatar: {
        path: '8234.jpg',
        size: '50x50'
      }
    }
  });

  const schema = ref({
    fields: [
        {
            label: 'Route number',
            name: 'user.address.route',
            rules: 'required',
            type: 'text',
            groupTitle: 'Address'
        },
        {
            label: 'Address',
            name: 'user.address.street',
            rules: 'required',
            type: 'text',
        },
      ]
  });

</script>

<template>
  <v-container>
    <v-row
        align="start"
        style="height: 150px;"
        no-gutters
    >
      <!-- <v-col cols="6" sm="3" lg="3" v-for="n in 6" -->
             <!-- :key="n"> -->
        <!-- <v-text-field label="firstName" /> -->
      <!-- </v-col> -->

      <DynamicForm
        :data="item"
        :schema="schema"
        />
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

</style>