<script setup lang="ts">
import { useContactStore } from '@/stores/apps/contact';

// icons
import { MessageOutlined, PhoneOutlined } from '@ant-design/icons-vue';

const store = useContactStore();
const props = defineProps({
  getContacts: Object
});

defineEmits(['openDrawer']);
</script>

<template>
  <div v-for="contact in props.getContacts" :key="contact.name">
    <h3 v-if="typeof contact === 'string'" class="text-primary text-h3 mt-5 mb-2">{{ contact }}</h3>
    <div class="d-flex align-center ga-4 py-4 bb" v-else>
      <img :src="contact.avatar" :alt="contact.avatar" width="48" class="rounded-md" />
      <div @click="$emit('openDrawer'), store.SelectContact(contact.id)" class="cursor-pointer w-50">
        <h5 class="text-lg-h4 text-h5 mb-1">{{ contact.name }}</h5>
        <v-list-item-subtitle class="text-subtitle-2 font-weight-medium">{{ contact.role }}</v-list-item-subtitle>
      </div>

      <div class="d-flex align-center ga-2 ms-auto">
        <v-btn color="primary" variant="outlined" size="small" icon rounded="sm">
          <MessageOutlined :style="{ fontSize: '14px' }" />
          <v-tooltip activator="parent" aria-label="tooltip" location="top">Message</v-tooltip>
        </v-btn>

        <v-btn color="secondary" variant="outlined" size="small" icon rounded="sm">
          <PhoneOutlined :style="{ fontSize: '14px' }" />
          <v-tooltip activator="parent" aria-label="tooltip" location="top">Call</v-tooltip>
        </v-btn>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.bb {
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}
</style>
