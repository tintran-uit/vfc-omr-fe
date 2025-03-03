<script setup lang="ts">
// assets
import imageAction from '@/assets/images/landing/img-bg-screen.png';

// icons
import { DownloadOutlined } from '@ant-design/icons-vue';
</script>
<template>
  <div class="spacer bgAction position-relative text-sm-start text-center">
    <v-img :src="imageAction" alt="cover" cover class="ActionImage" />
    <v-container class="maxWidth">
      <v-row>
        <v-col cols="12" md="8">
          <div class="actionContent">
            <h2 class="text-white text-h2 mb-sm-11 mb-6">
              Check Mantis
              <span class="text-primary">Free </span>
              Version Before Purchase
            </h2>
            <v-btn color="primary" size="large" target="_" href="https://github.com/codedthemes/mantis-free-vuetify-vuejs-admin-template">
              <template v-slot:prepend>
                <DownloadOutlined />
              </template>
              Download Now
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<style lang="scss">
.bgAction {
  background: #141414;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    background: linear-gradient(329.36deg, rgb(0, 0, 0) 14.79%, rgba(67, 67, 67, 0.28) 64.86%);
  }
}
.ActionImage {
  width: 60%;
  object-fit: cover;
  position: absolute;
  top: 0;
  right: 0;
  @media (min-width: 1800px) {
    width: 75%;
  }
  [dir='rtl'] & {
    transform: scaleX(-1);
    right: unset;
    left: 0;
  }
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }
}
.actionContent {
  position: relative;
  z-index: 2;
}
</style>
