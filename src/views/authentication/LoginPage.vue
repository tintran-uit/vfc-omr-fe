<script setup lang="ts">
import AuthLogin from './authForms/AuthLogin.vue';
import logo from '@/assets/images/logo/logo.png'

import { ref } from "vue"
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
                      <v-img :src="logo" max-width="250" width="100%" class="mx-auto" />
                    </div>

                    <!-- Title -->
                    <h3 class="text-h2 text-center font-weight-bold mb-2 mt-5">
                      {{ $t('login.title') }}
                    </h3>

                    <!-- Subtitle -->
                    <p class="text-body-1 text-center text-medium-emphasis mb-6">
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
      </v-container>
    </v-col>
  </v-row>
</template>
<style lang="scss">
.loginBox {
  max-width: 475px;
  margin: 0 auto;
}
</style>
