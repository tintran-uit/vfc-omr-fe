<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import {useDialogStore} from '@/stores/dialogStore'
import {userService} from '@/services/userService.ts';
import DynamicTableDefault from "@/components/dynamic-table/DynamicTableDefault.vue";
import tableSchema from '@/table-schemas/userTableSchema.ts';
import { tableOptionsToParams } from '@/helpers/dataTableHelper.ts';
import UiTableCard from '@/components/shared/UiTableCard.vue';

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

const fetchData = async function (options = {}) {
  const data = await userService.getList(
    tableOptionsToParams(options)
  )
  items.value = data.items;
  totalItems.value = data.total_pages;
}

const buildOptions = () => {
  return {
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    searches: searches.value
  }
}

const onUpdate = (item: any) => {
  router.push({ name: 'UserUpdate', params: { id: item.id } })
}

const onDelete = async (item: any) => {
  if (!await dialogStore.confirm('Are you sure you want to delete?')) return
  console.log('call to edit')
  await userService.del(item.id)
  
  fetchData(buildOptions())
}

const onUpdateOptions = (options) => {
  fetchData(options);
}
</script>

<template>
  <v-row class="page-breadcrumb mb-0 mt-n2">
    <v-col cols="12" md="12">
      <v-card elevation="0" variant="text">
        <v-row no-gutters class="align-center">
          <!-- Title -->
          <v-col cols="12" md="6" class="d-flex align-center">
            <h3 class="text-h3 mt-5 mb-5">{{ $t('user.listTitle') }}</h3>
          </v-col>
          <!-- #Title -->

          <!-- Actions -->
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-btn 
              color="primary" 
              variant="outlined" 
              @click="router.push({ name: 'UserCreate' })"
            >
              <v-icon>$plus</v-icon> {{ $t('addNew') }}
            </v-btn>
          </v-col>
          <!-- #Actions -->
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card variant="outlined" elevation="0" class="bg-surface overflow-hidden">
        <DynamicTableDefault
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
          v-model:searches="searches"
          v-model:sort-by="sortBy"
          :total-items="totalItems"
          :headers="tableSchema.headers"
          :searches-config="tableSchema.searches"
          :items="items"
          :enabled-actions="['update']"
          @action:delete="onDelete"
          @action:update="onUpdate"
          @update:options="onUpdateOptions"
        >
        <template v-slot:item.name="{ item }">
                  <a
                    href="#"
                    variant="text"
                    class="text-primary"
                  >
                    {{ item.name }}
        </a>
                </template>
        </DynamicTableDefault>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>