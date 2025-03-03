<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

const relativeURL = ref<string>('');

onMounted(async () => {
  try {
    relativeURL.value = import.meta.env.BASE_URL || '/'; // Fallback to '/'
  } catch (error) {
    console.error('Error url not found:', error);
  }
});

const footerLink = computed(() =>
  [
    {
      title: 'About us',
      link: 'https://codedthemes.com/about-us/'
    },
    {
      title: 'Privacy',
      link: 'privacy-policy'
    },
    {
      title: 'Terms',
      link: 'privacy-policy'
    }
  ].map((item) => ({
    ...item,
    link: item.link.startsWith('http') ? item.link : `${relativeURL.value}${item.link}`
  }))
);
</script>
<template>
  <v-footer class="px-0 footer">
    <v-row justify="center" no-gutters>
      <v-col cols="6">
        <p class="text-caption mb-0">© All rights reserved</p>
      </v-col>
      <v-col class="text-end" cols="6">
        <a v-for="(item, i) in footerLink" :key="i" class="mx-2 text-caption text-darkText" :href="item.link" target="_blank">
          {{ item.title }}
        </a>
      </v-col>
    </v-row>
  </v-footer>
</template>
