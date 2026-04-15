<script setup lang="ts">
import AuthLogin from './authForms/AuthLogin.vue';
import logo from '@/assets/images/logo/logo.png'

import { ref, computed } from "vue"

const appName = import.meta.env.VITE_APP_NAME
const version = import.meta.env.VITE_APP_VERSION
const stage = import.meta.env.VITE_APP_STAGE

const versionLabel = computed(() => {
  return stage
    ? `${appName} version ${version} ${stage}`
    : `${appName} version ${version}`
})
</script>

<template>
<v-row class="bg-containerBg position-relative" no-gutters>
    <!-- Login Part -->
    <v-col cols="12" lg="12" class="d-flex align-center">
      <v-container>
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 148px)">
          <v-row justify="center">
            <v-col cols="12" md="12">
              <v-card elevation="0" class="loginBox">
                <v-card elevation="24">
                  <v-card-text class="pa-sm-10 pa-6">

                    <!-- Logo phía trên form -->
                    <div class="text-center mb-6">
                      <!-- Dùng component Logo -->
                      <Logo />

                      <!-- Hoặc dùng ảnh logo.png -->
                      <v-img :src="logo" max-width="150" class="mx-auto mt-5" />
                    </div>

                    <!-- Title -->
                    <h3 class="text-h2 text-center font-weight-bold mb-2 mt-5">
                      {{ $t('login.title') }}
                    </h3>

                    <!-- Subtitle -->
                    <p class="text-center text-medium-emphasis mb-6"  style="font-size: 1.1em">
                      {{ $t('login.subtitle') }}
                    </p>

                    <!---Login Form-->
                    <AuthLogin />
                    <!---Login Form-->
                  </v-card-text>
                </v-card>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>

    <!-- Footer -->
    <v-col cols="12">
      <v-container class="pt-0 pb-6">
        <!-- Footer -->
        <v-footer class="px-0 pt-2">
          <v-row justify="center" no-gutters>
            <v-col cols="12" md="6" class="text-md-start text-center">
              
            </v-col>
            <v-col class="d-flex flex-md-row flex-column justify-md-end align-center" cols="12" md="6">
              <p class="text-body-2 text-lightText font-italic mb-md-0 mb-4">
                {{ versionLabel }}
              </p>
            </v-col>
          </v-row>
        </v-footer>
      </v-container>
    </v-col>
  </v-row>
</template>
<style lang="scss">
.loginBox {
  max-width: 450px;
  margin: 0 auto;
}
</style>
