<script setup lang="ts">
import { onMounted, watch, ref, computed } from 'vue';
import { RouterView } from 'vue-router';
import { useDisplay, useTheme } from 'vuetify';
import { useCustomizerStore } from '../../stores/customizer';
import { DirAttrSet, HexToRgb } from '@/utils/utils';

import VerticalSidebar from './sidebar/VerticalSidebar.vue';
import AppBarMenu from './AppBarMenu.vue';
import LoaderWrapper from '../dashboard/LoaderWrapper.vue';

const { lgAndUp } = useDisplay();
const toggleSide = ref(false);

const customizer = useCustomizerStore();
const theme = useTheme();

// Set the initial direction attribute when the component is mounted
onMounted(() => {
  DirAttrSet(customizer.isRtl ? 'rtl' : 'ltr');
});

// Watch for changes in the isRtl property and update the direction attribute accordingly
watch(
  () => customizer.isRtl,
  (newValue) => {
    DirAttrSet(newValue ? 'rtl' : 'ltr');
  }
);

// Define the computed property to calculate the dynamic style object
const dynamicStyle = computed(() => ({
  '--v-theme-primary': HexToRgb(theme.current.value.colors.primary),
  '--v-theme-darkprimary': HexToRgb(theme.current.value.colors.darkprimary),
  '--v-theme-lightprimary': HexToRgb(theme.current.value.colors.lightprimary)
}));

// Method to conditionally apply the preset class
const getStyleObject = () => {
  // Define your condition here, for example:
  const condition = true; // Replace this with your actual condition

  return condition ? dynamicStyle.value : {};
};
</script>
<template>
  <v-locale-provider :rtl="customizer.isRtl">
    <v-app
      :style="getStyleObject()"
      :theme="customizer.actTheme"
      class="component-wrapper"
      :class="[
        customizer.actTheme,
        customizer.fontTheme,
        customizer.mini_sidebar ? 'mini-sidebar' : '',
        customizer.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
        customizer.inputBg ? 'inputWithbg' : ''
      ]"
    >
      <AppBarMenu @s-Toggle="toggleSide = !toggleSide" />
      <v-main class="page-wrapper component-layout">
        <v-container>
          <v-row class="mt-lg-8 mb-0">
            <v-col lg="3" v-if="!toggleSide && lgAndUp">
              <VerticalSidebar />
            </v-col>
            <v-col lg="9">
              <!-- Loader start -->
              <LoaderWrapper />
              <!-- Loader end -->
              <RouterView />
            </v-col>
          </v-row>
        </v-container>
        <v-navigation-drawer temporary v-model="toggleSide" width="300" top v-if="!lgAndUp">
          <VerticalSidebar />
        </v-navigation-drawer>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
<style scoped lang="scss">
.component-layout {
  .v-container:not(.v-container--fluid) {
    max-width: 1500px;
  }
}
</style>
