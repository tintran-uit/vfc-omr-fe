<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import ChatListing from '@/components/apps/chats/ChatListing.vue';
import ChatDetail from '@/components/apps/chats/ChatDetail.vue';
import ChatProfile from '@/components/apps/chats/ChatProfile.vue';

const { mdAndUp } = useDisplay();
const toggleSide = ref(false);
</script>
<template>
  <v-row class="mt-0">
    <v-col v-if="!toggleSide && mdAndUp" class="d-flex align-stretch chatSidebar pr-md-0">
      <v-card variant="outlined" class="bg-surface br-0">
        <v-card-text class="pa-5">
          <h5 class="text-h5">
            Messages
            <v-chip color="secondary" size="x-small" variant="flat"> 9 </v-chip>
          </h5>
          <ChatListing />
          <ChatProfile />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col class="d-flex align-stretch pl-md-0">
      <v-card variant="outlined" class="bg-surface bl-0">
        <ChatDetail @s-Toggle="toggleSide = !toggleSide" />
      </v-card>
    </v-col>
  </v-row>
</template>
<style lang="scss">
.br-0 {
  @media (min-width: 960px) {
    border-right: none;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
.bl-0 {
  @media (min-width: 960px) {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
}
.custom-main {
  margin: 0;
}
.chatSidebar {
  max-width: 319px;
  .v-list-item__prepend {
    > .v-avatar {
      ~ .v-list-item__spacer {
        width: 0;
      }
    }
  }
}
</style>
