<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from '@/stores/apps/chat';

// icons
import { SmileOutlined, PaperClipOutlined, PictureOutlined, SoundOutlined, SendOutlined } from '@ant-design/icons-vue';

const msg = ref('');
const store = useChatStore();

function addItemAndClear(item: string) {
  if (item.length === 0) {
    return;
  }
  store.sendMsg(store.chatContent + 1, msg.value);
  msg.value = '';
}
</script>

<template>
  <v-divider></v-divider>
  <form class="pa-4" @submit.prevent="addItemAndClear(msg)">
    <v-textarea placeholder="Your message..." v-model="msg" variant="underlined"></v-textarea>
    <div class="d-flex align-center">
      <v-btn icon rounded variant="text" size="small">
        <SmileOutlined class="text-lightText" :style="{ fontSize: '16px' }" />
      </v-btn>
      <v-btn icon rounded variant="text" size="small">
        <PaperClipOutlined class="text-lightText" :style="{ fontSize: '16px' }" />
      </v-btn>
      <v-btn icon rounded variant="text" size="small">
        <PictureOutlined class="text-lightText" :style="{ fontSize: '16px' }" />
      </v-btn>
      <v-btn icon rounded variant="text" size="small">
        <SoundOutlined class="text-lightText" :style="{ fontSize: '16px' }" />
      </v-btn>
      <v-btn icon rounded variant="text" class="ms-auto" color="primary" type="submit">
        <SendOutlined :style="{ fontSize: '20px' }" />
      </v-btn>
    </div>
  </form>
</template>
