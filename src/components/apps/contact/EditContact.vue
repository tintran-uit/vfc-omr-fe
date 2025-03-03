<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useContactStore } from '@/stores/apps/contact';
import type { UserProfile } from '@/types/user/userProfile';
const store = useContactStore();

// icons
import { UserOutlined, BankOutlined, WalletOutlined, MailOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons-vue';

onMounted(() => {
  store.fetchContacts();
});

const contact = computed(() => {
  return store.contact[store.selectedContact];
});
const birthday = ref('November 30, 1997');
const uploader = ref();
const selectedFile = ref('');
function onButtonClick() {
  uploader.value.click();
}
function onFileChanged(e: Event) {
  const inputElement = e.target as HTMLInputElement;
  const file = inputElement.files?.[0];
  selectedFile.value = file ? file.name : '';
}
const modifyUser = async (u: UserProfile) => {
  await store.editContacts(u);
};
</script>

<template>
  <div v-if="contact" class="pa-6">
    <div class="d-flex align-center">
      <img :src="contact.avatar" :alt="contact.avatar" width="48" class="me-2" />
      <div>
        <v-btn color="primary" size="small" variant="outlined" @click="onButtonClick">Change Avatar</v-btn>
        <input ref="uploader" class="d-none" type="file" accept="image/*" @change="onFileChanged" />
      </div>
    </div>

    <form class="my-5">
      <div class="py-3">
        <v-label class="mb-2">Name</v-label>
        <v-text-field variant="outlined" v-model="contact.name" placeholder="Enter name" hide-details single-line color="primary">
          <template v-slot:prepend-inner>
            <UserOutlined class="text-lightText" :style="{ fontSize: '20px' }" />
          </template>
        </v-text-field>
      </div>
      <div class="py-3">
        <v-label class="mb-2">Company</v-label>
        <v-text-field
          variant="outlined"
          v-model="contact.company"
          placeholder="Enter your Company"
          hide-details
          single-line
          color="primary"
        >
          <template v-slot:prepend-inner>
            <BankOutlined class="text-lightText" :style="{ fontSize: '20px' }" />
          </template>
        </v-text-field>
      </div>
      <div class="py-3">
        <v-label class="mb-2">Job title</v-label>
        <v-text-field variant="outlined" v-model="contact.role" placeholder="Enter Job Title" hide-details single-line color="primary">
          <template v-slot:prepend-inner>
            <WalletOutlined class="text-lightText" :style="{ fontSize: '20px' }" />
          </template>
        </v-text-field>
      </div>
      <div class="py-3">
        <v-label class="mb-2">Email</v-label>
        <v-text-field
          variant="outlined"
          v-model="contact.work_email"
          placeholder="Enter your mail"
          hide-details
          single-line
          color="primary"
        >
          <template v-slot:prepend-inner>
            <MailOutlined class="text-lightText" :style="{ fontSize: '20px' }" />
          </template>
        </v-text-field>
      </div>
      <div class="py-3">
        <v-label class="mb-2">Phone</v-label>
        <v-text-field
          variant="outlined"
          v-model="contact.work_phone"
          placeholder="Enter Phone number"
          hide-details
          single-line
          color="primary"
        >
          <template v-slot:prepend-inner>
            <PhoneOutlined class="text-lightText" :style="{ fontSize: '20px' }" />
          </template>
        </v-text-field>
      </div>
      <div class="py-3">
        <v-label class="mb-2">Birthday</v-label>
        <v-text-field variant="outlined" v-model="birthday" placeholder="Enter Birthday" hide-details single-line color="primary">
          <template v-slot:append-inner>
            <CalendarOutlined class="text-lightText" :style="{ fontSize: '20px' }" />
          </template>
        </v-text-field>
      </div>
      <div class="py-3">
        <v-label class="mb-2">Bio</v-label>
        <v-textarea placeholder="Enter message" variant="outlined" single-line v-model="contact.birthdayText"> </v-textarea>
      </div>
      <div class="py-3 pt-0 d-flex ga-2">
        <v-btn variant="flat" color="primary" @click="$emit('closeDrawer'), modifyUser(contact)">Save</v-btn>
        <v-btn variant="outlined" color="secondary" @click="$emit('closeDrawer')">Cancel</v-btn>
      </div>
    </form>
  </div>
</template>
