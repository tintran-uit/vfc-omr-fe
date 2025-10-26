import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { languageService } from '@/services/languageService';
import { i18n } from '@/i18n';

export const useLanguageStore = defineStore("language", () => {
   // --- STATE ---
  const availableLanguages = ['en', 'fr', 'zh', 'ms', 'ja', 'es', 'ptBR'];
  const currentLanguage = ref('en');
  const options = ref<Array<{ name: string; id: string }>>([])
  const loading = ref(false)
  const loaded = ref(false)

  // --- ACTIONS ---
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

  const fetchForOptions = async (force = false) => {
    if (loaded.value && !force) return
    try {
      loading.value = true
      const { items } = await languageService.getAll()
      options.value = items.map((c: any) => ({
        name: c.name,
        id: c.id,
      }))
    } finally {
      loaded.value = true
      loading.value = false
    }
  }

    // --- GETTERS ---
    const asyncOptions = computed(() => {
      // Khi lần đầu tiên gọi getter, nếu chưa load thì fetch
      if (!loaded.value && !loading.value) {
        fetchForOptions()
      }
      return options.value
    })


  return {
     setLanguage,
      loadLanguage,
       currentLanguage,
       options,
    loading,
    loaded,
    fetchForOptions,
    asyncOptions
  };
});