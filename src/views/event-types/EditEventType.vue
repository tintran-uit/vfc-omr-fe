<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import FormPageShell from "@/components/shared/FormPageShell.vue";
import EventTypeForm from "@/views/event-types/EventTypeForm.vue";
import {
  eventTypesService,
  type EventTypePayload,
} from "@/services/eventTypesService";
const route = useRoute();
const router = useRouter();
const pending = ref(false);
const initial = ref<Partial<EventTypePayload> | null>(null);
const id = computed(() => route.params.id);

async function load() {
  const data = await eventTypesService.get(id.value as string);
  const record = data?.id != null ? data : data?.data;
  initial.value = {
    name: record?.name ?? "",
    color: record?.color ?? "",
    cell_color: record?.cell_color ?? "",
    meeting_type: record?.meeting_type ?? "",
  };
}

async function handleSubmit(payload: EventTypePayload) {
  pending.value = true;
  try {
    await eventTypesService.update(id.value as string, payload);
    router.push({ name: "EventTypeList" });
  } catch (error) {
    console.error(error);
  } finally {
    pending.value = false;
  }
}

onMounted(() => {
  load().catch((error) => console.error(error));
});
</script>

<template>
  <FormPageShell
    :title="$t('eventType.editTitle')"
    :back-url="{ name: 'EventTypeList' }"
  >
    <EventTypeForm
      v-if="initial"
      :initial="initial"
      :pending="pending"
      @submit="handleSubmit"
    />
  </FormPageShell>
</template>
