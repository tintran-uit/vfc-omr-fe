<script setup lang="ts">
import { ref, watch, computed, inject } from "vue";
import CardHeader from "../shared/CardHeader.vue";
import tableSchema from "@/table-schemas/attachmentTableSchema";
import DynamicTableDefault from "@/components/tables/DynamicTableDefault.vue";
import { attachmentService } from "@/services/attachmentService";
import { tableOptionsToParams } from "@/helpers/dataTableHelper.ts";
import { useAuthStore } from "@/stores/authStore";
import { createFormSchema } from "@/form-schemas/addAttachmentFormSchema";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";

const props = withDefaults(
  defineProps<{
    churchId: number;
    title?: string;
  }>(),
  {
    title: "Attachments",
  },
);

const authStore = useAuthStore();
const churchDetail = inject("churchDetail");

const items = ref<any[]>([]);
const totalItems = ref(0);
const search = ref("");
const sortBy = ref([{ key: "id", order: "desc" as const }]);
const page = ref(1);
const itemsPerPage = ref(50);
const formRef = ref<InstanceType<typeof DynamicFormDefault> | null>(null);
/** Bump to remount the form so FileUploadInput clears fully after a successful add. */
const formKey = ref(0);

const actions = computed(() => {
  const next: string[] = [];
  if (authStore.isRoleAdmin || authStore.isRoleSuperAdmin) {
    next.push("delete");
  }
  return next;
});

const formSchema = createFormSchema();
const enableAddForm = computed(() => {
  return churchDetail.value?.pastor_id === authStore.user?.id;
});

function listParams() {
  return tableOptionsToParams({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    search: search.value,
  });
}

const fetchData = async function () {
  if (!props.churchId) return;

  const data = await attachmentService.getListByChurchId(
    props.churchId,
    listParams(),
    false,
  );
  items.value = data.items;
  totalItems.value = data.total_pages;
};

const handleSubmit = async (formData) => {
  try {
    await attachmentService.create(props.churchId, formData);

    formRef.value?.reset();
    formRef.value?.resetValidation();
    formRef.value?.clearServerErrors?.();
    formKey.value += 1;

    page.value = 1;
    await fetchData();
  } catch (e) {
    console.log("error", e);
  }
};

watch(
  () => props.churchId,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      page.value = 1;
      await fetchData();
    }
  },
  { immediate: true },
);

watch([page, itemsPerPage, sortBy, search], () => {
  void fetchData();
});
</script>

<template>
  <CardHeader :title="$t('attachment.dashboardTitle')">
    <template v-if="enableAddForm">
      <div class="px-5 pt-4 pb-5">
        <DynamicFormDefault
          :key="formKey"
          ref="formRef"
          :form-schema="formSchema"
          :form-only="true"
          hide-form-header
          inline-actions
          @submit="handleSubmit"
        >
          <template #actions>
            <v-btn
              type="submit"
              color="primary"
              variant="flat"
              class="attachment-add-form__save"
            >
              {{ $t("save") }}
            </v-btn>
          </template>
        </DynamicFormDefault>
      </div>
      <v-divider></v-divider>
    </template>
    <DynamicTableDefault
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:search="search"
      v-model:sort-by="sortBy"
      :total-items="totalItems"
      :headers="tableSchema.headers"
      :searches-config="tableSchema?.searches || []"
      :items="items"
      :enabled-actions="actions"
      :hide-header="true"
      :hide-title="true"
    >
      <template #item.fileDownload="{ item }">
        <a
          :href="item.path"
          target="_blank"
          >{{ item.attachment }}</a
        >
      </template>
    </DynamicTableDefault>
  </CardHeader>
</template>

<style scoped>
.attachment-add-form__save {
  width: 100%;
}

@media (min-width: 960px) {
  .attachment-add-form__save {
    width: auto;
  }
}
</style>
