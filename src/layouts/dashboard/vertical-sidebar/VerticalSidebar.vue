<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import sidebarItems from './sidebarItem';
import type { menu } from './sidebarItem';

import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';

import { useAuthStore } from '@/stores/authStore';
import { useVerseStore } from '@/stores/verseStore';
import { usePastorChurchStore } from '@/stores/pastorChurchStore';

function filterNavigationByPermissions(items, canFn) {
  return items
    .map(item => {
      const filteredChildren = item.children
        ? filterNavigationByPermissions(item.children, canFn)
        : [];

      // Check permission
      let hasPermission = true;
      if (item.permissions) {
        if (Array.isArray(item.permissions)) {
          hasPermission = item.permissions.every(perm => canFn(perm));
        } else {
          hasPermission = canFn(item.permissions);
        }
      }

      const hasChildren = filteredChildren.length > 0;
      const isLink =
        item.to !== undefined &&
        item.to !== null &&
        item.to !== '#';

      /**
       * ❗ RULE QUAN TRỌNG:
       * - Không phải link
       * - Và không có children
       * => REMOVE LUÔN
       */
      if (!isLink && !hasChildren) {
        return null;
      }

      /**
       * ❗ Item là link nhưng không có quyền
       */
      if (isLink && !hasPermission) {
        return null;
      }

      return {
        ...item,
        children: hasChildren ? filteredChildren : undefined,
      };
    })
    .filter(Boolean);
}

function resolveSidebarLinks(
  items: menu[],
  churchId: number | string | null | undefined,
  userId: number | string | null | undefined,
): menu[] {
  return items
    .map((item) => {
      const resolvedChildren = item.children
        ? resolveSidebarLinks(item.children, churchId, userId)
        : undefined;

      if (item.id === 'my-profile') {
        if (userId === undefined || userId === null || userId === '') return null;
        return {
          ...item,
          to: `/users/${userId}`,
          children: resolvedChildren,
        };
      }

      if (item.id === 'my-church-profile') {
        if (!churchId) return null;
        return {
          ...item,
          to: `/churches/${churchId}`,
        };
      }

      if (resolvedChildren) {
        return {
          ...item,
          children: resolvedChildren,
        };
      }

      return item;
    })
    .filter(Boolean) as menu[];
}

const authStore = useAuthStore();
const verseStore = useVerseStore();
const pastorChurchStore = usePastorChurchStore();
const customizer = useCustomizerStore();

/* Re-compute when permissions change (e.g. after login or role-based sync from authStore). */
const sidebarMenu = computed(() => {
  const churchId = authStore.can("dashboard.my-church")
    ? pastorChurchStore.selectedChurchId
    : undefined;
  const withResolvedLinks = resolveSidebarLinks(sidebarItems, churchId, authStore.user?.id);
  return filterNavigationByPermissions(withResolvedLinks, (p) => authStore.can(p));
});

const verseText = computed(() => verseStore.body.replace(/\r\n/g, "\n").trim());

onMounted(() => {
  verseStore.fetch().catch(() => {});
});
</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="60"
    mobile-breakpoint="lg"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
  >
    <!---Logo part -->

    <div class="pa-5">
      <div class="logo">
          <RouterLink :to="{name: 'Dashboard'}" aria-label="logo">
            <img src="@/assets/images/logo/logo.png" alt="Logo" height="50" />
          </RouterLink>
        </div>
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar" :options="{ suppressScrollX: true }">
      <v-list aria-busy="true" aria-label="menu list">
        <!---Menu Loop -->
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <!---Item Sub Header -->
          <NavGroup :item="item" v-if="item.header" :key="item.title" />
          <!---Item Divider -->
          <v-divider class="my-3" v-else-if="item.divider" />
          <!---If Has Child -->
          <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
          <!---Single Item-->
          <NavItem :item="item" v-else />
          <!---End Single Item-->
        </template>
      </v-list>
      <div
        v-if="verseStore.heading || verseText"
        class="sidebar-verse"
      >
        <div
          v-if="verseStore.heading"
          class="sidebar-verse__heading"
        >
          {{ verseStore.heading }}
        </div>
        <div
          v-if="verseText"
          class="sidebar-verse__body"
        >
          {{ verseText }}
        </div>
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
