<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { useCustomizerStore } from '@/stores/customizer';

// icons
import { MenuOutlined, LineOutlined } from '@ant-design/icons-vue';

import Logo from '@/layouts/dashboard/logo/LogoLight.vue';

const customizer = useCustomizerStore();

const { mdAndUp } = useDisplay();
const drawer = ref(false);

defineEmits(['sToggle']);

const relativeURL = ref<string | null>(null);

onMounted(async () => {
  try {
    relativeURL.value = await import.meta.env.BASE_URL;
  } catch (error) {
    console.error('Error url not found:', error);
  }
});
</script>

<template>
  <v-app-bar
    elevation="0"
    flat
    height="69"
    class="border-bottom position-fixed"
    :color="customizer.actTheme === 'dark' ? 'surface' : 'darkText'"
    border="0"
  >
    <v-container class="fill-height maxWidth">
      <div class="d-flex align-center ga-2 w-100">
        <Logo />
        <!---/Search part -->
        <v-spacer />
        <!-- ---------------------------------------------- -->
        <!---right part -->
        <!-- ---------------------------------------------- -->
        <template v-if="mdAndUp">
          <v-btn variant="text" :href="`${relativeURL}dashboard/default`" target="_">Dashboard</v-btn>
          <v-btn variant="text" color="primary" to="/components/buttons">Components</v-btn>
          <v-btn variant="text" href="https://codedthemes.gitbook.io/mantis-vuetify/" target="_">Documentation</v-btn>
          <v-btn variant="flat" color="primary" href="https://codedthemes.com/item/mantis-vue-admin-template/" target="_"
            >Purchase Now</v-btn
          >
          <v-btn icon rounded="sm" variant="text" size="small" class="d-lg-none d-md-block" @click="$emit('sToggle')">
            <MenuOutlined :style="{ fontSize: '20px' }" />
          </v-btn>
        </template>
        <template v-else>
          <v-btn icon rounded="sm" variant="text" size="small" @click="$emit('sToggle')">
            <MenuOutlined :style="{ fontSize: '20px' }" />
          </v-btn>
        </template>
      </div>
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary location="top" style="height: 210px" floating v-if="!mdAndUp">
    <v-list color="primary">
      <v-list-item to="/dashboard/default">
        <template v-slot:prepend>
          <LineOutlined />
        </template>

        <v-list-item-title class="ms-3">Dashboard</v-list-item-title>
      </v-list-item>
      <v-list-item to="/components/buttons">
        <template v-slot:prepend>
          <LineOutlined />
        </template>

        <v-list-item-title class="ms-3">Components</v-list-item-title>
      </v-list-item>
      <v-list-item to="https://codedthemes.gitbook.io/mantis-vuetify/">
        <template v-slot:prepend>
          <LineOutlined />
        </template>

        <v-list-item-title class="ms-3">Documentation</v-list-item-title>
      </v-list-item>
      <v-list-item to="https://store.vuetifyjs.com/products/mantis-vuetify-admin-template">
        <template v-slot:prepend>
          <LineOutlined />
        </template>

        <v-list-item-title class="ms-3">Purchase Now</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
