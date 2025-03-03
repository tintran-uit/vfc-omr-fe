<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue';
import { useDisplay } from 'vuetify';
import { useChatStore } from '@/stores/apps/chat';
import type { ChatDetailType, ChatHistory } from '@/types/chats/ChatTypes';
import ChatListing from './ChatListing.vue';
import ChatProfile from './ChatProfile.vue';
import ChatSendMsg from './ChatSendMsg.vue';
import ChatInfo from './ChatInfo.vue';

import user1 from '@/assets/images/users/avatar-1.png';

// icons
import {
  MenuFoldOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  MinusCircleFilled,
  PhoneOutlined,
  VideoCameraOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  DownloadOutlined,
  AudioMutedOutlined,
  DeleteOutlined,
  EditOutlined,
  BackwardFilled,
  ForwardFilled,
  CopyOutlined
} from '@ant-design/icons-vue';

const items = shallowRef([
  {
    title: 'Archive',
    icon: DownloadOutlined
  },
  {
    title: 'Muted',
    icon: AudioMutedOutlined
  },
  {
    title: 'Rating',
    icon: DeleteOutlined
  }
]);

const replyitems = shallowRef([
  {
    title: 'Reply',
    icon: BackwardFilled
  },
  {
    title: 'Forward',
    icon: ForwardFilled
  },
  {
    title: 'Copy',
    icon: CopyOutlined
  },
  {
    title: 'Delete',
    icon: DeleteOutlined
  }
]);

const { mdAndUp } = useDisplay();
const infodrawer = ref(false);
const sDrawer = ref(false);

