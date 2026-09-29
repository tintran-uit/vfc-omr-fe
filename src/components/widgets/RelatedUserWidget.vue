<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CardHeader from '../shared/CardHeader.vue'
import Avatar from '@/components/ui/Avatar.vue'
import { userService } from '@/services/userService'
import defaultAvatar from '@/assets/images/users/avatar-default.svg'

const props = defineProps<{
  churchId: number
}>()

const { t } = useI18n()
const items = ref<Record<string, any>[]>([])

const PAGE_SIZE = 100

const fullName = (item: Record<string, any>) => {
  const named = [item.prefix, item.first_name, item.last_name].filter(Boolean).join(' ').trim()
  return named || item.name || ''
}

const roleName = (item: Record<string, any>) => item.role_name || item.role?.name || ''

const metaOf = (item: Record<string, any>) => [
  { key: 'role', label: t('user.omrRole'), value: roleName(item) },
  { key: 'omr', label: t('user.ormId'), value: item.id ?? '' },
  { key: 'username', label: t('user.username'), value: item.username || '' },
]

const fetchData = async () => {
  if (!props.churchId) {
    items.value = []
    return
  }

  const all: Record<string, any>[] = []
  let page = 1
  let total = 0

  do {
    const data = await userService.getRelatedUserListOfChurch(
      props.churchId,
      {
        page,
        limit: PAGE_SIZE,
        sort_by: 'id',
        sort_desc: 'true',
      },
      false,
    )
    const batch = Array.isArray(data?.items) ? data.items : []
    total = Number(data?.total ?? batch.length)
    all.push(...batch)
    if (batch.length < PAGE_SIZE) break
    page += 1
  } while (all.length < total && page <= 50)

  items.value = all
}

watch(
  () => props.churchId,
  () => {
    fetchData()
  },
  { immediate: true },
)
</script>

<template>
  <CardHeader :title="$t('user.relatedUsers')">
    <div class="pa-4">
      <div
        v-if="!items.length"
        class="text-medium-emphasis text-body-2"
      >
        {{ $t('noData') }}
      </div>

      <v-row v-else>
        <v-col
          v-for="item in items"
          :key="item.id"
          cols="12"
          md="6"
        >
          <div class="related-user-item">
            <Avatar
              :src="item.photo_url || defaultAvatar"
              :size="72"
              class="related-user-item__avatar"
            />

            <div class="related-user-item__body">
              <div class="related-user-item__name">
                {{ fullName(item) || '—' }}
              </div>
              <div
                v-if="item.title"
                class="related-user-item__title"
              >
                {{ item.title }}
              </div>

              <div class="related-user-item__meta">
                <div
                  v-for="field in metaOf(item)"
                  :key="field.key"
                  class="related-user-item__row"
                >
                  <span class="related-user-item__label">{{ field.label }}</span>
                  <span class="related-user-item__value">{{ field.value || '—' }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </CardHeader>
</template>

<style scoped>
.related-user-item {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 100%;
  padding: 14px 16px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
}

.related-user-item__avatar {
  flex-shrink: 0;
}

.related-user-item__body {
  min-width: 0;
  flex: 1 1 auto;
}

.related-user-item__name {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
}

.related-user-item__title {
  margin-top: 2px;
  font-size: 0.8125rem;
  line-height: 1.35;
  color: rgba(var(--v-theme-on-surface), 0.62);
}

.related-user-item__meta {
  margin-top: 8px;
}

.related-user-item__row {
  display: flex;
  gap: 8px;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.45;
}

.related-user-item__row + .related-user-item__row {
  margin-top: 1px;
}

.related-user-item__label {
  flex: 0 0 4.75rem;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.related-user-item__value {
  min-width: 0;
}
</style>
