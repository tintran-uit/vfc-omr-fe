<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { createFormSchema } from "@/form-schemas/editUserFormSchema";
import { userService as service } from "@/services/userService";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";
import ChangePassword from "@/components/input/ChangePassword.vue";
import ChangeEmail from "@/components/input/ChangeEmail.vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMessageStore } from "@/stores/messageStore";
import { extractApiError } from "@/utils/formErrors";
import {
  holdsMinisterialCredential,
  NO_MINISTERIAL_CREDENTIAL,
  normalizeCredentialPayload,
  withNoCredentialOption,
} from "@/helpers/userCredentials";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const messageStore = useMessageStore();
const options = ref({});
const id = route.params.id as string;
const editData = ref(null);
const formSchema = createFormSchema();
const formRef = ref();

async function loadOptions() {
  options.value = withNoCredentialOption(await service.getFormData());
}

async function fetchEditData(userId: string) {
  if (!userId) return;
  try {
    editData.value = await service.get(userId);
  } catch (e) {
    console.log("error", e);
  }
}

async function handleSubmit(formData: Record<string, unknown>) {
  try {
    await service.update(id, normalizeCredentialPayload(formData));
    router.push({ name: "UserList" });
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t("genericSaveError"));
    }
  }
}

const currentEmail = computed(() => {
  const data = editData.value as { email_address?: string } | null;
  return data?.email_address || "";
});

function onEmailChanged(email: string) {
  const data = editData.value as { email_address?: string } | null;
  if (data) data.email_address = email;
  formRef.value?.setFieldValue("email_address", email);
}

function mapperFn(source: Record<string, unknown>, destination: Record<string, unknown>) {
  destination.role_id = source.role ? (source.role as { id: number }).id : null;
  if (!holdsMinisterialCredential(destination.credentials)) {
    destination.credentials = NO_MINISTERIAL_CREDENTIAL;
  }
}

onMounted(() => {
  loadOptions();
  fetchEditData(id);
});
</script>

<template>
  <v-row class="my-2 align-center">
    <v-col
      cols="12"
      md="4"
      class="d-flex align-center"
    >
      <div class="text-h4 font-weight-medium">
        {{ $t("user.editTitle", { id }) }}
      </div>
    </v-col>
    <v-col
      cols="12"
      md="8"
    >
      <div class="d-flex flex-wrap justify-md-end ga-2">
        <ChangePassword :user-id="id" />
        <ChangeEmail
          :current-email="currentEmail"
          @saved="onEmailChanged"
        />
        <v-btn
          color="primary"
          variant="outlined"
          @click="router.push({ name: 'UserList' })"
        >
          <v-icon>$arrowLeft</v-icon>
          {{ $t("backToList") }}
        </v-btn>
      </div>
    </v-col>
  </v-row>

  <DynamicFormDefault
    ref="formRef"
    hide-form-header
    :options="options"
    :form-schema="formSchema"
    :init-data="editData"
    :mapper="mapperFn"
    @submit="handleSubmit"
  />
</template>
