<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import {useDialogStore} from '@/stores/dialogStore'
import {userService} from '@/services/userService.ts';
import DynamicTableDefault from "@/components/tables/DynamicTableDefault.vue";
import tableSchema from '@/table-schemas/userTableSchema.ts';
import { tableOptionsToParams } from '@/helpers/dataTableHelper.ts';
import { useAuthStore } from '@/stores/authStore';
import Avatar from '@/components/ui/Avatar.vue'
import defaultAvatar from '@/assets/images/users/avatar-default.svg';

const router = useRouter()
const dialogStore = useDialogStore()
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
  
  return actions;
})

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

const onEdit = (item: any) => {
  router.push({ name: 'UserEdit', params: { id: item.id } })
}

const onDelete = async (item: any) => {
  await userService.del(item.id)
  
  fetchData(buildOptions())
}

const onUpdateOptions = (options) => {
  fetchData(options);
}
</script>

<template>
  <DynamicTableDefault
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    v-model:searches="searches"
    v-model:sort-by="sortBy"
    :pageTitle="$t('user.listTitle')"
    :total-items="totalItems"
    :headers="tableSchema.headers"
    :searches-config="tableSchema.searches"
    :items="items"
    :enabled-actions="actions"
    @action:delete="onDelete"
    @action:edit="onEdit"
    @update:options="onUpdateOptions"
  >
  <template v-slot:header-right>
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
  <template v-slot:item.name="{ item }">
            <a
              href="#"
              variant="text"
            >
              {{ item.name }}
  </a>
          </template>

    <template v-slot:item.avatar="{ item }">
      <Avatar class="py-2" :src="item?.photo_url || defaultAvatar" variant="avatar" size="50" />
    </template>
  </DynamicTableDefault>
</template>

<style scoped lang="scss">

</style>