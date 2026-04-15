<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import NumberInput from "@/components/input/NumberInput.vue";

const modelValue = defineModel<any[]>();

const props = defineProps<{
  services: any[];
  label?: string;
}>();

/**
 * Local state
 */
const modelServices = ref<any[]>([]);

/**
 * Map service để lấy name nhanh
 */
const servicesMap = computed(() => {
  if (!props.services?.length) return new Map();
  return new Map(props.services.map((service) => [service.id, service]));
});

/**
 * Build data (dùng chung cho watch + mounted)
 */
const buildModelServices = (services: any[], model: any[]) => {
  const modelMap = model?.length ? new Map(model.map((i) => [i.id, i])) : new Map();

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

    modelServices.value = buildModelServices(services, model);
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
    <h3 class="text-h6 font-weight-bold">
      {{ servicesMap.get(item.id)?.name }} @ {{ servicesMap.get(item.id)?.time }}
    </h3>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-label class="mb-1">Adults</v-label>
        <NumberInput
          v-model="modelServices[index].attendance.adult_attendance"
          required
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-label class="mb-1">Youth [13-18]</v-label>
        <NumberInput v-model="modelServices[index].attendance.youth_attendance" />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-label class="mb-1">Children [0-12]</v-label>
        <NumberInput v-model="modelServices[index].attendance.child_attendance" />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-label class="mb-1">Total</v-label>
        <NumberInput
          :model-value="serviceTotals[index]"
          readonly
          disabled
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-label class="mb-1"> No of Classes / Services for Children </v-label>
        <NumberInput v-model="modelServices[index].attendance.number_of_service_for_children" />
      </v-col>
    </v-row>
  </template>
</template>

<style scoped lang="scss"></style>
