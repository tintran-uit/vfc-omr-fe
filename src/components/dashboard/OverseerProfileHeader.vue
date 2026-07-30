<script setup lang="ts">
import { computed, inject, type Ref } from "vue";

import defaultAvatar from "@/assets/images/users/avatar-1.png";

const props = defineProps<{
  user?: {
    name?: string;
    role_name?: string;
    photo_url?: string;
  } | null;
}>();

const dashboardData = inject<Ref<Record<string, any>>>("dashboardData");

const avatarUrl = computed(() => props.user?.photo_url || defaultAvatar);

const geographicalRegionNames = computed(() => {
  const regions =
    dashboardData?.value?.overseer_permissions?.allowedIds?.geographicalRegionIds;
  return regions?.map((item: { name: string }) => item.name).join(", ") || "";
});
</script>

<template>
  <v-card
    v-if="user"
    flat
    class="overseer-profile-header bg-surface"
  >
    <div class="overseer-profile-header__cover" />

    <v-container class="position-relative pb-4">
      <v-row>
        <v-col
          cols="12"
          sm="auto"
          class="position-relative text-center text-sm-start"
        >
          <v-avatar
            size="149"
            class="elevation-4 overseer-profile-header__avatar"
          >
            <v-img
              :src="avatarUrl"
              :alt="user?.name"
              cover
            />
          </v-avatar>
        </v-col>

        <v-col
          cols="12"
          sm
          class="d-flex flex-column justify-center text-center text-sm-start overseer-profile-header__info"
        >
          <div class="text-h4 text-medium-emphasis mb-1">
            {{ user?.name }}
          </div>

          <div
            v-if="user?.role_name"
            class="text-body-1 text-medium-emphasis mb-1"
          >
            {{ user.role_name }}
          </div>

          <div
            v-if="geographicalRegionNames"
            class="text-body-1 text-medium-emphasis"
          >
            {{ geographicalRegionNames }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
