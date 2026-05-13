<script setup lang="ts">
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";
import {
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

const userId = computed(() => authStore.user?.id);

/** Avoid :to with missing id after logout — Router throws "Missing required param id" */
const userDetailTo = computed((): RouteLocationRaw | undefined => {
  const id = userId.value;
  if (id === undefined || id === null || id === "") return undefined;
  return { name: "UserDetail", params: { id: String(id) } };
});

const userEditTo = computed((): RouteLocationRaw | undefined => {
  const id = userId.value;
  if (id === undefined || id === null || id === "") return undefined;
  return { name: "UserEdit", params: { id: String(id) } };
});
</script>

<template>
  <div>
    <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 150px">
      <v-list class="py-0" aria-label="profile list">
        <v-list-item
          color="primary"
          rounded="0"
          value="View Profile"
          :to="userDetailTo"
        >
          <template #prepend>
            <UserOutlined :style="{ fontSize: '14px' }" class="me-4" />
          </template>
          <v-list-item-title class="text-h6">{{ $t('profile.viewProfile') }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          color="primary"
          rounded="0"
          value="Edit profile"
          :to="userEditTo"
        >
          <template #prepend>
            <EditOutlined :style="{ fontSize: '14px' }" class="me-4" />
          </template>
          <v-list-item-title class="text-h6">{{ $t('profile.editProfile') }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          color="primary"
          rounded="0"
          value="OMR Support"
          :to="{ name: 'SupportSend' }"
        >
          <template #prepend>
            <InfoCircleOutlined :style="{ fontSize: '14px' }" class="me-4" />
          </template>
          <v-list-item-title class="text-h6">{{ $t("omrSupport") }}</v-list-item-title>
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
