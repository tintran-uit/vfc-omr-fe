import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { i18n } from '@/i18n';

export const useLanguageStore = defineStore("language", () => {
  const availableLanguages = ['en', 'fr', 'zh', 'ms', 'ja', 'es', 'ptBR'];
  const currentLanguage = ref('en');

  const setLanguage = (lang: string) => {
    if (availableLanguages.includes(lang)) {
      currentLanguage.value = lang
      i18n.global.locale.value = lang
      localStorage.setItem('language', lang)
    }
  }

  const loadLanguage = () => {
    const saved = localStorage.getItem('language')

    if (saved && availableLanguages.includes(saved)) {
      currentLanguage.value = saved
      i18n.global.locale.value = saved
    }
  }


  return { setLanguage, loadLanguage, currentLanguage};
});