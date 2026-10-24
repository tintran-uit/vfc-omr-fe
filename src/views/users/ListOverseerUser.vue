<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {userService} from '@/services/userService.ts';
import DynamicTableDefault from "@/components/tables/DynamicTableDefault.vue";
import TablePageShell from "@/components/shared/TablePageShell.vue";
import TableSearchBox from "@/components/tables/TableSearchBox.vue";
import tableSchema from '@/table-schemas/overseerTableSchema.ts';
import { tableOptionsToParams } from '@/helpers/dataTableHelper.ts';

const items = ref([])
const page = ref(1)
const itemsPerPage = ref(25)
const totalItems = ref(0)
const searches = ref([])
const sortBy = ref([
  { key: 'id', order: 'desc' }
])

const fetchData = async function (options = {}) {
  const data = await userService.getOverseerList(
    tableOptionsToParams(options)
  )
  items.value = data.items;
  totalItems.value = data.total_pages;
}

const router = useRouter()

const onAssignOverseer = (item: { id?: number | string }) => {
  if (item?.id == null) return
  router.push({ name: "UserOverseerAssign", params: { id: item.id } })
}

const onUpdateOptions = (options) => {
  fetchData(options);
}

const buildOptions = () => {
  return {
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    searches: searches.value
  }
}

const onSearch = () => {
  fetchData(buildOptions())
}

const assignmentsOpen = ref(false)
const assignmentsName = ref('')
const assignmentsText = ref('')
const assignmentLines = computed(() =>
  assignmentsText.value.split(',').map((line) => line.trim()).filter(Boolean)
)

function openAssignments(item: { name?: string; pastor_of?: string }) {
  if (!item?.pastor_of) return
  assignmentsName.value = item.name || ''
  assignmentsText.value = String(item.pastor_of)
  assignmentsOpen.value = true
}
</script>

<template>
  <TablePageShell title-key="user.listOverseerTitle">
    <template #header-right>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
        @search="onSearch"
      />
    </template>

    <DynamicTableDefault
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:searches="searches"
      v-model:sort-by="sortBy"
      :hide-title="true"
      :hide-header="true"
      :total-items="totalItems"
      :headers="tableSchema.headers"
      :items="items"
      :enabled-actions="['assignOverseer']"
      @action:assignOverseer="onAssignOverseer"
      @update:options="onUpdateOptions"
    >
      <template v-slot:[`item.name`]="{ item }">
        <router-link
          class="dt-cell-link"
          :to="{ name: 'UserDetail', params: { id: item.id } }"
        >
          {{ item.name }}
        </router-link>
      </template>
      <template #item.pastor_of="{ item }">
        <span
          v-if="item.pastor_of"
          class="pastor-of-link"
          role="button"
          tabindex="0"
          @click="openAssignments(item)"
          @keydown.enter.prevent="openAssignments(item)"
        >
          {{ item.pastor_of }}
        </span>
        <span v-else>-</span>
      </template>
    </DynamicTableDefault>

    <v-dialog
      v-model="assignmentsOpen"
      max-width="520"
    >
      <v-card>
        <v-card-title class="text-h6">
          {{ assignmentsName }}
        </v-card-title>
        <v-card-text>
          <ul class="pastor-of-list">
            <li
              v-for="(line, index) in assignmentLines"
              :key="`${index}-${line}`"
            >
              {{ line }}
            </li>
          </ul>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="primary"
            variant="text"
            @click="assignmentsOpen = false"
          >
            {{ $t("close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </TablePageShell>
</template>

<style scoped lang="scss">
.pastor-of-link {
  cursor: pointer;
  color: rgb(var(--v-theme-primary));
}

.pastor-of-list {
  margin: 0;
  padding-left: 1.25rem;
}
</style>