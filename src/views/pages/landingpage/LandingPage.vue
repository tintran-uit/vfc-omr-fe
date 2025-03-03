<script setup lang="ts">
import Appbar from './Components/AppBarMenu.vue';
import HomeBanner from './Components/HomeBanner.vue';
import Features from './Components/FeatureSection.vue';
import Demos from './Components/DemoSection.vue';
import CallToAction from './Components/CallToAction.vue';
import Footer from './Components/FooterSection.vue';
import 'aos/dist/aos.css';
import { onMounted } from 'vue';
import AOS from 'aos';
import NumberBlock from './Components/NumberBlock.vue';
import BrowserBlock from './Components/BrowserBlock.vue';
import ElementBlock from './Components/ElementBlock.vue';
import Technology from './Components/TechnologySection.vue';
import Testimonial from './Components/TestimonialSection.vue';

onMounted(() => {
  AOS.init();
});
</script>

<template>
  <v-layout class="bg-containerBg">
    <Appbar />
    <v-main class="ma-0">
      <HomeBanner />
      <Features />
      <Demos />
      <CallToAction />
      <NumberBlock />
      <BrowserBlock />
      <ElementBlock />
      <Technology />
      <Testimonial />
      <Footer />
    </v-main>
  </v-layout>
</template>
