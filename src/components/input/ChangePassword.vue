<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { createFormSchema as createWithNoOldPasswordSchema } from '@/form-schemas/changePasswordFormSchema';
import { createFormSchema as createWithOldPasswordSchema } from '@/form-schemas/changePasswordWithOldPasswordFormSchema';
import { useAuthStore } from '@/stores/authStore';
import { userService } from '@/services/userService';
import { useMessageStore } from '@/stores/messageStore';

const authStore = useAuthStore();
const dialog = ref(false)
const messageStore = useMessageStore()
const formSchema = computed(() => {
  if (authStore.can('user.password-reset')) {
    return createWithNoOldPasswordSchema();
  }

  return createWithOldPasswordSchema();
})
const props = withDefaults(
  defineProps<{
    userId: int
  }>(),
  {

  }
)
const handleSubmit = (data) => {
  try {
    userService.changePassword(
      props.userId,
      data
    )

    dialog.value = false;
    messageStore.info('Password changed successfully!');
  } catch (e) {

  }
  
}

const handleCancel = () => {
  dialog.value = false;
}

const { t } = useI18n()
</script>

<template>
  <v-btn
    color="primary"
    variant="tonal"
    class="text-none"
    @click="dialog = true"
  >
    <v-icon start>$lock</v-icon>
    {{ $t('user.changePassword') }}
  </v-btn>
    
    
  <v-dialog
    v-model="dialog"
    max-width="480"
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h3">
          {{ $t('user.changePassword') }}
        </span>
        <v-btn
          icon
          variant="text"
          @click="dialog = false"
        >
          <v-icon>$close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <DynamicFormDefault
          v-if="dialog"
          hide-form-header
          form-only
          show-cancel
          :form-schema="formSchema"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">

</style>