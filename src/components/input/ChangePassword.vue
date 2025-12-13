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
  if (authStore.isRoleAdmin() || authStore.isRoleSuperAdmin()) {
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
  <div>
    <v-btn @click="dialog = true">Change password</v-btn>
  </div>
    
    
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="text-h3">
        Change Password
      </v-card-title>

      <v-card-text>
        <DynamicFormDefault
            :form-schema="formSchema"
            @submit="handleSubmit"
            @cancel="handleCancel"
            :break-line="true"
          />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">

</style>