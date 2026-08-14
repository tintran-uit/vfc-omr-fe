import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useNavLogoStore = defineStore('navLogo', () => {
  const overrideUrl = ref<string | null>(null);
  const overrideAlt = ref<string | null>(null);

  const hasOverride = computed(() => !!overrideUrl.value);

  function setOverride(url: string | null | undefined, alt?: string | null) {
    const trimmed = url?.trim();
    overrideUrl.value = trimmed || null;
    overrideAlt.value = trimmed ? (alt?.trim() || null) : null;
  }

  function clearOverride() {
    overrideUrl.value = null;
    overrideAlt.value = null;
  }

  return {
    overrideUrl,
    overrideAlt,
    hasOverride,
    setOverride,
    clearOverride,
  };
});
