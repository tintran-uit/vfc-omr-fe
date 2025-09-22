<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useLanguageStore } from '@/stores/languageStore';

import enFlag from '@/assets/images/flags/en.svg';
import frFlag from '@/assets/images/flags/fr.svg';
import roFlag from '@/assets/images/flags/ro.svg';
import zhFlag from '@/assets/images/flags/zh.svg';
import msFlag from '@/assets/images/flags/ms.svg';
import jaFlag from '@/assets/images/flags/ja.svg';

const languageStore = useLanguageStore();

const flags = {
  en: enFlag,
  fr: frFlag,
  ro: roFlag,
  zh: zhFlag,
  ms: msFlag,
  ja: jaFlag,
};

const languageDD = shallowRef([
  { title: 'English', subtext: 'UK', value: 'en' },
  { title: 'français', subtext: 'French', value: 'fr' },
  { title: 'Română', subtext: 'Romanian', value: 'ro' },
  { title: '中国人', subtext: 'Chinese', value: 'zh' },
  { title: 'Bahasa Melayu', subtext: 'Malaysia', value: 'ms' }, // Malaysia
  { title: '日本語', subtext: 'Japanese', value: 'ja' },         // Japan
]);

const currentItem = computed(() => {
  return languageDD.value.find((item) => item.value === languageStore.currentLanguage);
});
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- language DD -->
  <!-- ---------------------------------------------- -->
  <v-menu location="bottom" offset="6, 80">
      <template v-slot:activator="{ props }">
        <v-btn class="ms-sm-2 ms-1 px-4" rounded="sm" size="small" v-bind="props">
          <v-img :src="flags[languageStore.currentLanguage]" width="24" height="24" contain class="mr-2" />
          {{ currentItem.title }}
        </v-btn>
      </template>
      <v-sheet rounded="md" width="200">
        <v-list class="py-0" aria-label="language list" aria-busy="true">
          <v-list-item
            v-for="(item, index) in languageDD"
            :key="index"
            color="primary"
            :active="$i18n.locale == item.value"
            class="d-flex align-center"
            @click="languageStore.setLanguage(item.value)"
          >
            <v-list-item-title class="text-subtitle-1 font-weight-regular d-flex align-center">
              <v-img :src="flags[item.value]" width="24" height="24" contain class="mr-2" />
              {{ item.title }}
              <span class="text-lightText text-caption pl-2">({{ item.subtext }})</span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-menu>
</template>
