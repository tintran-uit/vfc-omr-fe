<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import FormPageShell from "@/components/shared/FormPageShell.vue";
import EventTypeForm from "@/views/event-types/EventTypeForm.vue";
import { eventTypesService, type EventTypePayload } from "@/services/eventTypesService";

const router = useRouter();
const pending = ref(false);

async function handleSubmit(payload: EventTypePayload) {
  pending.value = true;
  try {
    await eventTypesService.create(payload);
    router.push({ name: "EventTypeList" });
  } catch (error) {
    console.error(error);
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <FormPageShell
    title-key="eventType.addTitle"
    :back-url="{ name: 'EventTypeList' }"
  >
    <EventTypeForm
      :pending="pending"
      @submit="handleSubmit"
    />
  </FormPageShell>
</template>
