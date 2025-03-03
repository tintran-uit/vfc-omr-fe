import { defineStore } from 'pinia';
import config from '@/config';
import { DirAttrSet } from '@/utils/utils';

export const useCustomizerStore = defineStore({
  id: 'customizer',
  state: () => ({
    Sidebar_drawer: config.Sidebar_drawer,
    Customizer_drawer: config.Customizer_drawer,
    mini_sidebar: config.mini_sidebar,
    setHorizontalLayout: config.setHorizontalLayout, // Horizontal layout
    actTheme: config.actTheme,
    fontTheme: config.fontTheme,
    inputBg: config.inputBg,
    boxed: config.boxed,
    isRtl: config.isRtl
  }),

  getters: {},
  actions: {
    SET_SIDEBAR_DRAWER() {
      this.Sidebar_drawer = !this.Sidebar_drawer;
    },
    SET_MINI_SIDEBAR(payload: boolean) {
      this.mini_sidebar = payload;
    },
    SET_CUSTOMIZER_DRAWER(payload: boolean) {
      this.Customizer_drawer = payload;
    },

    SET_LAYOUT(payload: boolean) {
      this.setHorizontalLayout = payload;
    },
    SET_THEME(payload: string) {
      this.actTheme = payload;
    },
    SET_FONT(payload: string) {
      this.fontTheme = payload;
    },

    SET_DIRECTION(dir: 'ltr' | 'rtl') {
      this.isRtl = dir === 'rtl';
      DirAttrSet(dir); // Call _setDirAttr to set the direction attribute
    }
  }
});
