<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import {useDialogStore} from '@/stores/dialogStore'
import {churchService} from '@/services/churchService.ts';
import DynamicTableDefault from "@/components/dynamic-table/DynamicTableDefault.vue";
import tableSchema from '@/table-schemas/churchTableSchema.ts';
import { tableOptionsToParams } from '@/helpers/dataTableHelper.ts';

const router = useRouter()
const dialogStore = useDialogStore()
const items = ref([])
const page = ref(1)
const itemsPerPage = ref(25)
const totalItems = ref(0)
const search = ref({})
const sortBy = ref([
  { key: 'id', order: 'desc' }
])

const fetchData = async function (options = {}) {
  const data = await churchService.getList(
    tableOptionsToParams(options)
  )
  items.value = data.items;
  totalItems.value = data.total_pages;
}

const onUpdate = (item: any) => {
  router.push({ name: 'ChurchUpdate', params: { id: item.id } })
}

const onDelete = async (item: any) => {
  if (!await dialogStore.confirm('Are you sure you want to delete?')) return
  console.log('call to edit')
  await churchService.del(item.id)
  
  fetchData()
}

const handleActionClone = (item) => {
  router.push({ name: 'ChurchClone', params: { id: item.id } })
}

const onUpdateOptions = (options) => {
  console.log('onUpdateOptions', options);

  fetchData(options);
}

import { useLoadingStore } from '@/stores/loadingStore';
const loadingStore = useLoadingStore();
</script>

<template>
    <!-- Main Content -->
    <v-sheet color="grey lighten-4" class="pa-8">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <h1>{{ $t('church.list') }}</h1>
          <v-btn 
            color="primary" 
            variant="outlined" 
            @click="router.push({ name: 'ChurchCreate' })"
          >
            <v-icon>$plus</v-icon> {{ $t('create') }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="12" lg="12">
          <v-sheet class="pa-6" elevation="2" rounded="lg" color="white">
            <!-- Slot để bỏ form -->
            <slot name="form">
              <DynamicTableDefault
                v-model:page="page"
                v-model:items-per-page="itemsPerPage"
                v-model:search="search"
                v-model:sort-by="sortBy"
                :total-items="totalItems"
                :headers="tableSchema.headers"
                :searches-config="tableSchema.searches"
                :items="items"
                :enabled-actions="['update', 'clone']"
                @action:delete="onDelete"
                @action:update="onUpdate"
                @action:clone="handleActionClone"
                @update:options="onUpdateOptions"
              >
                          <template v-slot:item.tags="{ item }">
                  <div class="text-end">
                    <v-chip
                      v-if="item?.is_msc"
                      color="orange"
                      text="MSC"
                      class="mr-2"
                      size="small"
                      label
                    ></v-chip>
                    <v-chip
                      v-if="item?.has_children"
                      color="blue"
                      text="MOTHER"
                      class="mr-2"
                      size="small"
                      label
                    ></v-chip>
                    <v-chip
                      v-if="item?.enable_cpm"
                      color="green"
                      text="House C.P."
                      class="mr-2"
                      size="small"
                      label
                    ></v-chip>
                  </div>
                </template>
              </DynamicTableDefault>
            </slot>
          </v-sheet>
        </v-col>
      </v-row>
    </v-sheet>
</template>

<style scoped lang="scss">

</style>