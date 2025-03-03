<script setup>
import { ref, onMounted, computed } from 'vue';
import { useChatStore } from '@/stores/apps/chat';

// icons
import { CheckCircleFilled, ClockCircleFilled, MinusCircleFilled, CheckOutlined } from '@ant-design/icons-vue';

const store = useChatStore();

onMounted(() => {
  store.fetchChats();
});

const getChats = computed(() => {
  return store.getChats;
});

const chatItem = getChats;
const searchValue = ref('');
const filteredChats = computed(() => {
  return chatItem.value.filter((chat) => {
    return chat.name.toLowerCase().includes(searchValue.value.toLowerCase());
  });
});
</script>
<template>
  <div class="py-3 mt-2">
    <v-text-field
      variant="outlined"
      v-model="searchValue"
      prepend-inner-icon="$magnify"
      persistent-placeholder
      placeholder="Search Contact"
      hide-details
    ></v-text-field>
  </div>
  <perfect-scrollbar class="mb-3" style="height: 430px">
    <v-list aria-label="chat list" aria-busy="true">
      <!---Single Item-->
      <v-list-item
        :value="chat.id"
        color="secondary"
        class="text-no-wrap chatItem"
        v-for="chat in filteredChats"
        :key="chat.id"
        lines="two"
        :active="store.chatContent === chat.id - 1"
        @click="store.SelectChat(chat.id)"
      >
        <!---Avatar-->
        <template v-slot:prepend>
          <v-avatar>
            <img :src="chat.thumb" alt="pro" width="40" />
          </v-avatar>
          <component
            class="badg-dot"
            :is="
              chat.status === 'away'
                ? ClockCircleFilled
                : chat.status === 'do not disturb'
                  ? MinusCircleFilled
                  : chat.status === 'active'
                    ? CheckCircleFilled
                    : 'containerBg'
            "
            :style="{ fontSize: '12px' }"
            :class="
              chat.status === 'away'
                ? 'text-warning'
                : chat.status === 'do not disturb'
                  ? 'text-secondary'
                  : chat.status === 'active'
                    ? 'text-success'
                    : 'text-containerBg'
            "
          />
        </template>
        <!---Name-->
        <v-list-item-title class="text-h5 pe-2">{{ chat.name }}</v-list-item-title>
        <!---Subtitle-->
        <v-list-item-subtitle class="text-caption mt-n1 text-lightText" style="opacity: 1">
          {{ chat.excerpt }}
        </v-list-item-subtitle>
        <!---Last seen--->
        <template v-slot:append>
          <div class="d-flex flex-column text-end">
            <small class="text-medium-emphasis text-caption">{{ chat.lastMessage }}</small>
            <v-badge dot color="primary" :content="chat.unReadChatCount" inline v-if="chat.unReadChatCount"></v-badge>
            <CheckOutlined v-else class="text-end text-lightText" :style="{ fontSize: '12px' }" />
          </div>
        </template>
      </v-list-item>
    </v-list>
  </perfect-scrollbar>
</template>
<style lang="scss">
.chatItem {
  padding: 16px !important;
  border-bottom: 1px solid rgb(var(--v-theme-inputBorder), 0.1);
}
.badg-dot {
  position: relative;
  top: -14px;
  left: -11px;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 100%;
  [dir='rtl'] & {
    left: unset;
    right: -11px;
  }
}
</style>
