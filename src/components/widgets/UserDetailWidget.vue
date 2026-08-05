<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import Avatar from "@/components/ui/Avatar.vue";
import CardHeader from "@/components/shared/CardHeader.vue";
import CardHeaderEditLink from "@/components/shared/CardHeaderEditLink.vue";
import defaultAvatar from "@/assets/images/users/avatar-1.png";
import { ROLE_OVERSEER, ROLE_PASTOR_LEADER } from "@/constants/roleConstant";
import { appFormatDate } from "@/helpers/appHelper";
import { userService } from "@/services/userService";

type RegionItem = { name: string };

const props = withDefaults(
  defineProps<{
    userId?: number | string | null;
    user?: Record<string, any> | null;
    editable?: boolean;
  }>(),
  {
    userId: null,
    user: null,
    editable: true,
  },
);

const emit = defineEmits<{
  loaded: [detail: Record<string, any>];
}>();

const { t } = useI18n();
const detail = ref<Record<string, any>>({});
const headingClass = "text-left font-weight-medium";

const resolvedDetail = computed(() => (props.user ? props.user : detail.value));

const roleId = computed(() => Number(resolvedDetail.value?.role?.id));

const avatarUrl = computed(
  () => resolvedDetail.value?.photo_url || defaultAvatar,
);

const isOverseer = computed(() => roleId.value === ROLE_OVERSEER);

const isPastorLeader = computed(() => roleId.value === ROLE_PASTOR_LEADER);

const showFromChurchBlocks = computed(() => {
  const churches = resolvedDetail.value?.from_churches;
  return isPastorLeader.value && Array.isArray(churches) && churches.length > 0;
});

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

// TODO(api): Oversight Assignment — `overseer_permissions` chưa có trên GET /users/{id}.
// Nguồn đã biết: GET /dashboard → overseer_permissions (OverseerUser.vue).
// Cần backend xác nhận endpoint/param để lấy data khi xem user detail.

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

const rows = computed(() => {
  const user = resolvedDetail.value;
  if (!user) return [];

  const items: Array<{
    key: string;
    label: string;
    value: string;
    cellClass?: string;
    multiline?: boolean;
    href?: string;
  }> = [];

  if (user.church_name) {
    items.push({
      key: "pastorOf",
      label: "user.pastorOf",
      value: user.church_name,
    });
  }

  if (fromChurchesText.value && !showFromChurchBlocks.value) {
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
    cellClass: user.sensitive_nation ? "text-error font-weight-medium" : undefined,
  });

  if (user.email_address) {
    items.push({
      key: "email",
      label: "user.labelEmailAddress",
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

  if (isOverseer.value && oversightAssignmentText.value) {
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

watch(
  resolvedDetail,
  (val) => {
    if (val?.id) {
      emit("loaded", val);
    }
  },
  { immediate: true },
);
</script>

<template>
  <CardHeader :title="$t('user.accountDetails')">
    <template
      v-if="editable && editRoute"
      #header
    >
      <CardHeaderEditLink :to="editRoute" />
    </template>

    <template v-if="resolvedDetail?.id || resolvedDetail?.name">
      <div class="pa-4">
        <div class="d-flex align-start ga-4">
          <Avatar
            :src="avatarUrl"
            :size="100"
            class="flex-shrink-0"
          />

          <div class="flex-grow-1 min-w-0 pt-1">
            <div class="text-h5 font-weight-medium">
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

      <v-divider v-if="rows.length" />

      <v-table
        v-if="rows.length"
        class="bordered-table table-in-card table-key-value"
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
              <a
                v-if="row.href"
                :href="row.href"
              >
                {{ row.value }}
              </a>
              <template v-else>
                {{ row.value }}
              </template>
            </td>
          </tr>
        </tbody>
      </v-table>
    </template>

    <div
      v-else
      class="pa-4 text-center text-medium-emphasis"
    >
      {{ $t("noData") }}
    </div>
  </CardHeader>
</template>
