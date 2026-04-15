<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useLanguageStore } from '@/stores/languageStore';
import { useLoadingStore } from '@/stores/loadingStore';

import enFlag from '@/assets/images/flags/en.svg';
import frFlag from '@/assets/images/flags/fr.svg';
import zhFlag from '@/assets/images/flags/zh.svg';
import msFlag from '@/assets/images/flags/ms.svg';
import jaFlag from '@/assets/images/flags/ja.svg';
import esFlag from '@/assets/images/flags/es.svg';
import ptBRFlag from '@/assets/images/flags/pt-BR.svg';

const languageStore = useLanguageStore();
const loadingStore = useLoadingStore();

const flags = {
  en: enFlag,
  fr: frFlag,
  zh: zhFlag,
  ms: msFlag,
  ja: jaFlag,
  es: esFlag,
  ptBR: ptBRFlag,
};

const languageDD = shallowRef([
  { title: 'English', subtext: 'UK', value: 'en' },
  { title: 'français', subtext: 'French', value: 'fr' },
  { title: '中国人', subtext: 'Chinese', value: 'zh' },
  { title: 'Bahasa Melayu', subtext: 'Malaysia', value: 'ms' }, // Malaysia
  { title: '日本語', subtext: 'Japanese', value: 'ja' },         // Japan
  { title: 'Español', subtext: 'Spanish', value: 'es' },        // Tay Ban Nha
  { title: 'Português (Brasil)', subtext: 'Portuguese (Brazil)', value: 'ptBR' }, // Brazil
]);

const currentItem = computed(() => {
  return languageDD.value.find((item) => item.value === languageStore.currentLanguage);
});

const handleChangeLanguage = (lang) => {
  loadingStore.show()
  languageStore.setLanguage(lang)

  setTimeout(() => {
    loadingStore.hide()
  }, 500);
}
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- language DD -->
  <!-- ---------------------------------------------- -->
  <v-menu location="bottom" offset="6, 80">
      <template v-slot:activator="{ props }">
        <v-btn variant="flat" class="ms-sm-2 ms-1 px-4" rounded="sm" v-bind="props">
          <v-img :src="flags[languageStore.currentLanguage]" width="24" height="24" contain class="mr-2" />
          {{ currentItem.title }}
          <v-icon end>$menuDown</v-icon>
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
            @click="handleChangeLanguage(item.value)"
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
