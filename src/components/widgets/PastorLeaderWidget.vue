<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { RouteLocationRaw } from "vue-router";
import { storeToRefs } from "pinia";

import Avatar from "@/components/ui/Avatar.vue";
import CardHeader from "@/components/shared/CardHeader.vue";
import CardHeaderEditLink from "@/components/shared/CardHeaderEditLink.vue";
import defaultAvatar from "@/assets/images/users/avatar-1.png";
import { ROLE_OVERSEER } from "@/constants/roleConstant";
import { appFormatDate } from "@/helpers/appHelper";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";

type RegionItem = { name: string };

type DetailRow = {
  key: string;
  label: string;
  value: string;
  cellClass?: string;
  multiline?: boolean;
  href?: string;
  to?: RouteLocationRaw;
};

const props = withDefaults(
  defineProps<{
    userId?: number | string | null;
    user?: Record<string, any> | null;
    title?: string;
    editable?: boolean;
  }>(),
  {
    userId: null,
    user: null,
    title: undefined,
    editable: true,
  },
);

const { t } = useI18n();
const authStore = useAuthStore();
const { isRolePastorLeader } = storeToRefs(authStore);
const detail = ref<Record<string, any>>({});
const headingClass = "text-left";

const cardTitle = computed(() => props.title ?? t("user.pastorLeaderDetails"));

const resolvedDetail = computed(() => (props.user ? props.user : detail.value));

const roleId = computed(() => Number(resolvedDetail.value?.role?.id));

const isOverseer = computed(() => roleId.value === ROLE_OVERSEER);

const avatarUrl = computed(
  () => resolvedDetail.value?.photo_url || defaultAvatar,
);

