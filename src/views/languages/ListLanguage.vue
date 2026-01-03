<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from "vue-router";
import DynamicTableDefault from '@/components/tables/DynamicTableDefault.vue';
import { languageService } from '@/services/languageService';
import tableSchema from '@/table-schemas/languageTableSchema';
import { tableOptionsToParams } from '@/helpers/dataTableHelper';
import { useI18n } from 'vue-i18n';

const router = useRouter()
const route = useRoute()
const {t} = useI18n()
const items = ref([])

// Data table options
const page = ref(1)
const itemsPerPage = ref(25)
const totalItems = ref(0)
const searches = ref([])
const sortBy = ref([
  { key: 'id', order: 'desc' }
])

const buildOptions = () => {
  return {
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    searches: searches.value
  }
}

const fetchData = async function (options = {}) {
  const data = await languageService.getList(
    tableOptionsToParams(options)
  )
  items.value = data.items;
  totalItems.value = data.total;
}

const onEdit = (item: any) => {
  router.push({ name: 'LanguageEdit', params: { id: item.id } })
}

const onDelete = async (item: any) => {
  await languageService.del(item.id)
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
          <v-col cols="12" md="8" class="d-flex align-center">
            <h3 class="text-h3 mt-5 mb-5">{{ $t('language.listTitle') }}</h3>
          </v-col>
          <!-- #Title -->

          <!-- Actions -->
          <v-col cols="12" md="4" class="d-flex justify-end">
            <v-btn 
              color="primary" 
              variant="outlined" 
              @click="router.push({ name: 'LanguageAdd' })"
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
                :enabled-actions="['edit', 'delete']"
                @action:edit="onEdit"
                @action:delete="onDelete"
                @update:options="onUpdateOptions"
              >
              </DynamicTableDefault>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>