const store = useChatStore();
onMounted(() => {
  store.fetchChats();
});
const chatDetail = computed<ChatDetailType | null>(() => {
  const chat = store.chats[store.chatContent];
  if (chat) {
    // Ensure chatHistory follows the correct structure
    const chatHistory: ChatHistory[] = [];
    for (let i = 0; i < chat.chatHistory.length; i++) {
      const historyItem = chat.chatHistory[i];
      // Ensure each history item has the required id property
      const formattedHistoryItem: ChatHistory = {
        from: { from: historyItem.from.from, to: historyItem.from.to, id: 0 },
        to: { from: historyItem.to.from, to: historyItem.to.to, id: 1 }
      };

      chatHistory.push(formattedHistoryItem);
    }
    return { ...chat, chatHistory };
  } else {
    return null;
  }
});
</script>
<template>
  <div v-if="chatDetail" class="customHeight">
    <div class="d-sm-flex justify-space-between align-center">
      <div class="d-flex align-center">
        <!---Toggle Button For mobile-->
        <v-btn icon @click="sDrawer = !sDrawer" variant="text" class="d-md-none d-sm-flex ms-4">
          <Menu2Icon size="20" />
        </v-btn>
        <div class="d-sm-flex align-center ga-4 pa-4">
          <!---Toggle Button-->
          <v-btn icon @click="$emit('sToggle')" variant="text" rounded class="d-none d-md-flex">
            <MenuFoldOutlined class="text-lightText" :style="{ fontSize: '20px' }" />
          </v-btn>

          <!---Topbar Row-->
          <div class="d-flex align-center">
            <!---User Avatar-->
            <v-avatar>
              <img :src="chatDetail.thumb" alt="pro" width="40" />
            </v-avatar>

            <component
              class="badg-Detail"
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
            <!---Name & Last seen-->
            <div>
              <h5 class="text-subtitle-1 mb-0">{{ chatDetail.name }}</h5>
              <small class="text-medium-emphasis"> Active {{ chatDetail.lastMessage }} </small>
            </div>
          </div>
        </div>
      </div>
      <!---Topbar Icons-->
      <div class="ms-sm-auto ms-4 ga-2 d-flex pb-2 pb-sm-0">
        <v-btn icon variant="text" rounded>
          <PhoneOutlined class="text-lightText" :style="{ fontSize: '20px' }" />
        </v-btn>
        <v-btn icon variant="text" rounded>
          <VideoCameraOutlined class="text-lightText" :style="{ fontSize: '20px' }" />
        </v-btn>
        <v-btn icon variant="text" rounded @click.stop="infodrawer = !infodrawer">
          <InfoCircleOutlined class="text-lightText" :style="{ fontSize: '20px' }" />
        </v-btn>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon variant="text" rounded v-bind="props">
              <MoreOutlined class="text-lightText" :style="{ fontSize: '20px' }" />
            </v-btn>
          </template>

          <v-list elevation="24" width="110" density="compact" class="py-0">
            <v-list-item v-for="(item, index) in items" :key="index" :value="index">
              <template v-slot:prepend>
                <component :is="item.icon" class="me-2" />
              </template>
              <v-list-item-title class="text-h6">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <!---Topbar Icons-->
    </div>
    <v-divider />
    <!---Chat History-->
    <perfect-scrollbar style="min-height: calc(100vh - 495px); height: 430px">
      <div v-for="(chat, index) in chatDetail.chatHistory" :key="index" class="pa-5 bg-containerBg">
        <div v-for="(from, index) in chat" :key="index">
          <div v-for="ch in from.from" :key="ch" class="d-flex position-relative">
            <v-avatar size="40" variant="flat" class="me-2">
              <img :src="chatDetail.thumb" width="40" alt="vector" />
            </v-avatar>
            <component
              class="detail-badg-dot"
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
            <div class="mb-3">
              <v-sheet class="bg-surface rounded-md pa-3 mb-1 text-end">
                <p class="text-body-1 mb-0">{{ ch }}</p>
              </v-sheet>
              <small class="text-medium-emphasis">{{ chatDetail.lastMessage }}</small>
            </div>
          </div>
          <div v-for="chTo in from.to" :key="chTo" class="ms-auto text-end">
            <div class="d-flex flex-end userReply position-relative">
              <v-avatar size="40" variant="flat" class="ms-2">
                <img :src="user1" width="40" alt="vector" />
              </v-avatar>
              <component class="detail-badg-dot text-success" :is="CheckCircleFilled" :style="{ fontSize: '12px' }" />
              <div class="mb-3">
                <v-sheet class="bg-primary rounded-md pa-3 mb-1 d-inline-block">
                  <p class="text-body-1 mb-0">{{ chTo }}</p>
                </v-sheet>
                <small class="text-medium-emphasis d-block">
                  {{ chatDetail.lastMessage }}
                </small>
              </div>
              <div style="min-width: 80px">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn icon variant="text" size="small" rounded v-bind="props">
                      <MoreOutlined class="text-lightText" />
                    </v-btn>
                  </template>

                  <v-list elevation="24" width="108" density="compact" class="py-0">
                    <v-list-item v-for="(item, index) in replyitems" :key="index" :value="index">
                      <template v-slot:prepend>
                        <component :is="item.icon" :style="{ fontSize: '12px' }" class="me-2" />
                      </template>
                      <v-list-item-title class="text-h6">{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-btn size="small" variant="text" class="me-2" rounded icon>
                  <EditOutlined class="text-lightText" />
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </perfect-scrollbar>
    <!---Chat send-->
    <ChatSendMsg />
    <!-- Info Sidebar -->
    <v-navigation-drawer v-model="infodrawer" temporary location="end" width="300">
      <ChatInfo @s-Toggle="infodrawer = !infodrawer" />
    </v-navigation-drawer>

    <v-navigation-drawer temporary v-model="sDrawer" width="300" top v-if="!mdAndUp">
      <perfect-scrollbar style="height: calc(100vh - 60px)">
        <v-card-text class="pa-5">
          <h5 class="text-h5">
            Messages
            <v-chip color="secondary" size="x-small" variant="flat"> 9 </v-chip>
          </h5>
          <ChatListing />
          <ChatProfile />
        </v-card-text>
      </perfect-scrollbar>
    </v-navigation-drawer>
  </div>
</template>
<style lang="scss">
.customHeight {
  min-height: calc(100vh - 300px);
}
.badg-dotDetail {
  left: -16px;
  position: relative;
  top: -16px;
  [dir='rtl'] & {
    left: unset;
    right: -16px;
  }
}
.detail-badg-dot {
  position: absolute;
  top: 0;
  left: 28px;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 100%;
  [dir='rtl'] & {
    left: unset;
    right: 28px;
  }
}
.userReply {
  flex-flow: row-reverse;
  .detail-badg-dot {
    right: 0;
    left: unset;
    [dir='rtl'] & {
      left: 0;
      right: unset;
    }
  }
}
.badg-Detail {
  left: -12px;
  position: relative;
  top: -15px;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 100%;
  [dir='rtl'] & {
    left: unset;
    right: -12px;
  }
}
</style>
