<script setup lang="ts">
import { shallowRef } from 'vue';
const lists = shallowRef([
  {
    number: '128+',
    title: 'Pages',
    content: 'Hand Crafted useful pages with best user experience.'
  },
  {
    number: '200+',
    title: 'Vuetify Components',
    content: 'Made using Vuetify Vue - A Most popular Vue Platform.'
  },
  {
    number: '5+',
    title: 'Conceptual Apps',
    content: 'Find out 5+ working apps which suits your Vue Project.'
  }
]);
</script>
<template>
  <div class="spacer">
    <v-container class="maxWidth">
      <v-row>
        <v-col cols="12" md="4" sm="6" v-for="(list, i) in lists" :key="i">
          <div class="d-flex align-center">
            <h2 class="text-h2 me-4 mb-0 text-end" style="min-width: 70px">{{ list.number }}</h2>
            <div>
              <h4 class="text-h4">{{ list.title }}</h4>
              <p class="text-h6 mb-0">{{ list.content }}</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
