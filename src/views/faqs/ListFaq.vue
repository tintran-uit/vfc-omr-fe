<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/authStore";
import { useDialogStore } from "@/stores/dialogStore";
import { faqService } from "@/services/faqService";
import DataTable from "@/components/tables/DataTable.vue";
import tableSchema from "@/table-schemas/faqTableSchema";
import TablePageShell from "@/components/shared/TablePageShell.vue";
import TableSearchBox from "@/components/tables/TableSearchBox.vue";

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const dialogStore = useDialogStore();

const items = ref<unknown[]>([]);
const searches = ref<Array<{ key: string; value: unknown }>>([]);
const page = ref(1);
const itemsPerPage = ref(25);
const sortBy = ref([{ key: "id", order: "desc" as const }]);

const fetchData = async () => {
  items.value = await faqService.list({});
};

const onEdit = (item: unknown) => {
  const it = item as { id: number | string };
  void router.push({ name: "FaqEdit", params: { id: String(it.id) } });
};

const onDelete = async (item: unknown) => {
  const it = item as { id: number | string };
  if (!(await dialogStore.confirm(t("areYouSureWantToDelete")))) return;
  await faqService.del(it.id);
  await fetchData();
};

const onSearch = () => {
  page.value = 1;
};

onMounted(() => {
  void fetchData();
});
</script>

<template>
  <TablePageShell title-key="faq.listTitle">
    <template #header-right>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
        @search="onSearch"
      />
      <v-btn
        v-if="authStore.can('faq.create')"
        color="primary"
        variant="outlined"
        @click="router.push({ name: 'FaqAdd' })"
      >
        <v-icon>$plus</v-icon> {{ $t("addNew") }}
      </v-btn>
    </template>

    <DataTable
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      v-model:searches="searches"
      :headers="tableSchema.headers"
      :items="items"
      :enabled-actions="[]"
    >
      <template #item.question_header="{ item }">
        <RouterLink
          class="text-primary text-decoration-none"
          :to="{ name: 'FaqDetail', params: { id: String(item.id) } }"
        >
          {{ item.question_header }}
        </RouterLink>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex ga-2 text-no-wrap">
          <v-tooltip v-if="authStore.can('faq.update')" :text="t('dataTable.buttonEditTitle')">
            <template #activator="{ props: tip }">
              <v-btn
                v-bind="tip"
                icon="$edit"
                size="x-small"
                @click="onEdit(item)"
              />
            </template>
          </v-tooltip>
          <v-tooltip v-if="authStore.can('faq.delete')" :text="t('dataTable.buttonDeleteTitle')">
            <template #activator="{ props: tip }">
              <v-btn
                v-bind="tip"
                icon="$delete"
                size="x-small"
                @click="onDelete(item)"
              />
            </template>
          </v-tooltip>
        </div>
      </template>
    </DataTable>
  </TablePageShell>
</template>
