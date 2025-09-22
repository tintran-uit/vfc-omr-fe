<script setup lang="ts">
import { ref } from 'vue';
// icons
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/stores/authStore';
import { Form } from 'vee-validate';
import TranslationOutlined from '@ant-design/icons-vue/TranslationOutlined'
import LanguageDD from '@/layouts/dashboard/vertical-header/LanguageDD.vue'

const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
const password = ref('password123');
const username = ref('hai03');
// Password validation rules
const passwordRules = ref([
  (v: string) => !!v || 'Password is required',
  (v: string) => v === v.trim() || 'Password cannot start or end with spaces',
  // (v: string) => v.length <= 10 || 'Password must be less than 10 characters'
]);
// Email validation rules
const emailRules = ref([
  (v: string) => !!v.trim() || 'E-mail is required',
  (v: string) => {
    const trimmedEmail = v.trim();
    return !/\s/.test(trimmedEmail) || 'E-mail must not contain spaces';
  },
  (v: string) => /.+@.+\..+/.test(v.trim()) || 'E-mail must be valid'
]);

/* eslint-disable @typescript-eslint/no-explicit-any */
function validate(values: any, { setErrors }: any) {
  // Trim the username before validation
  const trimmedUsername = username.value.trim();

  // Update the username with trimmed value
  username.value = trimmedUsername;

  const authStore = useAuthStore();
  return authStore.login(trimmedUsername, password.value).catch((error) => setErrors({ apiError: error }));
}
</script>

<template>
  <!-- <div class="d-flex justify-space-between align-center">
    <h3 class="text-h3 text-center mb-0">Login</h3>
  </div> -->
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <div class="mb-6">
      <v-label>{{ $t('login.emailPlaceholder') }}</v-label>
      <v-text-field
        aria-label="email address"
        v-model="username"
        class="mt-2"
        required
        hide-details="auto"
        variant="outlined"
        color="primary"
        @input="username"
      ></v-text-field>
    </div>
    <div>
      <v-label>{{$t('login.passwordPlaceholder')}}</v-label>
      <v-text-field
        aria-label="password"
        v-model="password"
        :rules="passwordRules"
        required
        variant="outlined"
        color="primary"
        hide-details="auto"
        :type="show1 ? 'text' : 'password'"
        class="mt-2"
        @input="password"
      >
        <template v-slot:append-inner>
          <v-btn color="secondary" icon rounded variant="text">
            <EyeInvisibleOutlined :style="{ color: 'rgb(var(--v-theme-secondary))' }" v-if="show1 == false" @click="show1 = !show1" />
            <EyeOutlined :style="{ color: 'rgb(var(--v-theme-secondary))' }" v-if="show1 == true" @click="show1 = !show1" />
          </v-btn>
        </template>
      </v-text-field>
    </div>

    <!-- <div class="d-flex align-center mt-4 mb-7 mb-sm-0">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v: any) => !!v || 'You must agree to continue!']"
        label="Keep me sign in"
        required
        color="primary"
        class="ms-n2"
        hide-details
      ></v-checkbox>
    </div> -->
    <v-btn color="primary" :loading="isSubmitting" block class="mt-5" variant="flat" size="large" :disabled="valid" type="submit">
      {{ $t('login.signIn') }}</v-btn
    >
    
    <div class="text-right mt-5">
      <a href="#" class="forgot-link text-primary">
        {{ $t('login.forgotPassword') }}
      </a>
    </div>

    <!-- Language switcher -->
    <div class="d-flex justify-end mb-4 mt-4">
      <v-menu :close-on-content-click="true" location="bottom" offset="6, 80">
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            class="ms-sm-2 ms-1"
            color="greyText"
            rounded="sm"
            size="small"
            v-bind="props"
          >
            <TranslationOutlined :style="{ fontSize: '16px' }" />
          </v-btn>
        </template>
        <v-sheet rounded="md" width="200">
          <LanguageDD />
        </v-sheet>
      </v-menu>
    </div>
    <!-- #Language switcher -->

    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ $t('Wrong username or password') }}</v-alert>
    </div>
  </Form>
</template>
<style lang="scss">
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
  .v-field--appended {
    padding-inline-end: 0;
  }
}
</style>
