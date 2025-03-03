<script setup lang="ts">
import { ImgComparisonSlider } from '@img-comparison-slider/vue';

import lightImage from '@/assets/images/landing/default-light.jpg';
import darkImage from '@/assets/images/landing/default-dark.jpg';
</script>
<template>
  <ImgComparisonSlider style="width: 100%; outline: unset">
    <!-- eslint-disable -->
    <img slot="first" style="width: 100%" :src="darkImage" alt="dark" />
    <img slot="second" style="width: 100%" :src="lightImage" alt="light" />
    <div
      slot="handle"
      class="handle d-flex align-center ga-2 justify-center"
      style="padding: 10px; background: #fff; box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 7px; border-radius: 100%"
    >
      <div
        style="width: 0px; height: 0px; border-top: 8px solid transparent; border-right: 10px solid; border-bottom: 8px solid transparent"
      ></div>
      <div
        style="
          width: 0px;
          height: 0px;
          border-top: 8px solid transparent;
          border-right: 10px solid;
          border-bottom: 8px solid transparent;
          transform: rotate(180deg);
        "
      ></div>
    </div>
    <!-- eslint-enable -->
  </ImgComparisonSlider>
</template>
<style lang="scss">
.handle {
  width: 56px;
  height: 56px;
  @media (max-width: 600px) {
    width: 45px;
    height: 45px;
  }
}
</style>
