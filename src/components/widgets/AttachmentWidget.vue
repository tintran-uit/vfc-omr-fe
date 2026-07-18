<script setup lang="ts">
import {ref, watch, computed, onMounted, inject} from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import tableSchema from '@/table-schemas/attachmentTableSchema';
import DynamicTableDefault from '@/components/tables/DynamicTableDefault.vue';
import { attachmentService } from '@/services/attachmentService';
import { tableOptionsToParams } from '@/helpers/dataTableHelper.ts';
import { useAuthStore } from '@/stores/authStore';
import { createFormSchema } from '@/form-schemas/addAttachmentFormSchema'
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue'

const props = withDefaults(
  defineProps<{
    churchId: number,
    title?: string
  }>(),
  {
    title: 'Attachments'
  }
)

const authStore = useAuthStore()
const churchDetail = inject('churchDetail')

const items = ref<any[]>([])
const totalItems = ref(0)
const loading = ref(false)
const search = ref('')
const sortBy = ref([{ key: 'id', order: 'desc' }])
const page = ref(1)
const itemsPerPage = ref(50)
const actions = computed(() => {
  const actions = [];
  if (
    authStore.isRoleAdmin
    || authStore.isRoleSuperAdmin
  ) {
    actions.push('delete')
  }

  return actions;
})

// Form
const formSchema = createFormSchema();
const enableAddForm = computed(() => {
  return churchDetail.value?.pastor_id === authStore.user?.id
})
const handleSubmit = async (formData) => {
  try {
    await attachmentService.create(props.churchId, formData)

    fetchData()
  } catch (e) {
    console.log('error', e);
  }
}

const fetchData = async function (options = {}) {
  const data = await attachmentService.getListByChurchId(
    props.churchId,
    tableOptionsToParams(options),
    false
  )
  items.value = data.items;
  totalItems.value = data.total_pages;
}

watch(
  () => props.churchId,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      page.value = 1
      await fetchData()
    }
  },
  { immediate: true }
)

watch([page, itemsPerPage, sortBy, search], () => {
  fetchData({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    search: search.value
  })
})
</script>

<template>
  <CardHeader :title="$t('attachment.dashboardTitle')">
    <template v-if="enableAddForm">
      <div class="px-5 pt-4 pb-5">
        <DynamicFormDefault
          :form-schema="formSchema"
          :form-only="true"
          hide-form-header
          @submit="handleSubmit"
        >
          <template #actions>
            <div class="d-flex justify-end mt-2">
              <v-btn
                type="submit"
                color="primary"
                variant="flat"
              >
                {{ $t('save') }}
              </v-btn>
            </div>
          </template>
        </DynamicFormDefault>
      </div>
      <v-divider></v-divider>
    </template>
    <DynamicTableDefault
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:search="search"
      v-model:sort-by="sortBy"
      :total-items="totalItems"
      :headers="tableSchema.headers"
      :searches-config="tableSchema?.searches || []"
      :items="items"
      :enabled-actions="actions"
      :hide-header="true"
      :hide-title="true"
    >
    <template v-slot:item.fileDownload="{ item }">
      <a :href="item.path" target="_blank">{{ item.attachment }}</a>
    </template>
  </DynamicTableDefault>
  </CardHeader>
</template>

<style scoped>

</style>
