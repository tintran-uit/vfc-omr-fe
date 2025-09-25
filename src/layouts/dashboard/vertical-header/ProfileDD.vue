<script setup lang="ts">
import { computed } from 'vue'
import {
  UserOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LockOutlined,
  CommentOutlined,
  UnorderedListOutlined,
  EditOutlined,
  LogoutOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/authStore'
import defaultAvatar from '@/assets/images/users/avatar-1.png'

const authStore = useAuthStore()
const avatarUrl = computed(() => authStore.user?.photo_url || defaultAvatar)
</script>

<template>
  <div>
    <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 150px">
      <v-list class="py-0" aria-label="profile list">
        <v-list-item color="primary" rounded="0" value="Edit profile">
          <template #prepend>
            <EditOutlined :style="{ fontSize: '14px' }" class="me-4" />
          </template>
          <v-list-item-title class="text-h6">{{ $t('profile.editProfile') }}</v-list-item-title>
        </v-list-item>

        <v-list-item color="primary" rounded="0" value="View Profile">
          <template #prepend>
            <UserOutlined :style="{ fontSize: '14px' }" class="me-4" />
          </template>
          <v-list-item-title class="text-h6">{{ $t('profile.viewProfile') }}</v-list-item-title>
        </v-list-item>

        <v-list-item color="primary" rounded="0" value="OMR Support">
          <template #prepend>
            <InfoCircleOutlined :style="{ fontSize: '14px' }" class="me-4" />
          </template>
          <v-list-item-title class="text-h6">OMR Suppport</v-list-item-title>
        </v-list-item>

        <v-list-item @click="authStore.logout()" color="secondary" rounded="0">
              <template v-slot:prepend>
                <LogoutOutlined :style="{ fontSize: '14px' }" class="me-4" />
              </template>

              <v-list-item-title class="text-h6"> {{ $t('logout') }}</v-list-item-title>
            </v-list-item>
      </v-list>
    </perfect-scrollbar>
  </div>
</template>
