<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { getWeeksOfMonth } from "@/helpers/dateTimeHelper";
import { createFormSchema } from "@/form-schemas/addMonthlyDataFormSchema";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";
import { monthlyDataService } from "@/services/monthlyDataService";
import { worshipServiceService } from "@/services/worshipServiceService";
import { currencyService } from "@/services/currencyService";

const formSchema = createFormSchema();
const defaultData = ref({});
const currencyInfo = ref({});
const options = ref({
  services: [],
});
const editData = ref({});
const props = withDefaults(
  defineProps<{
    churchId: number;
    year: number;
    weekNumber: number;
    isFirstTab: Boolean;
    isLastTab: Boolean;
    hasReportData: Boolean;
  }>(),
  {
    isFirstTab: false,
    isLastTab: false,
    hasReportData: false,
  },
);
const emit = defineEmits(["back", "next"]);

const handleSubmit = async (formData) => {
  try {
    await monthlyDataService.update([
      {
        ...formData,
        church_id: props.churchId,
        year: props.year,
        week_number: props.weekNumber,
      },
    ]);

    emit("next");
  } catch (e) {
    console.log("error", e);
  }
};

const fetchWorshipServices = async () => {
  try {
    options.value.services = await worshipServiceService.getListByChurch(props.churchId);
  } catch (e) {
    console.log("error", e);
  }
};

const fetchCurrencyRate = async () => {
  try {
    currencyInfo.value = await currencyService.getCurrencyOfChurch(props.churchId);
  } catch (e) {
    console.log("Error fetching currency rate:", e);
  }
};

const fetchEditData = async (churchId, year, weekNumber) => {
  try {
    editData.value = await monthlyDataService.getOne(props.churchId, props.year, props.weekNumber);
  } catch (e) {
    console.log("error", e);
  }
};

onMounted(() => {
  if (props.hasReportData) {
    fetchEditData(props.churchId, props.year, props.weekNumber);
  }
  fetchWorshipServices();
  fetchCurrencyRate();
});
</script>

<template>
  <DynamicFormDefault
    :form-schema="formSchema"
    :options="options"
    :meta="{
      churchId: props.churchId,
      year: props.year,
      weekNumber: props.weekNumber,
      localCurrencyCode: currencyInfo?.three_letter_code,
      usdRate: currencyInfo?.usd_to_local_currency,
    }"
    :init-data="editData"
    @submit="handleSubmit"
  >
    <template #actions="{ submit }">
      <div class="d-flex justify-space-between">
        <v-btn
          variant="outlined"
          size="large"
          class="px-8"
          @click="$emit('back')"
          v-if="!isFirstTab"
        >
          Back
        </v-btn>

        <v-spacer />

        <v-btn
          color="primary"
          size="large"
          class="px-8"
          @click="submit"
        >
          {{ isLastTab ? "Finish" : "Save & Next" }}
        </v-btn>
      </div>
    </template>
  </DynamicFormDefault>
</template>

<style scoped lang="scss"></style>
