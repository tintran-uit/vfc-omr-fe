<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import CardHeader from "@/components/shared/CardHeader.vue";
import CountrySelectInput from "@/components/input/CountrySelectInput.vue";
import CitySelectInput from "@/components/input/CitySelectInput.vue";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";
import { createRelatingRequestFormSchema } from "@/form-schemas/relatingRequestFormSchema";
import { relatingService, type ChurchExistsResult } from "@/services/relatingService";
import { supportService } from "@/services/supportService";
import { useAuthStore } from "@/stores/authStore";
import { useCountryStore } from "@/stores/countryStore";
import { useMessageStore } from "@/stores/messageStore";
import { extractApiError } from "@/utils/formErrors";

defineOptions({ name: "SearchRelatingPage" });

const { t } = useI18n();
const authStore = useAuthStore();
const countryStore = useCountryStore();
const messageStore = useMessageStore();

const countryId = ref<number | string | null>(null);
const cityId = ref<number | string | null>(null);
const hasSearched = ref(false);
const isSearching = ref(false);
const isSubmitting = ref(false);
const searchResult = ref<ChurchExistsResult | null>(null);
const formRef = ref<InstanceType<typeof DynamicFormDefault> | null>(null);

const formSchema = createRelatingRequestFormSchema(() => ({
  name: authStore.fullName || "",
  email: String(authStore.user?.email ?? ""),
  subject: "",
  message: searchResult.value?.form_required_message || "",
}));

const canSearch = computed(
  () =>
    countryId.value !== null &&
    countryId.value !== "" &&
    cityId.value !== null &&
    cityId.value !== "",
);

const requestFormInitData = computed(() => {
  if (!searchResult.value?.exists) return null;
  return {
    name: authStore.fullName || "",
    email: String(authStore.user?.email ?? ""),
    subject: "",
    message: searchResult.value.form_required_message || "",
  };
});

watch(countryId, () => {
  cityId.value = null;
});

async function runSearch() {
  if (!canSearch.value || isSearching.value) return;

  try {
    isSearching.value = true;
    searchResult.value = await relatingService.checkChurchExists(
      countryId.value!,
      cityId.value!,
    );
    hasSearched.value = true;
  } catch (e) {
    console.error("relating search", e);
    messageStore.error(t("genericSaveError"));
    hasSearched.value = false;
    searchResult.value = null;
  } finally {
    isSearching.value = false;
  }
}

async function handleSubmit(formData: Record<string, unknown>) {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    await supportService.submit({
      name: String(formData.name ?? ""),
      email: String(formData.email ?? ""),
      subject: String(formData.subject ?? ""),
      message: String(formData.message ?? ""),
    });
    messageStore.info(t("relating.submitSuccess"));
    countryId.value = null;
    cityId.value = null;
    hasSearched.value = false;
    searchResult.value = null;
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t("genericSaveError"));
    }
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  void countryStore.fetchForOptions();
});
</script>

<template>
  <div>
    <v-row class="my-2">
      <v-col cols="12" md="6" class="d-flex align-center">
        <div class="text-h4 font-weight-medium">
          {{ $t("relating.searchTitle") }}
        </div>
      </v-col>
    </v-row>

    <v-card variant="outlined" class="bg-surface mb-4">
      <v-card-text class="pa-5">
        <v-row>
          <v-col cols="12" md="6">
            <v-label class="mb-1 d-block">{{ $t("relating.labelCountry") }}</v-label>
            <CountrySelectInput
              v-model="countryId"
              density="compact"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="mb-1 d-block">{{ $t("relating.labelCity") }}</v-label>
            <CitySelectInput
              v-model="cityId"
              :country-id="countryId"
              :allow-add="false"
              density="compact"
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <div class="d-flex justify-end mt-4">
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!canSearch"
            :loading="isSearching"
            @click="runSearch"
          >
            {{ $t("relating.runSearch") }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <CardHeader v-if="hasSearched" :title="$t('relating.searchResultTitle')">
      <div class="pa-5">
        <p
          v-if="searchResult?.exists && searchResult.message"
          class="text-body-1 text-medium-emphasis relating-intro mb-6"
        >
          {{ searchResult.message }}
        </p>

        <p
          v-if="searchResult && !searchResult.exists"
          class="text-body-1 mb-0"
        >
          {{ $t("relating.noChurchInLocation") }}
        </p>

        <DynamicFormDefault
          v-else-if="searchResult?.exists"
          ref="formRef"
          form-only
          hide-form-header
          :form-schema="formSchema"
          :init-data="requestFormInitData"
          @submit="handleSubmit"
        >
          <template #actions="{ submit }">
            <v-row class="mt-4">
              <v-col cols="12" class="text-end">
                <v-btn
                  type="button"
                  color="primary"
                  variant="flat"
                  :loading="isSubmitting"
                  :disabled="isSubmitting"
                  class="px-6"
                  @click="submit"
                >
                  {{ $t("relating.requestMoreInfo") }}
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </DynamicFormDefault>
      </div>
    </CardHeader>
  </div>
</template>

<style scoped lang="scss">
.relating-intro {
  width: 100%;
  max-width: 100%;
  white-space: pre-line;
}
</style>
