<script setup>
import { ref, shallowRef } from 'vue';
import user1 from '@/assets/images/users/avatar-1.png';

// icons
import {
  CheckCircleFilled,
  ClockCircleFilled,
  MinusCircleFilled,
  RightOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons-vue';

const status = ref('active');
const items = shallowRef([
  {
    title: 'active',
    icon: CheckCircleFilled,
    color: 'success'
  },
  {
    title: 'away',
    icon: ClockCircleFilled,
    color: 'warning'
  },
  {
    title: 'do not disturb',
    icon: MinusCircleFilled,
    color: 'secondary'
  }
]);
</script>
<template>
  <!---Bottombar Row-->
  <v-list rounded="md" density="comfortable" aria-label="profile list" aria-busy="true" elevation="0" class="border-0 py-0" border>
    <v-list-item>
      <template v-slot:prepend>
        <component :is="LogoutOutlined" :style="{ fontSize: '14px' }" :class="' me-2'" />
      </template>
      <v-list-item-title class="text-h6"> LogOut </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <template v-slot:prepend>
        <component :is="SettingOutlined" :style="{ fontSize: '14px' }" :class="' me-2'" />
      </template>
      <v-list-item-title class="text-h6"> Settings </v-list-item-title>
    </v-list-item>
  </v-list>
  <v-divider></v-divider>
  <div class="d-flex align-center pa-5 pb-0">
    <!---User Avatar-->
    <v-avatar class="me-2">
      <img :src="user1" alt="pro" width="40" />
    </v-avatar>

    <component
      class="badg-dotDetail"
      :is="
        status === 'away'
          ? ClockCircleFilled
          : status === 'do not disturb'
            ? MinusCircleFilled
            : status === 'active'
              ? CheckCircleFilled
              : 'containerBg'
      "
      :style="{ fontSize: '12px' }"
      :class="
        status === 'away'
          ? 'text-warning'
          : status === 'do not disturb'
            ? 'text-secondary'
            : status === 'active'
              ? 'text-success'
              : 'text-containerBg'
      "
    />
    <!---Name & Last seen-->
    <div>
      <h5 class="text-h5 mb-0">John Doe</h5>
    </div>
    <div class="ms-auto">
      <v-menu location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" variant="text" size="x-small" rounded>
            <RightOutlined class="text-lightText" :style="{ fontSize: '12px' }"
          /></v-btn>
        </template>
        <v-list width="150" rounded="md" density="compact" elevation="24" class="py-0">
          <v-list-item v-for="(item, index) in items" :key="index" :value="index">
            <template v-slot:prepend>
              <component :is="item.icon" :style="{ fontSize: '12px' }" :class="' me-2 text-' + item.color" />
            </template>
            <v-list-item-title class="text-h6" @click="status = item.title">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>
