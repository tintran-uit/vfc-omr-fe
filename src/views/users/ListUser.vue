<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import {userService} from '@/services/userService.ts';
import DynamicTableDefault from "@/components/tables/DynamicTableDefault.vue";
import TablePageShell from "@/components/shared/TablePageShell.vue";
import TableSearchBox from "@/components/tables/TableSearchBox.vue";
import tableSchema from '@/table-schemas/userTableSchema.ts';
import { tableOptionsToParams } from '@/helpers/dataTableHelper.ts';
import { useAuthStore } from '@/stores/authStore';
import Avatar from '@/components/ui/Avatar.vue'
import defaultAvatar from '@/assets/images/users/avatar-default.svg';
import { useDialogStore } from '@/stores/dialogStore';
import { useI18n } from 'vue-i18n';

const dialogStore = useDialogStore()
const { t } = useI18n()

const router = useRouter()
const items = ref([])
const page = ref(1)
const itemsPerPage = ref(25)
const totalItems = ref(0)
const searches = ref([])
const sortBy = ref([
  { key: 'id', order: 'desc' }
])
const authStore = useAuthStore();
const actions = computed(() => {
  const actions = [];

  if (authStore.can('user.update')) {
    actions.push('edit');
  }

  if (authStore.can('user.delete')) {
    actions.push('delete');
  }

  if (authStore.can('user.switch')) {
    actions.push('switchUser');
  }
  
  return actions;
})

const isActionVisible = (action: string, item: unknown) => {
  if (action !== 'switchUser') return true
  const it = item as { id: number | string }
  return String(it.id) !== String(authStore.user?.id)
}

const fetchData = async function (options = {}) {
  const data = await userService.getList(
    tableOptionsToParams(options)
  )
  items.value = data.items;
  totalItems.value = data.total;
}

const buildOptions = () => {
  return {
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    searches: searches.value
  }
}

const onEdit = (item: unknown) => {
  const it = item as { id: number | string }
  router.push({ name: 'UserEdit', params: { id: it.id } })
}

const onDelete = async (item: unknown) => {
  const it = item as { id: number | string }
  await userService.del(it.id)
  
  fetchData(buildOptions())
}

const onSwitchUser = async (item: unknown) => {
  const it = item as { id: number | string; name?: string }
  if (!await dialogStore.confirm(t('user.switchUserConfirm', { name: it.name || `#${it.id}` }))) return
  await authStore.switchToUser(it.id)
}

const onUpdateOptions = (options) => {
  fetchData(options);
}

const onSearch = () => {
  fetchData(buildOptions())
}
</script>

<template>
  <TablePageShell title-key="user.listTitle">
    <template #header-right>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
        @search="onSearch"
      />
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="primary"
            variant="outlined"
          >
            <v-icon>$plus</v-icon> {{ $t('addNew') }}
            <v-icon end>$chevronDown</v-icon>
          </v-btn>
        </template>

        <v-list density="compact">
          <v-list-item :to="{name: 'UserAdd'}">
            <v-list-item-title>{{ $t('user.addNewUserBtn') }}</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{name: 'ChurchAddWithNewPastor'}">
            <v-list-item-title>{{ $t('church.addNewChurchWithPastorBtn') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
      :enabled-actions="actions"
      :is-action-visible="isActionVisible"
      @action:delete="onDelete"
      @action:edit="onEdit"
      @action:switchUser="onSwitchUser"
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

    <template v-slot:[`item.avatar`]="{ item }">
      <Avatar
        :src="item?.photo_url || defaultAvatar"
        :size="50"
      />
    </template>
  </DynamicTableDefault>
  </TablePageShell>
</template>

<style scoped lang="scss">

</style>