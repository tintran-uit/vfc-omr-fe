<script setup>
import AuthLogin from '../authForms/AuthLogin.vue';
import AuthFooter from './AuthFooter.vue';

import { createApp } from 'vue';
import { VueReCaptcha, useReCaptcha } from 'vue-recaptcha-v3';

const component = {
  setup() {
    const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

    const recaptcha = async () => {
      // (optional) Wait until recaptcha has been loaded.
      await recaptchaLoaded();

      // Execute reCAPTCHA with action "login".
      // Removed the assignment of token since it's not being used
      await executeRecaptcha('login');

      // Do stuff with the received token.
    };

    return {
      recaptcha
    };
  },
  template: '<button @click="recaptcha">Execute recaptcha</button>'
};

createApp(component).use(VueReCaptcha, { siteKey: '6LeCprcaAAAAAOD0aEK7WpfHc__CyRmk3rD-otNt' });
</script>

<template>
  <v-row class="bg-containerBg position-relative" no-gutters>
    <!---Login Part-->
    <v-col cols="12" lg="12" class="d-flex align-center">
      <v-container>
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 148px)">
          <v-row justify="center">
            <v-col cols="12" md="12">
              <v-card elevation="0" class="loginBox">
                <v-card elevation="24">
                  <v-card-text class="pa-sm-10 pa-6">
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
  </v-row>
</template>
<style lang="scss">
.loginBox {
  max-width: 475px;
  margin: 0 auto;
}
</style>
