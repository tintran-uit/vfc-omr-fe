import { defineStore } from 'pinia';

export const PASTOR_SELECTED_CHURCH_ID_KEY = 'pastor_selected_church_id';

function readStoredChurchId(): number | null {
  try {
    const raw = localStorage.getItem(PASTOR_SELECTED_CHURCH_ID_KEY);
    if (!raw) return null;
    const id = Number(raw);
    return Number.isFinite(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

export const usePastorChurchStore = defineStore('pastorChurch', {
  state: () => ({
    selectedChurchId: readStoredChurchId(),
  }),
  actions: {
    setSelectedChurchId(id: number | string | null | undefined) {
      const parsed = id != null ? Number(id) : NaN;
      if (!Number.isFinite(parsed) || parsed <= 0) {
        this.clearSelectedChurchId();
        return;
      }
      this.selectedChurchId = parsed;
      localStorage.setItem(PASTOR_SELECTED_CHURCH_ID_KEY, String(parsed));
    },
    clearSelectedChurchId() {
      this.selectedChurchId = null;
      localStorage.removeItem(PASTOR_SELECTED_CHURCH_ID_KEY);
    },
  },
});
