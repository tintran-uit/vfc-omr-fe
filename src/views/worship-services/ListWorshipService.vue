<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { worshipServiceService } from '@/services/worshipServiceService';
import { churchService } from '@/services/churchService';
import tableSchema from '@/table-schemas/worshipServiceTableSchema';
import { useI18n } from 'vue-i18n';
import DataTable from '@/components/tables/DataTable.vue';
import TablePageShell from "@/components/shared/TablePageShell.vue";
import TableSearchBox from "@/components/tables/TableSearchBox.vue";

const router = useRouter()
const route = useRoute()
const {t} = useI18n();
const items = ref([])
const church = ref(null)
const searches = ref([])
const page = ref(1)
const itemsPerPage = ref(25)
const sortBy = ref([{ key: 'id', order: 'desc' }])
const churchId = computed(() => route.params.churchId)
const fetchData = async function (churchId) {
  const data = await worshipServiceService.getListByChurch(
    churchId
  )
  items.value = data;
}

const fetchChurchDetail = async (churchId) => {
  church.value = await churchService.getById(churchId)
}

const onEdit = (item: unknown) => {
  const it = item as { id: number | string }
  router.push({ name: 'WorshipServiceEdit', params: { churchId: churchId.value, id: it.id } })
}

const onDelete = async (item: unknown) => {
  const it = item as { id: number | string }
  await worshipServiceService.del(it.id)

  fetchData(churchId.value)
}

const onSearch = () => {
  page.value = 1
}

watch(
  () => churchId.value,
  async (id) => {
    if (!id) return
    fetchChurchDetail(id)
    fetchData(id)
  },
  { immediate: true }
)
</script>

<template>
  <TablePageShell :title="t('worshipService.listTitle', { churchName: church?.name })">
    <template #header-right>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
        @search="onSearch"
      />

      <v-btn 
        color="primary" 
        variant="outlined" 
        @click="router.push({ name: 'WorshipServiceAdd' })"
      >
        <v-icon>$plus</v-icon> {{ $t('addNew') }}
      </v-btn>
    </template>

    <DataTable
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      v-model:searches="searches"
      :headers="tableSchema.headers"
      :items="items"
      :enabled-actions="['edit', 'delete']"
      @action:delete="onDelete"
      @action:edit="onEdit"
    />
  </TablePageShell>
</template>

<style scoped lang="scss">

</style>