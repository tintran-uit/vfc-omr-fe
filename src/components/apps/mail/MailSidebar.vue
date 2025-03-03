<script setup lang="ts">
import { ref, shallowRef, onMounted, computed } from 'vue';
import { useMailStore } from '@/stores/apps/mail';
import MailCompose from './MailCompose.vue';

// icons
import {
  PlusOutlined,
  MailOutlined,
  RestOutlined,
  SendOutlined,
  DiffOutlined,
  WarningOutlined,
  DeleteOutlined,
  StarOutlined,
  TagOutlined,
  BookOutlined
} from '@ant-design/icons-vue';

const store = useMailStore();

onMounted(() => {
  store.fetchMails();
  store.filterMails(store.activeFilter);
});

type MailItem = {
  avatar: string;
  name: string;
  location: string;
  follow: number;
  isRead: boolean;
  spam: boolean;
  sent: boolean;
  trash: boolean;
  // Add other properties as needed
};
const getCounts = computed<MailItem[]>(() => {
  return store.mails;
});

type ItemsType = {
  text?: string;
  icon?: object;
  label?: object;
  iconColor?: string;
  header?: string;
  divider?: boolean;
  slug?: string;
};

const filter = computed(() => {
  return store.activeFilter;
});

const handleFilter = async (string: string) => {
  store.SelectFilter(string);
  await store.filterMails(string);
};
const allCount = computed(() => {
  return getCounts.value.filter((i: MailItem) => !i.isRead).length;
});
const inboxCount = computed(() => {
  return getCounts.value.filter((i: MailItem) => !i.spam && !i.isRead).length;
});
const sentCount = computed(() => {
  return getCounts.value.filter((i: MailItem) => i.sent && !i.isRead).length;
});

const trashCount = computed(() => {
  return getCounts.value.filter((i: MailItem) => i.trash && !i.isRead).length;
});
const items = shallowRef<ItemsType[]>([
  { text: 'All Mail', slug: 'all', icon: MailOutlined, label: allCount, iconColor: 'text-lightText' },
  { text: 'Inbox', slug: 'inbox', icon: RestOutlined, label: inboxCount, iconColor: 'text-lightText' },
  { text: 'Sent', slug: 'sent', icon: SendOutlined, label: sentCount, iconColor: 'text-lightText' },
  { text: 'Draft', slug: 'draft', icon: DiffOutlined, iconColor: 'text-lightText' },
  { text: 'Spam', slug: 'spam', icon: WarningOutlined, iconColor: 'text-lightText' },
  { text: 'Trash', slug: 'trash', icon: DeleteOutlined, label: trashCount, iconColor: 'text-lightText' },
  { divider: true },
  { header: 'Filters' },
  { text: 'Starred', slug: 'starred', icon: StarOutlined, iconColor: 'text-lightText' },
  { text: 'Important', slug: 'important', icon: BookOutlined, iconColor: 'text-lightText' },
  { divider: true },
  { header: 'Label' },
  { text: 'Promotions', slug: 'promotions', icon: TagOutlined, iconColor: 'text-primary' },
  { text: 'Forums', slug: 'forums', icon: TagOutlined, iconColor: 'text-warning' }
]);
const dialog = ref(false);
</script>
<template>
  <div>
    <v-btn color="primary" block size="large" @click="dialog = true"><PlusOutlined />&nbsp; Compose</v-btn>
    <v-list aria-label="chat sidebar" aria-busy="true">
      <template v-for="(item, i) in items" :key="i">
        <v-divider v-if="item.divider" class="my-6"></v-divider>
        <v-list-subheader v-else-if="item.header">{{ item.header }}</v-list-subheader>
        <v-list-item
          :value="item"
          :active="filter === item.slug"
          @click="handleFilter(`${item.slug}`)"
          color="secondary"
          class="rounded-sm no-spacer"
          v-else
        >
          <!---If icon-->
          <template v-slot:prepend>
            <component :is="item.icon as any" :class="`icon-width me-3 ${item.iconColor}`" />
          </template>

          <v-list-item-title>{{ item.text }}</v-list-item-title>
          <!---If any chip or label-->
          <template v-slot:append v-if="item.label">
            <v-chip class="sidebarchip hide-menu" :size="'small'">
              {{ item.label }}
            </v-chip>
          </template>
        </v-list-item>
      </template>
    </v-list>
    <v-dialog v-model="dialog" maxWidth="600" height="700">
      <MailCompose @closeDialog="dialog = false" />
    </v-dialog>
  </div>
</template>
<style lang="scss">
.v-list-item__prepend > .v-icon.icon-width {
  margin-inline-end: 15px;
}
.icon-width {
  font-size: 18px;
}
</style>
