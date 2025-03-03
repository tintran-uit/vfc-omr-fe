<script setup lang="ts">
import { ref } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { DownloadOutlined, EditOutlined, PrinterFilled, ShareAltOutlined } from '@ant-design/icons-vue';
import LogoMain from '@/layouts/dashboard/logo/LogoMain.vue';

// theme breadcrumb
const page = ref({ title: 'Invoice Summary' });
const breadcrumbs = ref([
  {
    title: 'Invoice',
    disabled: false,
    href: '#'
  },
  {
    title: 'Details',
    disabled: true,
    href: '#'
  }
]);

const tableData = ref([
  {
    number: 1,
    name: 'Apple Series 4 GPS A38 MM Space',
    description: 'Apple Watch SE Smartwatch',
    qty: 3,
    price: '₹275.00',
    amount: '₹825.00'
  },
  {
    number: 2,
    name: 'Boat On-Ear Wireless',
    description: 'Mic(Bluetooth 4.2, Rockerz 450R...',
    qty: 45,
    price: '₹81.99',
    amount: '₹3689.55'
  },
  {
    number: 3,
    name: 'Fitbit MX30 Smart Watch',
    description: '(MX30- waterproof) watch',
    qty: 70,
    price: '₹85.00',
    amount: '₹5950.00'
  }
]);
</script>
<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <v-card variant="outlined" class="bg-surface">
        <v-card-item>
          <div class="bg-lightprimary text-end pa-2 rounded-md">
            <v-btn variant="text" icon rounded>
              <EditOutlined />
            </v-btn>
            <v-btn variant="text" icon rounded>
              <DownloadOutlined />
            </v-btn>
            <v-btn variant="text" icon rounded>
              <PrinterFilled />
            </v-btn>
            <v-btn variant="text" icon rounded>
              <ShareAltOutlined />
            </v-btn>
          </div>
          <v-row class="mt-6">
            <v-col cols="12" sm="6">
              <div class="d-flex">
                <LogoMain />
                <v-chip color="success" variant="outlined" class="ms-2" label size="small">Paid</v-chip>
              </div>
              <p class="text-h6 text-lightText">8795646525451</p>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="d-flex justify-end">
                <h6 class="text-subtitle-1 me-2 mb-0">Date</h6>
                <p class="text-h6 text-lightText mb-0">01/05/2023</p>
              </div>
              <div class="d-flex justify-end">
                <h6 class="text-subtitle-1 me-2 mb-0">Due Date</h6>
                <p class="text-h6 text-lightText mb-0">17/07/2023</p>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card variant="outlined">
                <v-card-item>
                  <div class="d-flex justify-space-between">
                    <div>
                      <h5 class="text-h5 mb-3">From:</h5>
                      <p class="text-h6 text-lightText mb-0">Ian Carpenter</p>
                      <p class="text-h6 text-lightText mb-0">1754 Ureate, RhodSA5 5BO</p>
                      <p class="text-h6 text-lightText mb-0">+91 1234567890</p>
                      <p class="text-h6 text-lightText mb-0">iacrpt65@gmail.com</p>
                    </div>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card variant="outlined">
                <v-card-item>
                  <div class="d-flex justify-space-between">
                    <div>
                      <h5 class="text-h5 mb-3">To:</h5>
                      <p class="text-h6 text-lightText mb-0">Belle J. Richter</p>
                      <p class="text-h6 text-lightText mb-0">1754 Ureate, RhodSA5 5BO</p>
                      <p class="text-h6 text-lightText mb-0">+91 1234567890</p>
                      <p class="text-h6 text-lightText mb-0">iacrpt65@gmail.com</p>
                    </div>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-table class="bordered-table" hover>
                <thead class="bg-containerBg">
                  <tr>
                    <th class="text-start text-uppercase text-caption font-weight-bold" style="width: 50px">#</th>
                    <th class="text-start text-uppercase text-caption font-weight-bold">Name</th>
                    <th class="text-start text-uppercase text-caption font-weight-bold">Description</th>
                    <th class="text-start text-uppercase text-caption font-weight-bold" style="width: 100px">Qty</th>
                    <th class="text-start text-uppercase text-caption font-weight-bold" style="width: 100px">Price</th>
                    <th class="text-end text-uppercase text-caption font-weight-bold" style="width: 97px">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in tableData" :key="index">
                    <td class="text-subtitle-1 font-weight-regular py-3">{{ item.number }}</td>
                    <td class="text-subtitle-1 font-weight-regular py-3">{{ item.name }}</td>
                    <td class="text-subtitle-1 font-weight-regular py-3">{{ item.name }}</td>
                    <td class="text-subtitle-1 font-weight-regular py-3">{{ item.qty }}</td>
                    <td class="text-subtitle-1 font-weight-regular py-3">{{ item.price }}</td>
                    <td class="text-subtitle-1 font-weight-regular py-3">{{ item.amount }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
            <v-divider></v-divider>
            <v-col cols="12" sm="5" md="4" class="ms-auto">
              <v-list density="compact" aria-label="total list" aria-busy="true">
                <v-list-item class="px-0">
                  <p class="text-h6 text-lightText mb-0">Sub Total:</p>
                  <template v-slot:append>
                    <p class="text-h6 mb-0">₹10464.55</p>
                  </template>
                </v-list-item>
                <v-list-item class="px-0">
                  <p class="text-h6 text-lightText mb-0">Discount:</p>
                  <template v-slot:append>
                    <p class="text-h6 mb-0 text-success">₹52.32</p>
                  </template>
                </v-list-item>
                <v-list-item class="px-0">
                  <p class="text-h6 text-lightText mb-0">Tax:</p>
                  <template v-slot:append>
                    <p class="text-h6 mb-0">₹20.93</p>
                  </template>
                </v-list-item>
                <v-list-item class="px-0">
                  <p class="text-subtitle-1 mb-0">Grand Total:</p>
                  <template v-slot:append>
                    <p class="text-subtitle-1 mb-0">₹10433.16</p>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12">
              <div class="d-flex">
                <p class="text-h6 text-lightText mb-0">Notes:</p>
                <p class="text-h6 mb-0 ms-2">
                  It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank
                  You!
                </p>
              </div>
            </v-col>
            <v-col cols="12" class="text-end">
              <v-btn color="primary" variant="flat">Download</v-btn>
            </v-col>
          </v-row>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>
