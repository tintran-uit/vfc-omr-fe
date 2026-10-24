import { defineStore } from "pinia";
import { verseService, type Verse } from "@/services/verseService";

export const useVerseStore = defineStore("verse", {
  state: () => ({
    heading: "",
    body: "",
    loaded: false,
  }),
  actions: {
    apply(verse: Partial<Verse> | null | undefined) {
      if (!verse) return;
      if (verse.verse_heading != null) this.heading = String(verse.verse_heading);
      if (verse.verse_body != null) this.body = String(verse.verse_body);
    },
    async fetch(force = false) {
      if (this.loaded && !force) return;
      const data = await verseService.show(false);
      this.apply(data);
      this.loaded = true;
    },
    async change(payload: Verse) {
      const data = await verseService.change(payload);
      const saved =
        data && (data.verse_heading != null || data.verse_body != null) ? data : payload;
      this.apply(saved);
      this.loaded = true;
    },
  },
});
