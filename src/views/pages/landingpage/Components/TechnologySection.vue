<script setup lang="ts">
import { ref, shallowRef } from 'vue';

// assets
import img1 from '@/assets/images/landing/technology/tech-ci.png';
import img2 from '@/assets/images/landing/technology/tech-react.png';
import img3 from '@/assets/images/landing/technology/tech-angular.png';
import img4 from '@/assets/images/landing/technology/tech-bootstrap.png';
import img5 from '@/assets/images/landing/technology/tech-dot-net.png';

const techonlogy = shallowRef([
  {
    image: img1,
    link: 'https://codedthemes.com/item/mantis-codeigniter-admin-template/'
  },
  {
    image: img2,
    link: 'https://mui.com/store/items/mantis-react-admin-dashboard-template/'
  },
  {
    image: img3,
    link: 'https://codedthemes.com/item/mantis-angular-admin-template/'
  },
  {
    image: img4,
    link: 'https://codedthemes.com/item/mantis-bootstrap-admin-dashboard/'
  },
  {
    image: img5,
    link: 'https://codedthemes.com/item/mantis-dotnet-bootstrap-dashboard-template/'
  }
]);

const marqueeArray = ref([
  'Auth Methods',
  '150+ Pages',
  '6+ Preset Colors',
  '50+ Widgets',
  'Best User Experience',
  'Live Customizer',
  '5+ Apps',
  'Highly Flexible',
  'Always Updated',
  'Professional Design',
  'TypeScript Support',
  'Figma Design',
  'Dark Layout',
  'Retina Ready',
  'Prettier Code',
  'i18n Support'
]);
</script>
<template>
  <div class="spacer">
    <v-container class="maxWidth pb-0">
      <v-row class="justify-center">
        <v-col md="5" cols="12">
          <div class="text-center">
            <h6 class="text-subtitle-1 text-primary">Multiple Tech Stack</h6>
            <h2 class="text-h2 mt-2 mb-4">Available Technology</h2>
            <p class="text-h6 mb-0">
              Mantis is available in multiple technologies. Simply click to dive in and discover the perfect solution for your needs. Each
              sold
              <a
                href="https://codedthemes.gitbook.io/mantis/mantis-eco-system"
                class="text-primary text-decoration-none font-weight-medium"
                target="_blank"
                >separately</a
              >
            </p>
          </div>
        </v-col>
        <v-col md="12" cols="12"></v-col>
        <v-col md="12" cols="12" class="pb-0">
          <v-row class="colSpacing justify-center">
            <v-col v-for="tech in techonlogy" lg="" md="3" sm="4" cols="6" :key="tech.link">
              <a target="_blank" :href="tech.link">
                <v-img :src="tech.image" alt="technology" cover></v-img>
              </a>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <div class="spacer pb-0"></div>
    <v-container fluid style="max-width: 100%">
      <Vue3Marquee :pause-on-hover="true" :clone="true" :duration="50">
        <h2 v-for="(word, index) in marqueeArray" :key="index" class="mx-8 my-2 text-h2 marqueeHover">
          {{ word }}
        </h2>
      </Vue3Marquee>
      <div class="mt-8">
        <Vue3Marquee :pause-on-hover="true" :clone="true" :duration="50" :direction="'reverse'">
          <h2 v-for="(word, index) in marqueeArray" :key="index" class="mx-8 my-2 text-h2 marqueeHover">
            {{ word }}
          </h2>
        </Vue3Marquee>
      </div>
    </v-container>
  </div>
</template>
<style lang="scss">
.colSpacing {
  > div {
    padding-inline: 20px;
    @media (max-width: 599px) {
      padding-inline: 10px;
    }
  }
}
.marqueeHover {
  opacity: 0.4;
  transition: 0.5s;
  cursor: pointer;
  &:hover {
    opacity: 1;
    transition: 0.5s;
  }
}
</style>
