<script setup lang="ts">
import { shallowRef, computed, onMounted, ref } from 'vue';
import { useChatStore } from '@/stores/apps/chat';

// icons
import {
  CheckCircleFilled,
  ClockCircleFilled,
  MinusCircleFilled,
  PhoneOutlined,
  MessageOutlined,
  VideoCameraOutlined,
  FolderOpenOutlined,
  LinkOutlined,
  MoreOutlined,
  FileDoneOutlined,
  RightOutlined,
  PictureOutlined,
  FileSyncOutlined,
  CloseOutlined
} from '@ant-design/icons-vue';

const attach = shallowRef([
  {
    color: 'success',
    icon: FileDoneOutlined,
    name: 'Document',
    size: '123 files, 193MB'
  },
  {
    color: 'warning',
    icon: PictureOutlined,
    name: 'Photos',
    size: '53 files, 321MB'
  },
  {
    color: 'primary',
    icon: FileSyncOutlined,
    name: 'Other',
    size: '49 files, 193MB'
  }
]);

const store = useChatStore();
onMounted(() => {
  store.fetchChats();
});

interface ChatItem {
  // Define the properties of a chat item here
  thumb: string;
  status: string;
  name: string;
  excerpt: string;
  // ... other properties as needed
}

const chatDetail = computed<ChatItem | undefined>(() => {
  return store.chats[store.chatContent];
});

const panel1 = ref([0]);
</script>
<template>
  <div v-if="chatDetail" class="customHeight pa-4">
    <div class="text-end">
      <v-btn color="error" variant="text" icon rounded size="small" @click="$emit('sToggle')">
        <CloseOutlined />
      </v-btn>
    </div>
    <div class="py-4">
      <div class="text-center">
        <v-avatar size="88" variant="outlined" color="primary">
          <img :src="chatDetail.thumb" alt="pro" width="88" height="88" class="rounded-circle" />
        </v-avatar>
        <h4 class="text-h5 mt-3 mb-0">{{ chatDetail.name }}</h4>
        <p class="text-caption text-lightText">{{ chatDetail.excerpt }}</p>
        <div class="d-flex ga-2 align-center justify-center">
          <component
            :is="
              chatDetail.status === 'away'
                ? ClockCircleFilled
                : chatDetail.status === 'do not disturb'
                  ? MinusCircleFilled
                  : chatDetail.status === 'active'
                    ? CheckCircleFilled
                    : 'containerBg'
            "
            :style="{ fontSize: '12px' }"
            :class="
              chatDetail.status === 'away'
                ? 'text-warning'
                : chatDetail.status === 'do not disturb'
                  ? 'text-secondary'
                  : chatDetail.status === 'active'
                    ? 'text-success'
                    : 'text-containerBg'
            "
          />
          <v-chip
            :color="
              chatDetail.status === 'away'
                ? 'warning'
                : chatDetail.status === 'do not disturb'
                  ? 'secondary'
                  : chatDetail.status === 'active'
                    ? 'success'
                    : 'text-containerBg'
            "
            label
            size="small"
            >{{ chatDetail.status }}</v-chip
          >
        </div>
      </div>
      <div class="d-flex align-center justify-center ga-4 mt-6">
        <v-btn elevation="24" icon rounded size="small">
          <PhoneOutlined class="text-lightText" :style="{ fontSize: '16px' }" />
        </v-btn>
        <v-btn elevation="24" icon rounded size="small">
          <MessageOutlined class="text-lightText" :style="{ fontSize: '16px' }" />
        </v-btn>
        <v-btn elevation="24" icon rounded size="small">
          <VideoCameraOutlined class="text-lightText" :style="{ fontSize: '16px' }" />
        </v-btn>
      </div>
      <div class="d-flex ga-4 mt-6">
        <div class="bg-lightprimary w-100 pa-4 rounded-lg">
          <h6 class="text-h6 text-primary mb-0">All File</h6>
          <div class="d-flex align-center">
            <FolderOpenOutlined class="text-primary" />
            <h4 class="text-h4 mb-0 ms-2">231</h4>
          </div>
        </div>
        <div class="bg-gray100 w-100 pa-4 rounded-lg">
          <h6 class="text-h6 mb-0">All Link</h6>
          <div class="d-flex align-center">
            <LinkOutlined />
            <h4 class="text-h4 mb-0 ms-2">231</h4>
          </div>
        </div>
      </div>
    </div>
    <v-expansion-panels v-model="panel1" class="accordionWithoutBorder mt-2">
      <v-expansion-panel elevation="0">
        <v-expansion-panel-title class="text-h5 pa-0 pb-3" color="surface">Information</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list density="compact" class="pa-0" aria-label="information list" aria-busy="true" nav>
            <v-list-item class="pa-0">
              <div class="d-flex">
                <p class="mb-0 text-h6">Address</p>
                <p class="mb-0 text-h6 text-lightText ms-auto">Afghanistan</p>
              </div>
            </v-list-item>
            <v-list-item class="pa-0">
              <div class="d-flex">
                <p class="mb-0 text-h6">Email</p>
                <p class="mb-0 text-h6 text-lightText ms-auto">keefe@gmil.com</p>
              </div>
            </v-list-item>
            <v-list-item class="pa-0">
              <div class="d-flex">
                <p class="mb-0 text-h6">Phone</p>
                <p class="mb-0 text-h6 text-lightText ms-auto">253-418-5940</p>
              </div>
            </v-list-item>
            <v-list-item class="pa-0">
              <div class="d-flex">
                <p class="mb-0 text-h6">Last visited</p>
                <p class="mb-0 text-h6 text-lightText ms-auto">1:20 AM</p>
              </div>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="d-flex justify-space-between align-center mt-4">
      <h5 class="text-h5 mb-0">Notification</h5>
      <v-switch color="primary" aria-label="switch" class="switchRight" :model-value="true" hide-details></v-switch>
    </div>
    <v-divider></v-divider>
    <div class="d-flex justify-space-between align-center py-2">
      <h5 class="text-h5 mb-0">File type</h5>
      <v-btn icon rounded variant="text" size="small">
        <MoreOutlined class="text-lightText" :style="{ fontSize: '16px' }" />
      </v-btn>
    </div>
    <v-divider></v-divider>
    <v-list density="compact" lines="two" aria-label="files list" aria-busy="true">
      <v-list-item v-for="(file, i) in attach" :key="i" rounded="sm" color="secondary" class="pa-0">
        <template v-slot:prepend>
          <div class="me-3">
            <v-avatar size="40" :color="file.color" variant="tonal" rounded="md">
              <component :is="file.icon" :class="'text-' + file.color" />
            </v-avatar>
          </div>
        </template>
        <template v-slot:append>
          <v-btn icon size="x-small" variant="text" rounded>
            <RightOutlined class="text-lightText" />
          </v-btn>
        </template>
        <div class="w-100">
          <h6 class="text-h6 mb-0">{{ file.name }}</h6>
          <span class="text-h6 text-lightText">{{ file.size }}</span>
        </div>
      </v-list-item>
    </v-list>
  </div>
</template>
<style lang="scss">
.accordionWithoutBorder {
  .v-expansion-panel {
    border: none;
    .v-expansion-panel-title {
      border-bottom: 1px solid rgb(var(--v-theme-borderLight));
      min-height: unset;
      &:hover {
        > .v-expansion-panel-title__overlay {
          opacity: 0;
        }
      }
    }
    .v-expansion-panel-text__wrapper {
      border-top: none;
      padding: 0;
      padding-top: 15px;
    }
  }
}
</style>
