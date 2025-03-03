<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useContactStore } from '@/stores/apps/contact';
const store = useContactStore();

// icons
import {
  MessageOutlined,
  WarningFilled,
  BankOutlined,
  WalletOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CrownOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';

onMounted(() => {
  store.fetchContacts();
});

const contact = computed(() => {
  return store.contact[store.selectedContact];
});
</script>

<template>
  <div v-if="contact" class="pa-6">
    <div class="d-flex align-center">
      <img :src="contact.avatar" :alt="contact.avatar" width="48" class="me-2 rounded-md" />
      <div>
        <h5 class="text-h4 mb-0">{{ contact.name }}</h5>
        <v-list-item-subtitle class="text-subtitle-2 font-weight-medium">{{ contact.role }}</v-list-item-subtitle>
      </div>
    </div>
    <v-row class="my-3">
      <v-col cols="6">
        <v-btn variant="outlined" color="primary" block @click="$emit('editContact')">
          <template v-slot:prepend>
            <MessageOutlined />
          </template>
          Edit
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn variant="outlined" color="error" block>
          <template v-slot:prepend>
            <WarningFilled />
          </template>
          Block
        </v-btn>
      </v-col>
    </v-row>
    <table class="text-body-1">
      <tbody>
        <tr>
          <td class="pa-2 ps-0"><BankOutlined :style="{ fontSize: '20px' }" /></td>
          <td>{{ contact.company }}</td>
        </tr>
        <tr>
          <td class="pa-2 ps-0"><WalletOutlined :style="{ fontSize: '20px' }" /></td>
          <td>{{ contact.role }}</td>
        </tr>
        <tr>
          <td class="pa-2 ps-0"><MailOutlined :style="{ fontSize: '20px' }" /></td>
          <td>{{ contact.work_email }}</td>
        </tr>
        <tr>
          <td class="pa-2 ps-0"><PhoneOutlined :style="{ fontSize: '20px' }" /></td>
          <td>{{ contact.work_phone }}</td>
        </tr>
        <tr>
          <td class="pa-2 ps-0"><EnvironmentOutlined :style="{ fontSize: '20px' }" /></td>
          <td>{{ contact.location }}</td>
        </tr>
        <tr>
          <td class="pa-2 ps-0"><CrownOutlined :style="{ fontSize: '20px' }" /></td>
          <td>November 30, 1997</td>
        </tr>
        <tr>
          <td class="pa-2 ps-0"><ExclamationCircleOutlined :style="{ fontSize: '20px' }" /></td>
          <td>{{ contact.birthdayText }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
