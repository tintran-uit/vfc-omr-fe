<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { geographicalRegionService } from '@/services/geographicalRegionService';
import DataTable from '@/components/tables/DataTable.vue';
import tableSchema from '@/table-schemas/geographicalRegionTableSchema';
import { useI18n } from 'vue-i18n';

const router = useRouter()
const route = useRoute()
const {t} = useI18n()
const items = ref([])

const fetchData = async () => {
  const flattenedItems = await geographicalRegionService.getAllFlattened()
  items.value = flattenedItems
}

const onEdit = (item: any) => {
  router.push({ name: 'GeographicalRegionsEdit', params: { id: item.id } })
}

const onDelete = async (item: any) => {
  await geographicalRegionService.del(item.id)

  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <v-row class="page-breadcrumb mb-0 mt-n2">
    <v-col cols="12" md="12">
      <v-card elevation="0" variant="text">
        <v-row no-gutters class="align-center">
          <!-- Title -->
          <v-col cols="12" md="8" class="d-flex align-center">
            <h3 class="text-h3 mt-5 mb-5">{{ $t('geographicalRegions.listTitle') }}</h3>
          </v-col>
          <!-- #Title -->

          <!-- Actions -->
          <v-col cols="12" md="4" class="d-flex justify-end">
            <v-btn 
              color="primary" 
              variant="outlined" 
              @click="router.push({ name: 'GeographicalRegionsAdd' })"
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
          <template v-slot:item.name="{ item }">
            <span class="text-medium-emphasis">
              <!-- join path trước name -->
              {{ item.namePath.slice(0, -1).join(' > ') }}
            </span>

            <span v-if="item.namePath.length > 1" class="text-grey">
              &nbsp;>&nbsp;
            </span>

            <span class="">
              {{ item.namePath[item.namePath.length - 1] }}
            </span>
          </template>
        </DataTable>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>