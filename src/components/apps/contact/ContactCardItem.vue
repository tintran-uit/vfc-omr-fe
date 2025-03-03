<script setup lang="ts">
import { useContactStore } from '@/stores/apps/contact';

// icons
import { EllipsisOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons-vue';

const store = useContactStore();

const props = defineProps({
  getContacts: Object
});

defineEmits(['openDrawer']);
</script>
<template>
  <v-row class="mb-0">
    <v-col class="mt-3 pb-0" :lg="typeof contact === 'string' ? '12' : '3'" v-for="contact in props.getContacts" :key="contact.name">
      <h3 v-if="typeof contact === 'string'" class="text-primary text-h3 mt-5 mb-0">{{ contact }}</h3>
      <v-card variant="outlined" class="card-hover-border bg-containerBg" v-else>
        <v-card-text>
          <div class="d-flex">
            <img :src="contact.avatar" :alt="contact.avatar" width="72" />
            <div class="ms-auto">
              <v-menu class="rounded-md" elevation="24" z-index="1">
                <template v-slot:activator="{ props }">
                  <v-btn icon size="small" v-bind="props" variant="text" rounded>
                    <EllipsisOutlined :style="{ fontSize: '20px' }" />
                  </v-btn>
                </template>
                <v-list elevation="24">
                  <v-list-item value="Edit" color="secondary" @click="$emit('openDrawer'), store.SelectContact(contact.id)">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
          <div class="mb-4 mt-5">
            <h4 class="text-h5 mb-1">{{ contact.name }}</h4>
            <span class="text-subtitle-2 text-medium-emphasis font-weight-medium">{{ contact.role }}</span>
            <br /><br />
            <span class="text-subtitle-2 text-medium-emphasis font-weight-medium">Email</span>
            <p class="text-subtitle-2 font-weight-medium">{{ contact.work_email }}</p>
            <v-row class="mt-3">
              <v-col cols="6">
                <span class="text-subtitle-2 text-medium-emphasis font-weight-medium">Phone</span>
                <p class="text-subtitle-2 font-weight-medium">{{ contact.personal_phone }}</p>
              </v-col>
              <v-col cols="6">
                <span class="text-subtitle-2 text-medium-emphasis font-weight-medium">Location</span>
                <p class="text-subtitle-2 font-weight-medium">{{ contact.location }}</p>
              </v-col>
            </v-row>
          </div>
          <div class="d-flex ga-4 mt-5">
            <v-btn variant="flat" color="primary" class="flex-fill">
              <template v-slot:prepend>
                <MessageOutlined />
              </template>
              Message
            </v-btn>
            <v-btn variant="outlined" color="secondary" class="flex-fill">
              <template v-slot:prepend>
                <PhoneOutlined />
              </template>
              Call
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
