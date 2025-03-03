<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue';
import { useCustomers } from '@/stores/apps/customers';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { Header, Item } from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

// icons
import {
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined
} from '@ant-design/icons-vue';

const page = ref({ title: 'Customer list' });

const breadcrumbs = shallowRef([
  {
    title: 'Customer',
    disabled: false,
    href: '#'
  },
  {
    title: 'List',
    disabled: true,
    href: '#'
  }
]);

const store = useCustomers();

const getCustomers = computed(() => {
  return store.getCustomers;
});

onMounted(() => {
  store.fetchCustomers();
});

const searchField = ref('name');
const searchValue = ref('');

const headers: Header[] = [
  { text: 'User Info', value: 'name', sortable: true },
  { text: 'Contact', value: 'date', sortable: true },
  { text: 'Age', value: 'orders', sortable: true },
  { text: 'Country', value: 'location', sortable: true },
  { text: 'Status', value: 'status', sortable: true },
  { text: 'Action', value: 'operation' }
];
const items = ref(getCustomers);
const themeColor = ref('rgb(var(--v-theme-primary))');
const { deleteCustomer } = store;

const itemsSelected = ref<Item[]>([]);

const dialog = ref(false);

const radioGroup = ref('1');

const items2 = ref([
  'Adobe XD',
  'After Effect',
  'Angular',
  'Animation',
  'ASP.Net',
  'Bootstrap',
  'C#',
  'CC',
  'Corel draw',
  'CSS',
  'DIV',
  'Dreamweaver',
  'Figma',
  'Graphics',
  'HTML',
  'Illustrator',
  'J2Ee',
  'Java',
  'Javascript',
  'Jquery',
  'Logo design',
  'Material UI',
  'Motion',
  'MVC',
  'MySQL',
  'NodeJs',
  'npm',
  'Photoshop',
  'PHP',
  'React',
  'Redux',
  'Reduxjs & tooltit',
  'SASS',
  'SCSS',
  'SQL server',
  'SVG',
  'UI/UX',
  'User interface designing',
  'Wordpress'
]);
const multi_value = ref(['Angular', 'SCSS']);
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="12">
      <v-card elevation="0" variant="outlined" class="bg-surface">
        <v-card-item>
          <v-row justify="space-between" class="align-center">
            <v-col cols="12" md="3">
              <v-text-field
                type="text"
                variant="outlined"
                persistent-placeholder
                placeholder="Search Customer"
                v-model="searchValue"
                hide-details
              >
                <template v-slot:prepend-inner>
                  <SearchOutlined :style="{ fontSize: '14px' }" />
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 justify-end">
                <v-dialog v-model="dialog" class="customer-modal">
                  <template v-slot:activator="{ props }">
                    <v-btn variant="flat" color="primary" v-bind="props">
                      <template v-slot:prepend>
                        <PlusOutlined />
                      </template>
                      Add customer
                    </v-btn>
                  </template>
                  <v-card>
                    <perfect-scrollbar style="max-height: calc(100vh - 48px)">
                      <v-card-title class="pa-5">
                        <span class="text-h5">New Customer</span>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col md="3" cols="12" class="text-center">
                              <v-avatar size="72" variant="outlined" color="primary" class="border-dashed">
                                <img src="@/assets/images/users/avatar-1.png" width="72" alt="profile" />
                                <input type="file" class="preview-upload" />
                              </v-avatar>
                            </v-col>
                            <v-col md="9" cols="12">
                              <v-row>
                                <v-col cols="12" sm="6">
                                  <v-label class="mb-2">First name</v-label>
                                  <v-text-field
                                    single-line
                                    placeholder="Enter first name"
                                    hide-details
                                    variant="outlined"
                                    required
                                    rounded="0"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <v-label class="mb-2">Last name</v-label>
                                  <v-text-field
                                    single-line
                                    placeholder="Enter last name"
                                    hide-details
                                    hint="example of helper text only on focus"
                                    variant="outlined"
                                    rounded="0"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="9">
                                  <v-label class="mb-2">Email</v-label>
                                  <v-text-field
                                    single-line
                                    type="email"
                                    hide-details
                                    placeholder="Enter customer email"
                                    required
                                    variant="outlined"
                                    rounded="0"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3">
                                  <v-label class="mb-2">Age</v-label>
                                  <v-text-field
                                    value="18"
                                    single-line
                                    type="number"
                                    hide-details
                                    variant="outlined"
                                    required
                                    rounded="0"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <v-label class="mb-2">Father name</v-label>
                                  <v-text-field
                                    single-line
                                    variant="outlined"
                                    hide-details
                                    placeholder="Enter father name"
                                    required
                                    rounded="0"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <v-label class="mb-2">Customer role</v-label>
                                  <v-text-field
                                    single-line
                                    variant="outlined"
                                    hide-details
                                    placeholder="Enter role"
                                    required
                                    rounded="0"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-label class="mb-2">Gender</v-label>
                                  <v-radio-group inline hide-details v-model="radioGroup" class="ml-n2">
                                    <v-radio color="primary" value="1" label="Female"></v-radio>
                                    <v-radio color="primary" value="2" label="Male"></v-radio>
                                  </v-radio-group>
                                </v-col>
                                <v-col cols="12">
                                  <v-label class="mb-2">Status</v-label>
                                  <v-autocomplete
                                    :items="['Rejected', 'Verified', 'Pending']"
                                    label="Pending"
                                    rounded="0"
                                    color="primary"
                                    single-line
                                    hide-details
                                    variant="outlined"
                                  ></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <v-label class="mb-2">Contact</v-label>
                                  <v-text-field
                                    single-line
                                    variant="outlined"
                                    hide-details
                                    placeholder="Enter contact"
                                    required
                                    rounded="0"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <v-label class="mb-2">Country</v-label>
                                  <v-text-field
                                    single-line
                                    variant="outlined"
                                    hide-details
                                    placeholder="Enter country"
                                    required
                                    rounded="0"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-label class="mb-2">Location</v-label>
                                  <v-textarea
                                    placeholder="Enter location"
                                    hide-details
                                    rows="2"
                                    variant="outlined"
                                    density="comfortable"
                                  ></v-textarea>
                                </v-col>
                                <v-col cols="12">
                                  <v-label class="mb-2">About customer</v-label>
                                  <v-textarea
                                    placeholder="Enter customer information"
                                    hide-details
                                    rows="2"
                                    variant="outlined"
                                    density="comfortable"
                                  ></v-textarea>
                                </v-col>
                                <v-col cols="12">
                                  <v-label class="mb-2">Skills</v-label>
                                  <v-autocomplete
                                    v-model="multi_value"
                                    :items="items2"
                                    variant="outlined"
                                    color="primary"
                                    placeholder="Add skills"
                                    single-line
                                    multiple
                                    hide-details
                                    closable-chips
                                  >
                                    <template v-slot:chip>
                                      <v-chip
                                        label
                                        variant="tonal"
                                        color="secondary"
                                        size="large"
                                        class="my-1 text-subtitle-1 font-weight-regular"
                                      >
                                        <template v-slot:close>
                                          <CloseOutlined :style="{ fontSize: '12px' }" />
                                        </template>
                                      </v-chip>
                                    </template>
                                  </v-autocomplete>
                                </v-col>
                                <v-col cols="12">
                                  <div class="d-flex justify-space-between ga-2">
                                    <div class="pb-4">
                                      <h6 class="text-subtitle-1 mb-0">Make Contact Info Public</h6>
                                      <p class="text-caption text-lightText mb-0 me-5">
                                        Means that anyone viewing your profile will be able to see your contacts details
                                      </p>
                                    </div>
                                    <v-switch color="primary" class="switchRight" :model-value="true" hide-details></v-switch>
                                  </div>
                                  <v-divider></v-divider>
                                </v-col>
                                <v-col cols="12" class="pt-0">
                                  <div class="d-flex justify-space-between ga-2">
                                    <div class="pb-4">
                                      <h6 class="text-subtitle-1 mb-0">Available to hire</h6>
                                      <p class="text-caption text-lightText mb-0 me-5">
                                        Toggling this will let your teammates know that you are available for acquiring new projects
                                      </p>
                                    </div>
                                    <v-switch color="primary" class="switchRight" :model-value="false" hide-details></v-switch>
                                  </div>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" variant="text" @click="dialog = false"> Cancel </v-btn>
                        <v-btn color="primary" variant="flat" @click="dialog = false"> Add </v-btn>
                      </v-card-actions>
                    </perfect-scrollbar>
                  </v-card>
                </v-dialog>
                <v-btn icon variant="text" rounded size="small">
                  <DownloadOutlined :style="{ fontSize: '24px' }" class="text-lightText" />
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <EasyDataTable
            :headers="headers"
            :items="items"
            table-class-name="customize-table"
            :theme-color="themeColor"
            :search-field="searchField"
            :search-value="searchValue"
            :rows-per-page="10"
            v-model:items-selected="itemsSelected"
          >
            <template #item-name="{ name, email }">
              <div class="player-wrapper">
                <h6 class="text-subtitle-1 mb-0">{{ name }}</h6>
                <small class="text-h6 text-lightText">{{ email }}</small>
              </div>
            </template>
            <template #item-status="{ status }">
              <v-chip color="success" v-if="status === 1" size="small" label> Verified </v-chip>
              <v-chip color="error" v-if="status === 2" size="small" label> Rejected </v-chip>
              <v-chip color="info" v-if="status === 3" size="small" label> Pending </v-chip>
            </template>
            <template #item-operation="item">
              <div class="operation-wrapper">
                <v-btn icon color="secondary" variant="text" rounded>
                  <EyeOutlined />
                </v-btn>
                <v-btn icon color="primary" variant="text" rounded>
                  <EditOutlined />
                </v-btn>
                <v-btn icon color="error" variant="text" @click="deleteCustomer(item.name)" rounded>
                  <DeleteOutlined />
                </v-btn>
              </div>
            </template>
          </EasyDataTable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<style lang="scss">
.customer-modal {
  width: calc(100% - 48px);
  min-width: 340px;
  max-width: 880px;
}
</style>
