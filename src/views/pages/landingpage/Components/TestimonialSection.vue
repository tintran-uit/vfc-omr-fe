<script setup lang="ts">
import { ref } from 'vue';

import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';

type slideType = {
  title: string;
  description: string;
  client: string;
  ratings: number;
};

const slides = ref<slideType[]>([
  {
    title: 'Design Quality',
    ratings: 5,
    description:
      'One of the better themes Ive used. Beautiful and clean design. Also included a NextJS project which is pretty rare in what Ive seen on MUI templates. Ultimately it didnt work out for my specific use case, but this is a well organized theme. Definitely keeping it in mind for future projects.',
    client: 'William S.'
  },
  {
    title: 'Customizability',
    ratings: 5,
    description:
      'Excellent design, you can use in a new project or include in your current project. Multiple components for any use. Good code quality. Great customer service and support.',
    client: 'Rodrigo J.'
  },
  {
    title: 'Design Quality',
    ratings: 4,
    description: 'there is no mistake, great design and organized code, thank you ...',
    client: 'Yang Z.'
  },
  {
    title: 'Code Quality',
    ratings: 5,
    description:
      'Fantastic design and good code quality. Its a great starting point for any new project. They provide plenty of premade components, page views, and authentication options. Definitely the best Ive found for Material UI in Typescript',
    client: 'Felipe F.'
  },
  {
    title: 'Code Quality',
    ratings: 5,
    description:
      'Great template. Very well written code and good structure. Very customizable and tons of nice components. Good documentation. Team is very responsive too.',
    client: 'Besart M.'
  },
  {
    title: 'Code Quality',
    ratings: 5,
    description:
      'We are just getting started with this new theme, but we liked it enough that we decided to import our application into this codebase rather than the other way around. Impressive number of custom components and original work VS some other themes that seem to just be repackaged versions of Material UI.',
    client: 'Oxbird'
  },
  {
    title: 'Design Quality',
    ratings: 4,
    description: 'there is no mistake, great design and organized code, thank you ...',
    client: 'Yang Z.'
  },
  {
    title: 'Code Quality',
    ratings: 5,
    description:
      'Fantastic design and good code quality. Its a great starting point for any new project. They provide plenty of premade components, page views, and authentication options. Definitely the best Ive found for Material UI in Typescript',
    client: 'Felipe F.'
  },
  {
    title: 'Code Quality',
    ratings: 5,
    description:
      'Great template. Very well written code and good structure. Very customizable and tons of nice components. Good documentation. Team is very responsive too.',
    client: 'Besart M.'
  },
  {
    title: 'Code Quality',
    ratings: 5,
    description:
      'We are just getting started with this new theme, but we liked it enough that we decided to import our application into this codebase rather than the other way around. Impressive number of custom components and original work VS some other themes that seem to just be repackaged versions of Material UI.',
    client: 'Oxbird'
  }
]);

const settings = {
  itemsToShow: 3.95
};

const breakpoints = {
  0: {
    itemsToShow: 1,
    snapAlign: 'start'
  },
  768: {
    itemsToShow: 1,
    snapAlign: 'start'
  },
  900: {
    itemsToShow: 2,
    snapAlign: 'start'
  },
  1100: {
    itemsToShow: 3,
    snapAlign: 'start'
  },
  // 1660 and up
  1660: {
    itemsToShow: 3.95,
    snapAlign: 'start'
  }
};
</script>

<template>
  <div class="spacer pt-0">
    <v-container class="maxWidth">
      <v-row class="justify-center">
        <v-col md="6" cols="12">
          <div class="text-center">
            <h6 class="text-subtitle-1 text-primary">Testament</h6>
            <h2 class="text-h2 mt-2 mb-4">Customers Voice</h2>
            <p class="text-h6 mb-0">
              We have proven records in Dashboard development with an average 4.9/5 ratings. We are glad to show such a warm reveiws from
              our loyal customers.
            </p>
          </div>
        </v-col>
        <v-col md="12"></v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col>
          <Carousel
            aria-hidden="true"
            v-bind="settings"
            :breakpoints="breakpoints"
            class="testimonial"
            :items-to-scroll="1"
            :autoplay="4000"
            :wrap-around="true"
            :transition="100"
          >
            <Slide v-for="(slide, i) in slides" :key="i" :variable-width="true" aria-hidden="true">
              <div class="carousel__item" aria-hidden="true">
                <v-card class="bg-surface pa-6" variant="outlined">
                  <div class="d-flex">
                    <v-avatar size="40" variant="flat">
                      <img src="@/assets/images/landing/logo.svg" width="40" alt="logo" />
                    </v-avatar>
                    <div class="text-start pl-2">
                      <h5 class="text-h5 mb-0">{{ slide.title }}</h5>
                      <v-rating readonly :length="5" :size="25" color="lightText" :model-value="slide.ratings" active-color="warning" />
                      <p class="text-lightText text-h6 mb-0 mt-2">{{ slide.description }}</p>
                      <h6 class="text-subtitle-2 mt-2">{{ slide.client }}</h6>
                    </div>
                  </div>
                </v-card>
              </div>
            </Slide>
          </Carousel>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div class="spacer pb-0 d-md-block d-none"></div>
</template>
<style lang="scss">
.testimonial {
  .carousel__track {
    align-items: flex-start;
  }
  .carousel__slide {
    padding-inline: 8px;
  }
}
</style>
