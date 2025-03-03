<script setup lang="ts">
import { ref } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

import user1 from '@/assets/images/users/avatar-5.png';
import user2 from '@/assets/images/users/avatar-4.png';
import user3 from '@/assets/images/users/avatar-7.png';
import user4 from '@/assets/images/users/avatar-1.png';
import user5 from '@/assets/images/users/avatar-2.png';

// icons
import { EyeOutlined, DeleteOutlined, EditOutlined, SearchOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons-vue';

const searchField = ref('name');
const searchValue = ref('');

const headers: Header[] = [
  { text: 'Invoice ID', value: 'id', sortable: true },
  { text: 'User info', value: 'name', sortable: true },
  { text: 'Create date', value: 'date', sortable: true },
  { text: 'Due date', value: 'due', sortable: true },
  { text: 'Quantity', value: 'qty', sortable: true },
  { text: 'Status', value: 'status', sortable: true },
  { text: 'Action', value: 'operation' }
];
const items = ref([
  {
    id: 1,
    name: 'Tessi Eneas',
    image: user1,
    mail: 'tass23@gmail.com',
    date: '05/01/2023',
    due: '06/02/2023',
    qty: '1000',
    status: 1
  },
  {
    id: 2,
    name: 'Abey Boseley',
    image: user2,
    mail: 'aabsl32@gmail.com',
    date: '7/15/2023',
    due: '2/15/2023',
    qty: '2030',
    status: 2
  },
  {
    id: 3,
    name: 'Shelba Thews',
    image: user3,
    mail: 'slbt37@gmail.com',
    date: '7/6/2023',
    due: '7/8/2023',
    qty: '3000',
    status: 3
  },
  {
    id: 4,
    name: 'Salvatore Boncore',
    image: user4,
    mail: 'sabf231@gmail.com',
    date: '2/8/2023',
    due: '3/30/2023',
    qty: '2000',
    status: 2
  },
  {
    id: 5,
    name: 'Mickie Melmoth',
    image: user5,
    mail: 'mmsht23@gmail.com',
    date: '5/5/2023',
    due: '7/11/2023',
    qty: '3000',
    status: 1
  }
]);
const items1 = ref([
  {
    id: 1,
    name: 'Tessi Eneas',
    image: user1,
    mail: 'tass23@gmail.com',
    date: '05/01/2023',
    due: '06/02/2023',
    qty: '1000',
    status: 1
  },
  {
    id: 5,
    name: 'Mickie Melmoth',
    image: user5,
    mail: 'mmsht23@gmail.com',
    date: '5/5/2023',
    due: '7/11/2023',
    qty: '3000',
    status: 1
  }
]);
const items2 = ref([
  {
    id: 2,
    name: 'Abey Boseley',
    image: user2,
    mail: 'aabsl32@gmail.com',
    date: '7/15/2023',
    due: '2/15/2023',
    qty: '2030',
    status: 2
  },
  {
    id: 4,
    name: 'Salvatore Boncore',
    image: user4,
    mail: 'sabf231@gmail.com',
    date: '2/8/2023',
    due: '3/30/2023',
    qty: '2000',
    status: 2
  }
]);
const items3 = ref([
  {
    id: 3,
    name: 'Shelba Thews',
    image: user3,
    mail: 'slbt37@gmail.com',
    date: '7/6/2023',
    due: '7/8/2023',
    qty: '3000',
    status: 3
  }
]);
const themeColor = ref('rgb(var(--v-theme-primary))');
const itemsSelected = ref<Item[]>([]);

// tabs data
const tab = ref(0);

function deleteRow(index: number) {
  items.value.splice(index, 1);
}
function deleteRow1(index: number) {
  items1.value.splice(index, 1);
}
function deleteRow2(index: number) {
  items2.value.splice(index, 1);
}
function deleteRow3(index: number) {
  items3.value.splice(index, 1);
}
</script>
<template>
  <v-card variant="outlined" class="bg-surface">
    <v-card-item>
      <v-tabs v-model="tab" color="primary">
        <v-tab value="1" class="font-weight-medium">
          All
          <v-chip color="primary" class="ms-2 font-weight-medium" label size="small"> 5 </v-chip>
        </v-tab>
        <v-tab value="2" class="font-weight-medium">
          Paid
          <v-chip color="success" class="ms-2 font-weight-medium" label size="small"> 2 </v-chip>
        </v-tab>
        <v-tab value="3" class="font-weight-medium">
          Unpaid
          <v-chip color="warning" class="ms-2 font-weight-medium" label size="small"> 2 </v-chip>
        </v-tab>
        <v-tab value="4" class="font-weight-medium">
          Cancelled
          <v-chip color="error" class="ms-2 font-weight-medium" label size="small"> 1 </v-chip>
        </v-tab>
      </v-tabs>
      <v-divider></v-divider>
      <v-window v-model="tab" class="mt-5">
        <v-window-item value="1">
          <v-row justify="space-between" class="align-center mb-2">
            <v-col cols="12" md="3">
              <v-text-field
                type="text"
                variant="outlined"
                persistent-placeholder
                placeholder="Search 5 records..."
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
                <v-btn color="primary" variant="flat" to="/app/invoice/create">
                  <template v-slot:prepend>
                    <PlusOutlined />
                  </template>
                  Add invoice
                </v-btn>
                <v-btn icon variant="text" rounded size="small">
                  <DownloadOutlined :style="{ fontSize: '24px' }" class="text-lightText" />
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <div class="invoice-table">
            <EasyDataTable
              :headers="headers"
              :items="items"
              table-class-name="customize-table"
              :theme-color="themeColor"
              :search-field="searchField"
              :search-value="searchValue"
              :rows-per-page="5"
              v-model:items-selected="itemsSelected"
            >
              <template #item-name="{ name, image, mail }">
                <div class="player-wrapper d-flex align-center">
                  <v-avatar size="32">
                    <img :src="image" width="32" alt="profile" />
                  </v-avatar>
                  <div class="ms-2">
                    <h5 class="text-subtitle-1 mb-0">{{ name }}</h5>
                    <p class="text-h6 text-lightText mb-0">{{ mail }}</p>
                  </div>
                </div>
              </template>
              <template #item-status="{ status }">
                <v-chip color="success" label v-if="status === 1" size="small"> Paid </v-chip>
                <v-chip color="info" label v-if="status === 2" size="small"> Unpaid </v-chip>
                <v-chip color="error" label v-if="status === 3" size="small"> Cancelled </v-chip>
              </template>
              <template #item-operation>
                <div class="operation-wrapper">
                  <v-btn icon color="secondary" variant="text" rounded to="/app/invoice/details">
                    <EyeOutlined />
                    <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
                      <span class="text-caption">View</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn icon color="primary" variant="text" rounded>
                    <EditOutlined />
                    <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
                      <span class="text-caption">Edit</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn icon color="error" variant="text" rounded @click="deleteRow">
                    <DeleteOutlined />
                    <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
                      <span class="text-caption">Delete</span>
                    </v-tooltip>
                  </v-btn>
                </div>
              </template>
            </EasyDataTable>
          </div>
        </v-window-item>

        <v-window-item value="2">
          <v-row justify="space-between" class="align-center mb-2">
            <v-col cols="12" md="3">
              <v-text-field
                type="text"
                variant="outlined"
                persistent-placeholder
                placeholder="Search 5 records..."
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
                <v-btn color="primary" variant="flat" to="/app/invoice/create">
                  <template v-slot:prepend>
                    <PlusOutlined />
                  </template>
                  Add invoice
                </v-btn>
                <v-btn icon variant="text" rounded size="small">
                  <DownloadOutlined :style="{ fontSize: '24px' }" class="text-lightText" />
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <div class="invoice-table">
            <EasyDataTable
              :headers="headers"
              :items="items1"
              table-class-name="customize-table"
              :theme-color="themeColor"
              :search-field="searchField"
              :search-value="searchValue"
              :rows-per-page="5"
              v-model:items-selected="itemsSelected"
            >
              <template #item-name="{ name, image, mail }">
                <div class="player-wrapper d-flex align-center">
                  <v-avatar size="32">
                    <img :src="image" width="32" alt="profile" />
                  </v-avatar>
                  <div class="ms-2">
                    <h5 class="text-subtitle-1 mb-0">{{ name }}</h5>
                    <p class="text-h6 text-lightText mb-0">{{ mail }}</p>
                  </div>
                </div>
              </template>
              <template #item-status="{ status }">
                <v-chip color="success" label v-if="status === 1" size="small"> Paid </v-chip>
                <v-chip color="info" label v-if="status === 2" size="small"> Unpaid </v-chip>
                <v-chip color="error" label v-if="status === 3" size="small"> Cancelled </v-chip>
              </template>
              <template #item-operation>
                <div class="operation-wrapper">
                  <v-btn icon color="secondary" variant="text" rounded to="/app/invoice/details">
                    <EyeOutlined />
                    <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
                      <span class="text-caption">View</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn icon color="primary" variant="text" rounded>
                    <EditOutlined />
                    <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
                      <span class="text-caption">Edit</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn icon color="error" variant="text" rounded @click="deleteRow1">
                    <DeleteOutlined />
                    <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
                      <span class="text-caption">Delete</span>
                    </v-tooltip>
                  </v-btn>
                </div>
              </template>
            </EasyDataTable>
          </div>
        </v-window-item>

        <v-window-item value="3">
          <v-row justify="space-between" class="align-center mb-2">
            <v-col cols="12" md="3">
              <v-text-field
                type="text"
                variant="outlined"
                persistent-placeholder
                placeholder="Search 5 records..."
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
                <v-btn color="primary" variant="flat" to="/app/invoice/create">
                  <template v-slot:prepend>
                    <PlusOutlined />
                  </template>
                  Add invoice
                </v-btn>
                <v-btn icon variant="text" rounded size="small">
                  <DownloadOutlined :style="{ fontSize: '24px' }" class="text-lightText" />
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <div class="invoice-table">
            <EasyDataTable
              :headers="headers"
              :items="items2"
              table-class-name="customize-table"
              :theme-color="themeColor"
              :search-field="searchField"
              :search-value="searchValue"
              :rows-per-page="5"
              v-model:items-selected="itemsSelected"
            >
              <template #item-name="{ name, image, mail }">
                <div class="player-wrapper d-flex align-center">
                  <v-avatar size="32">
                    <img :src="image" width="32" alt="profile" />
                  </v-avatar>
                  <div class="ms-2">
                    <h5 class="text-subtitle-1 mb-0">{{ name }}</h5>
                    <p class="text-h6 text-lightText mb-0">{{ mail }}</p>
                  </div>
                </div>
              </template>
              <template #item-status="{ status }">
                <v-chip color="success" label v-if="status === 1" size="small"> Paid </v-chip>
                <v-chip color="info" label v-if="status === 2" size="small"> Unpaid </v-chip>
                <v-chip color="error" label v-if="status === 3" size="small"> Cancelled </v-chip>
              </template>
              <template #item-operation>
                <div class="operation-wrapper">
                  <v-btn icon color="secondary" variant="text" rounded to="/app/invoice/details">
                    <EyeOutlined />
                    <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
                      <span class="text-caption">View</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn icon color="primary" variant="text" rounded>
                    <EditOutlined />
                    <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
                      <span class="text-caption">Edit</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn icon color="error" variant="text" rounded @click="deleteRow2">
                    <DeleteOutlined />
                    <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
                      <span class="text-caption">Delete</span>
                    </v-tooltip>
                  </v-btn>
                </div>
              </template>
            </EasyDataTable>
          </div>
        </v-window-item>

        <v-window-item value="4">
          <v-row justify="space-between" class="align-center mb-2">
            <v-col cols="12" md="3">
              <v-text-field
                type="text"
                variant="outlined"
                persistent-placeholder
                placeholder="Search 5 records..."
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
                <v-btn color="primary" variant="flat" to="/app/invoice/create">
                  <template v-slot:prepend>
                    <PlusOutlined />
                  </template>
                  Add invoice
                </v-btn>
                <v-btn icon variant="text" rounded size="small">
                  <DownloadOutlined :style="{ fontSize: '24px' }" class="text-lightText" />
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <div class="invoice-table">
            <EasyDataTable
              :headers="headers"
              :items="items3"
              table-class-name="customize-table"
              :theme-color="themeColor"
              :search-field="searchField"
              :search-value="searchValue"
              :rows-per-page="5"
              v-model:items-selected="itemsSelected"
            >
              <template #item-name="{ name, image, mail }">
                <div class="player-wrapper d-flex align-center">
                  <v-avatar size="32">
                    <img :src="image" width="32" alt="profile" />
                  </v-avatar>
                  <div class="ms-2">
                    <h5 class="text-subtitle-1 mb-0">{{ name }}</h5>
                    <p class="text-h6 text-lightText mb-0">{{ mail }}</p>
                  </div>
                </div>
              </template>
              <template #item-status="{ status }">
                <v-chip color="success" label v-if="status === 1" size="small"> Paid </v-chip>
                <v-chip color="info" label v-if="status === 2" size="small"> Unpaid </v-chip>
                <v-chip color="error" label v-if="status === 3" size="small"> Cancelled </v-chip>
              </template>
              <template #item-operation>
                <div class="operation-wrapper">
                  <v-btn icon color="secondary" variant="text" rounded to="/app/invoice/details">
                    <EyeOutlined />
                    <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
                      <span class="text-caption">View</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn icon color="primary" variant="text" rounded>
                    <EditOutlined />
                    <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
                      <span class="text-caption">Edit</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn icon color="error" variant="text" rounded @click="deleteRow3">
                    <DeleteOutlined />
                    <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
                      <span class="text-caption">Delete</span>
                    </v-tooltip>
                  </v-btn>
                </div>
              </template>
            </EasyDataTable>
          </div>
        </v-window-item>
      </v-window>
    </v-card-item>
  </v-card>
</template>