const displayName = computed(() => {
  const user = resolvedDetail.value;
  if (!user) return "";

  const prefixed = [user.prefix, user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return prefixed || user.name || "";
});

const fromChurchesText = computed(() => {
  const churches = resolvedDetail.value?.from_churches;
  if (!Array.isArray(churches) || churches.length === 0) return "";
  return churches.map((church: { name: string }) => church.name).join(", ");
});

const fromExpanded = ref(false);
const fromOverflows = ref(false);
const fromTextEl = ref<HTMLElement | null>(null);

async function measureFromOverflow() {
  await nextTick();
  const raw = fromTextEl.value as HTMLElement | HTMLElement[] | null;
  const el = Array.isArray(raw) ? raw[0] : raw;
  if (!el || fromExpanded.value) return;
  fromOverflows.value = el.scrollHeight > el.clientHeight + 1;
}

const holdsCredentials = computed(() => {
  const credentials = resolvedDetail.value?.credentials;
  return Boolean(credentials && String(credentials).trim());
});

const ministerialCredentials = computed(() => {
  const user = resolvedDetail.value;
  if (!holdsCredentials.value || !user) return "";

  const lines: string[] = [];

  if (user.credentials) {
    const credentialLine = user.credentials_from
      ? `${user.credentials} with ${user.credentials_from}`
      : user.credentials;
    lines.push(credentialLine);
  }

  if (user.credentials_number) {
    lines.push(`# ${user.credentials_number}`);
  }

  if (user.credentials_expiry_date) {
    lines.push(`${t("user.credentialsExpires")}: ${appFormatDate(user.credentials_expiry_date)}`);
  }

  return lines.join("\n");
});

// TODO(api): Oversight Assignment — `overseer_permissions` chưa có trên GET /users/{id}.
// Nguồn đã biết: GET /dashboard → overseer_permissions (OverseerUser.vue).
// Cần backend xác nhận endpoint/param để lấy data khi xem user detail.

function formatRegionsWithExclusions(
  allowed?: RegionItem[],
  excluded?: RegionItem[],
): string {
  const allowedNames = allowed?.map((item) => item.name).join(", ") ?? "";
  const excludedNames = excluded?.map((item) => item.name).join(", ") ?? "";

  if (!allowedNames && !excludedNames) return "";
  if (allowedNames && excludedNames) {
    return `${allowedNames}, ${t("user.excluding")} ${excludedNames}`;
  }
  if (allowedNames) return allowedNames;
  return `${t("user.excluding")} ${excludedNames}`;
}

const oversightAssignmentText = computed(() => {
  const permissions = resolvedDetail.value?.overseer_permissions;
  if (!permissions) return "";

  const parts: string[] = [];

  const geographical = formatRegionsWithExclusions(
    permissions.allowedIds?.geographicalRegionIds,
    permissions.excludedIds?.geographicalRegionIds,
  );
  if (geographical) parts.push(geographical);

  const churchApostolic = formatRegionsWithExclusions(
    permissions.allowedIds?.churchRegionIds,
    permissions.excludedIds?.churchRegionIds,
  );
  if (churchApostolic) parts.push(churchApostolic);

  const languageRegions = permissions.allowedIds?.languageRegionIds
    ?.map((item: RegionItem) => item.name)
    .join(", ");
  if (languageRegions) parts.push(languageRegions);

  return parts.join("\n");
});

const showOversightAssignment = computed(
  () =>
    isOverseer.value &&
    !isRolePastorLeader.value &&
    Boolean(oversightAssignmentText.value),
);

const rows = computed((): DetailRow[] => {
  const user = resolvedDetail.value;
  if (!user) return [];

  const items: DetailRow[] = [];

  if (user.church_name) {
    items.push({
      key: "pastorOf",
      label: "user.pastorOf",
      value: user.church_name,
      to: user.church_id
        ? { name: "ChurchDetail", params: { id: user.church_id } }
        : undefined,
    });
  }

  if (fromChurchesText.value) {
    items.push({
      key: "from",
      label: "user.from",
      value: fromChurchesText.value,
    });
  }

  if (user.country_name) {
    items.push({
      key: "nation",
      label: "user.nation",
      value: user.country_name,
    });
  }

  items.push({
    key: "sensitiveNation",
    label: "user.sensitiveNation",
    value: user.sensitive_nation ? t("yes") : t("no"),
    cellClass: user.sensitive_nation ? "text-error" : undefined,
  });

  if (user.email_address) {
    items.push({
      key: "email",
      label: "user.email",
      value: user.email_address,
      href: `mailto:${user.email_address}`,
    });
  }

  if (user.mobile_phone) {
    items.push({
      key: "mobilePhone",
      label: "user.mobilePhone",
      value: user.mobile_phone,
    });
  }

  if (user.username) {
    items.push({
      key: "username",
      label: "user.labelUsername",
      value: user.username,
      cellClass: "text-success",
    });
  }

  if (user.id) {
    items.push({
      key: "omrNumber",
      label: "user.omrNumber",
      value: `#${user.id}`,
    });
  }

  if (user.role?.name) {
    items.push({
      key: "omrStatus",
      label: "user.omrStatus",
      value: user.role.name,
    });
  }

  if (showOversightAssignment.value) {
    items.push({
      key: "oversightAssignment",
      label: "user.oversightAssignment",
      value: oversightAssignmentText.value,
      multiline: true,
    });
  }

  if (user.language_name) {
    items.push({
      key: "language",
      label: "user.language",
      value: user.language_name,
    });
  }

  if (holdsCredentials.value && ministerialCredentials.value) {
    items.push({
      key: "ministerialCredentials",
      label: "user.ministerialCredentials",
      value: ministerialCredentials.value,
      multiline: true,
    });
  }

  return items;
});

const editRoute = computed(() => {
  const id = resolvedDetail.value?.id ?? props.userId;
  if (!id) return undefined;
  return { name: "UserEdit", params: { id: String(id) } };
});

async function fetchData(userId: number | string) {
  detail.value = await userService.getDetail(
    userId,
    { include_pastor_churches: true },
    false,
  );
}

watch(
  () => props.userId,
  (id) => {
    if (!id || props.user) return;
    fetchData(id);
  },
  { immediate: true },
);

watch(
  () => props.user,
  (user) => {
    if (user) {
      detail.value = user;
    }
  },
  { immediate: true },
);

watch(fromChurchesText, () => {
  fromExpanded.value = false;
  fromOverflows.value = false;
  void measureFromOverflow();
}, { immediate: true });
</script>

<template>
  <CardHeader :title="cardTitle">
    <template
      v-if="editable && editRoute"
      #header
    >
      <CardHeaderEditLink :to="editRoute" />
    </template>

    <div
      v-if="resolvedDetail?.id || resolvedDetail?.name"
      class="pastor-leader-widget"
    >
      <div class="pa-4">
        <div class="d-flex align-center ga-4">
          <Avatar
            :src="avatarUrl"
            :size="100"
            class="flex-shrink-0"
          />

          <div class="flex-grow-1 min-w-0">
            <div class="text-h5 font-weight-bold text-primary">
              {{ displayName }}
            </div>
            <div
              v-if="resolvedDetail?.title"
              class="text-body-2 text-medium-emphasis"
            >
              {{ resolvedDetail.title }}
            </div>
          </div>
        </div>
      </div>

      <v-table
        v-if="rows.length"
        class="bordered-table table-in-card table-key-value table-border-top"
        density="compact"
      >
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.key"
          >
            <th :class="headingClass">
              {{ $t(row.label) }}
            </th>
            <td
              :class="row.cellClass"
              :style="row.multiline ? { whiteSpace: 'pre-wrap' } : undefined"
            >
              <router-link
                v-if="row.to"
                :to="row.to"
              >
                {{ row.value }}
              </router-link>
              <a
                v-else-if="row.href"
                :href="row.href"
              >
                {{ row.value }}
              </a>
              <template v-else-if="row.key === 'from'">
                <div
                  ref="fromTextEl"
                  class="pastor-leader-widget__from"
                  :class="{ 'pastor-leader-widget__from--clamp': !fromExpanded }"
                >
                  {{ row.value }}
                </div>
                <v-btn
                  v-if="fromOverflows || fromExpanded"
                  variant="text"
                  color="primary"
                  size="small"
                  class="px-0 pastor-leader-widget__from-toggle"
                  @click="fromExpanded = !fromExpanded"
                >
                  {{ fromExpanded ? $t("less") : $t("seeMore") }}
                </v-btn>
              </template>
              <template v-else>
                {{ row.value }}
              </template>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <div
      v-else
      class="pa-4 text-center text-medium-emphasis"
    >
      {{ $t("noData") }}
    </div>
  </CardHeader>
</template>

<style scoped lang="scss">
.pastor-leader-widget__from--clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.pastor-leader-widget__from-toggle {
  min-width: 0;
  height: auto;
  margin-top: 2px;
}
</style>
