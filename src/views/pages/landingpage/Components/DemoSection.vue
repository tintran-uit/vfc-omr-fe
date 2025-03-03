<script setup lang="ts">
import { ref, onMounted } from 'vue';
// assets
import imageDemo1 from '@/assets/images/landing/img-demo2.jpg';
import imageDemo2 from '@/assets/images/landing/img-demo1.jpg';
import imageDemo3 from '@/assets/images/landing/img-demo3.jpg';

// icons
import { SendOutlined } from '@ant-design/icons-vue';
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
  <div class="spacer">
    <v-container class="maxWidth">
      <v-row class="justify-center">
        <v-col md="6" cols="12">
          <div class="text-center">
            <h6 class="text-subtitle-1 text-primary">Mantis for All</h6>
            <h2 class="text-h2 mt-2 mb-4">Complete Combo</h2>
            <p class="text-h6 mb-0">
              Whether you are developer or designer, Mantis serve the need of all - No matter you are novice or expert
            </p>
          </div>
        </v-col>
        <v-col md="12" cols="12"></v-col>
        <v-col md="4" sm="6" cols="12" data-aos="fade-up" data-aos-duration="800">
          <v-card variant="outlined" class="bg-surface overflow-hidden">
            <v-card-item class="pa-5 pb-7">
              <v-card-title class="text-h3 pb-3 mt-4">Design Source File</v-card-title>
              <p class="mb-6 text-h6 text-lightText">
                Check the live preview of Mantis figma design file. Figma file included in Plus and Extended License only.
              </p>
              <v-btn
                color="primary"
                variant="outlined"
                target="_"
                href="https://www.figma.com/file/NJGFukWMHgU0LVhS4qLP4A/Mantis?node-id=106412%3A169520"
              >
                <template v-slot:append>
                  <SendOutlined />
                </template>
                Preview Figma
              </v-btn>
            </v-card-item>
            <v-img cover height="250" class="ms-5" :src="imageDemo1"></v-img>
          </v-card>
        </v-col>
        <v-col md="4" sm="6" cols="12" data-aos="fade-up" data-aos-duration="800">
          <v-card variant="outlined" class="bg-lightprimary overflow-hidden">
            <v-card-item class="pa-5 pb-7">
              <v-card-title class="text-h3 pb-3 mt-4">Components</v-card-title>
              <p class="mb-6 text-h6 text-lightText">
                Check the all components of Mantis in single place with search feature for easing your development while working.
              </p>
              <v-btn color="primary" target="_" :href="`${relativeURL}components/buttons`"> View All Components </v-btn>
            </v-card-item>
            <v-img cover height="250" class="ms-5" :src="imageDemo2"></v-img>
          </v-card>
        </v-col>
        <v-col md="4" sm="6" cols="12" data-aos="fade-up" data-aos-duration="800">
          <v-card variant="outlined" class="bg-surface overflow-hidden">
            <v-card-item class="pa-5 pb-7">
              <v-card-title class="text-h3 pb-3 mt-4">Documentation</v-card-title>
              <p class="mb-6 text-h6 text-lightText">
                From Quick start to detailed installation with super easy navigation for find out solution of your queries with complex
                documentation guide.
              </p>
              <v-btn color="primary" variant="outlined" target="_" href="https://codedthemes.gitbook.io/mantis-vuetify/">
                Explore Documentation
              </v-btn>
            </v-card-item>
            <v-img cover height="250" class="ms-5" :src="imageDemo3"></v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
