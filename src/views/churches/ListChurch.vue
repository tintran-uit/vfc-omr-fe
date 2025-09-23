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
  <v-row class="page-breadcrumb mb-0 mt-n2">
    <v-col cols="12" md="12">
      <v-card elevation="0" variant="text">
        <v-row no-gutters class="align-center">
          <!-- Title -->
          <v-col cols="12" md="6" class="d-flex align-center">
            <h3 class="text-h3 mt-5 mb-5">{{ $t('church.list') }}</h3>
          </v-col>
          <!-- #Title -->

          <!-- Actions -->
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-btn 
              color="primary" 
              variant="outlined" 
              @click="router.push({ name: 'ChurchCreate' })"
            >
              <v-icon>$plus</v-icon> {{ $t('create') }}
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
                  <div class="text-end text-no-wrap">
                    <!-- <v-chip
                      v-if="item?.is_msc"
                      color="orange"
                      :text="$t('churchTable.msc')"
                      class="mr-2"
                      size="small"
                      label
                    ></v-chip>
                    <v-chip
                      v-if="item?.is_mother_church"
                      color="blue"
                      :text="$t('churchTable.mother')"
                      class="mr-2"
                      size="small"
                      label
                    ></v-chip>
                    <v-chip
                      v-if="item?.enable_cpm"
                      color="green"
                      :text="$t('churchTable.houseCP')"
                      class="mr-2"
                      size="small"
                      label
                    ></v-chip> -->
                    
                    <v-chip
                      color="info"
                      :text="$t('churchTable.msc')"
                      class="mr-2"
                      size="small"
                      label
                      outlined
                    ></v-chip>
                    <v-chip
                      v-if="item?.is_mother_church"
                      color="primary"
                      :text="$t('churchTable.mother')"
                      class="mr-2"
                      size="small"
                      label
                      outlined
                    ></v-chip>
                    <v-chip
                      color="warning"
                      :text="$t('churchTable.houseCP')"
                      class="mr-2"
                      size="small"
                      label
                      outlined
                    ></v-chip>
                  </div>
                </template>
              </DynamicTableDefault>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>