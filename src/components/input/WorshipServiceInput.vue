<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import NumberInput from "@/components/input/NumberInput.vue";

const { t } = useI18n();

/** Required; allows 0 (number or string "0") but not empty/null/whitespace */
const adultRequiredRules = [
  (v: unknown) =>
    (v !== null && v !== undefined && String(v).trim() !== "") ||
    t("validation.required", { field: t("monthlyData.labelAdults") }),
];

type WorshipServiceApi = {
  id: number;
  name: string;
  time?: string;
};

type WorshipAttendanceModel = {
  adult_attendance: number | string | null;
  youth_attendance: number | string | null;
  child_attendance: number | string | null;
  number_of_service_for_children: number | string | null;
};

type WorshipServiceRowModel = {
  id: number;
  attendance: WorshipAttendanceModel;
};

const modelValue = defineModel<WorshipServiceRowModel[]>({ default: () => [] });

const props = defineProps<{
  services: WorshipServiceApi[];
  label?: string;
}>();

/**
 * Local state
 */
const modelServices = ref<WorshipServiceRowModel[]>([]);

/**
 * Map service để lấy name nhanh
 */
const servicesMap = computed(() => {
  if (!props.services?.length) return new Map<number, WorshipServiceApi>();
  return new Map(props.services.map((service) => [service.id, service]));
});

/**
 * Build data (dùng chung cho watch + mounted)
 */
const buildModelServices = (
  services: WorshipServiceApi[],
  model: WorshipServiceRowModel[] | undefined | null,
): WorshipServiceRowModel[] => {
  const modelMap = model?.length
    ? new Map<number, WorshipServiceRowModel>(model.map((i) => [i.id, i]))
    : new Map<number, WorshipServiceRowModel>();

  return services.map((service) => {
    const existing = modelMap.get(service.id);

    return {
      id: service.id,
      attendance: {
        adult_attendance: existing?.attendance?.adult_attendance ?? null,
        youth_attendance: existing?.attendance?.youth_attendance ?? null,
        child_attendance: existing?.attendance?.child_attendance ?? null,
        number_of_service_for_children:
          existing?.attendance?.number_of_service_for_children ?? null,
      },
    };
  });
};

/**
 * INIT khi mounted
 */
onMounted(() => {
  if (!props.services?.length) return;

  // chỉ init khi parent chưa có data
  if (!modelValue.value?.length) {
    const initData = buildModelServices(props.services, []);

    modelServices.value = initData;
    modelValue.value = initData;
  }
});

/**
 * Sync từ props + modelValue -> local state
 */
watch(
  [() => props.services, () => modelValue.value],
  ([services, model]) => {
    if (!services?.length) return;

    modelServices.value = buildModelServices(services, model ?? []);
  },
  { immediate: true },
);

/**
 * Sync ngược lại (có chặn loop)
 */
watch(
  modelServices,
  (val) => {
    const current = JSON.stringify(modelValue.value);
    const next = JSON.stringify(val);

    if (current !== next) {
      modelValue.value = val;
    }
  },
  { deep: true },
);

/**
 * Tổng attendance
 */
const serviceTotals = computed(() => {
  return modelServices.value.map((service) => {
    return (
      (service?.attendance?.adult_attendance || 0) +
      (service?.attendance?.youth_attendance || 0) +
      (service?.attendance?.child_attendance || 0)
    );
  });
});
</script>

<template>
  <template
    v-for="(item, index) in modelServices"
    :key="item.id"
  >
    <h3
      class="text-subtitle-1 font-weight-bold mb-1"
      :class="{ 'mt-3': index > 0 }"
    >
      {{ servicesMap.get(item.id)?.name }} @ {{ servicesMap.get(item.id)?.time }}
    </h3>

    <v-row
      dense
      class="ma-0"
    >
      <v-col
        cols="12"
        md="6"
        class="py-1"
      >
        <v-label class="mb-1 d-flex align-center flex-wrap">
          {{ t("monthlyData.labelAdults") }}
          <span class="text-error">*</span>
        </v-label>
        <NumberInput
          v-model="modelServices[index].attendance.adult_attendance"
          :rules="adultRequiredRules"
          hide-details="auto"
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="py-1"
      >
        <v-label class="mb-1">Youth [13-18]</v-label>
        <NumberInput
          v-model="modelServices[index].attendance.youth_attendance"
          hide-details
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="py-1"
      >
        <v-label class="mb-1">Children [0-12]</v-label>
        <NumberInput
          v-model="modelServices[index].attendance.child_attendance"
          hide-details
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="py-1"
      >
        <v-label class="mb-1">Total</v-label>
        <NumberInput
          :model-value="serviceTotals[index]"
          readonly
          disabled
          hide-details
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="py-1"
      >
        <v-label class="mb-1"> No of Classes / Services for Children </v-label>
        <NumberInput
          v-model="modelServices[index].attendance.number_of_service_for_children"
          hide-details
        />
      </v-col>
    </v-row>
  </template>
</template>

<style scoped lang="scss"></style>
