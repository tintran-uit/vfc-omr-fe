<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from "vue-router";
import {useDialogStore} from '@/stores/dialogStore'
import { worshipServiceService } from '@/services/worshipServiceService';
import { churchService } from '@/services/churchService';
import DynamicTableDefault from "@/components/tables/DynamicTableDefault.vue";
import tableSchema from '@/table-schemas/worshipServiceTableSchema';
import { tableOptionsToParams } from '@/helpers/dataTableHelper';
import UiTableCard from '@/components/shared/UiTableCard.vue';
import { useI18n } from 'vue-i18n';
import DataTable from '@/components/tables/DataTable.vue';

const router = useRouter()
const route = useRoute()
const dialogStore = useDialogStore()
const {t} = useI18n();
const items = ref([])
const church = ref(null)
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

const onEdit = (item: any) => {
  router.push({ name: 'WorshipServiceEdit', params: { churchId: item.churchId, id: item.id } })
}

const onDelete = async (item: any) => {
  await worshipServiceService.del(item.id)
}

watch(
  () => churchId.value,
  async (id) => {
    if (!id) return
    console.log('id', id)
    fetchChurchDetail(id)
    fetchData(id)
  },
  { immediate: true }
)
</script>

<template>
  <v-row class="page-breadcrumb mb-0 mt-n2">
    <v-col cols="12" md="12">
      <v-card elevation="0" variant="text">
        <v-row no-gutters class="align-center">
          <!-- Title -->
          <v-col cols="12" md="8" class="d-flex align-center">
            <h3 class="text-h3 mt-5 mb-5">{{ $t('worshipService.listTitle', {churchName: church?.name}) }}</h3>
          </v-col>
          <!-- #Title -->

          <!-- Actions -->
          <v-col cols="12" md="4" class="d-flex justify-end">
            <v-btn 
              color="primary" 
              variant="outlined" 
              @click="router.push({ name: 'WorshipServiceAdd' })"
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
        <DataTable
          :headers="tableSchema.headers"
          :items="items"
          :enabled-actions="['edit', 'delete']"
          @action:delete="onDelete"
          @action:edit="onEdit"
        >
        </DataTable>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>