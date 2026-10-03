<script setup lang="ts">
import { computed, inject, type Ref } from "vue";

import defaultAvatar from "@/assets/images/users/avatar-default.svg";

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
    class="overseer-profile-header mb-4"
  >
    <v-card-text class="pa-4 pa-md-5">
      <div class="overseer-profile-header__row">
        <v-avatar
          size="56"
          class="overseer-profile-header__avatar"
        >
          <v-img
            :src="avatarUrl"
            :alt="user?.name"
            cover
          />
        </v-avatar>

        <div class="overseer-profile-header__text">
          <h1 class="overseer-profile-header__name">
            {{ user?.name }}
          </h1>
          <div
            v-if="user?.role_name"
            class="overseer-profile-header__role"
          >
            {{ user.role_name }}
          </div>
          <div
            v-if="geographicalRegionNames"
            class="overseer-profile-header__regions"
          >
            {{ geographicalRegionNames }}
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
$app-text: #1c1c1e;
$app-secondary: #8e8e93;

.overseer-profile-header__row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.overseer-profile-header__avatar {
  flex: 0 0 auto;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.overseer-profile-header__text {
  min-width: 0;
}

.overseer-profile-header__name {
  margin: 0;
  color: $app-text;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
}

.overseer-profile-header__role,
.overseer-profile-header__regions {
  color: $app-secondary;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.35;
}
</style>
