<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import {useDialogStore} from '@/stores/dialogStore'
import {churchService} from '@/services/churchService.ts';
import DynamicTableDefault from "@/components/tables/DynamicTableDefault.vue";
import tableSchema from '@/table-schemas/churchTableSchema.ts';
import { tableOptionsToParams } from '@/helpers/dataTableHelper.ts';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
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

const actions = computed(() => {
  return [
  ...(authStore.can('church.update') ? ['edit'] : []),
   ...(authStore.can('church.clone') ? ['clone'] : []),
    ...(authStore.can('church.disable') ? ['disable'] : []),
  ];
})

const fetchData = async function (options = {}) {
  const data = await churchService.getList(
    tableOptionsToParams(options)
  )
  items.value = data.items;
  totalItems.value = data.total;
}

const onEdit = (item: any) => {
  router.push({ name: 'ChurchEdit', params: { id: item.id } })
}

const onClone = (item) => {
  router.push({ name: 'ChurchClone', params: { id: item.id } })
}

const onDisable = async (item: any) => {
  await churchService.disable(item.id)
  
  fetchData()
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
            <h3 class="text-h3 mt-5 mb-5">{{ $t('church.listTitle') }}</h3>
          </v-col>
          <!-- #Title -->

          <!-- Actions -->
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-btn 
              color="primary" 
              variant="outlined" 
              @click="router.push({ name: 'ChurchAdd' })"
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
                :enabled-actions="actions"
                @action:edit="onEdit"
                @action:clone="onClone"
                @action:disable="onDisable"
                @update:options="onUpdateOptions"
              >
                          <template v-slot:item.attributes="{ item }">
                  <div class="text-end text-no-wrap">
                    <v-chip
                      v-if="item?.is_msc"
                      color="warning"
                      :text="$t('churchTable.msc')"
                      class="mr-2"
                      size="small"
                      label
                    ></v-chip>
                    <v-chip
                      v-if="item?.is_mother_church"
                      color="success"
                      :text="$t('churchTable.mother')"
                      class="mr-2"
                      size="small"
                      label
                    ></v-chip>
                  </div>
                </template>

                <template v-slot:item.name="{ item }">
                  <v-btn
                    color="primary"
                    variant="text"
                    :to="{ name: 'ChurchDetail', params: { id: item.id } }"
                  >
                  {{ item.name }}
                  </v-btn>
                </template>
              </DynamicTableDefault>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>