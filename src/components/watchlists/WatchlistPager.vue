<script setup lang="ts">
import { computed } from "vue";

const page = defineModel<number>("page", { required: true });

const props = defineProps<{
  total: number;
  perPage: number;
}>();

const length = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)));

const from = computed(() => (props.total ? (page.value - 1) * props.perPage + 1 : 0));

const to = computed(() => Math.min(page.value * props.perPage, props.total));
</script>

<template>
  <v-row
    v-if="total"
    class="pa-4 align-center"
  >
    <v-col
      cols="12"
      md="6"
      class="d-flex align-center"
    >
      <span>{{ $t("pageText", { from, to, total }) }}</span>
    </v-col>
    <v-col
      cols="12"
      md="6"
      class="d-flex justify-md-end"
    >
      <v-pagination
        v-model="page"
        :length="length"
        :total-visible="5"
        density="comfortable"
      />
    </v-col>
  </v-row>
</template>
