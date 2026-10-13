<script setup lang="ts">
import { computed, onMounted, provide, ref } from "vue";
import { useDisplay } from "vuetify";
import { useAuthStore } from "@/stores/authStore";
import { dashboardService } from "@/services/dashboardService";
import type {
  OverseerAssignmentItem,
  OverseerAssignmentsStreamMeta,
} from "@/types/overseerAssignmentsStream";
import OverseerProfileHeader from "@/components/dashboard/OverseerProfileHeader.vue";
import OverseerMyOverseerItem from "@/components/dashboard/OverseerMyOverseerItem.vue";

import carIcon from "@/assets/images/icons/car.png";
import editIcon from "@/assets/images/metrics/edit.png";
import homeUserIcon from "@/assets/images/metrics/house-user.png";
import userIcon from "@/assets/images/metrics/user.png";
import houseIcon from "@/assets/images/metrics/house.png";
import rolesIcon from "@/assets/images/metrics/roles.png";

const authStore = useAuthStore();
const { smAndDown } = useDisplay();
const isMobile = computed(() => smAndDown.value);
const dashboardData = ref<Record<string, any>>({});
provide("dashboardData", dashboardData);

type HeaderUser = {
  id?: number | string;
  name?: string;
  role_name?: string;
  photo_url?: string;
};

function readHeaderUser(raw: Record<string, any> | null | undefined): HeaderUser | null {
  if (!raw) return null;
  const name =
    raw.name ||
    [raw.first_name, raw.last_name].filter(Boolean).join(" ");
  if (!name && !raw.photo_url && !raw.role_name && !raw.role?.name) return null;
  return {
    id: raw.id,
    name,
    role_name: raw.role_name || raw.role?.name || "",
    photo_url: raw.photo_url || raw.photo || "",
  };
}

const headerUser = computed(() => {
  const data = dashboardData.value;
  const fromApi = readHeaderUser(
    data?.admin_profile ?? data?.overseer_profile ?? data?.user_profile ?? data?.user,
  );
  if (fromApi) return fromApi;

  const user = authStore.user as Record<string, any> | null;
  if (!user) return null;
  return readHeaderUser({
    ...user,
    name: authStore.fullName,
  });
});

const actions = computed(() => [
  {
    title: "dashboardMenu.enterVisits",
    iconSrc: carIcon,
    to: { name: "VisitsAdd" },
  },
  {
    title: "dashboardMenu.editProfile",
    iconSrc: editIcon,
    to: {
      name: "UserEdit",
      params: { id: headerUser.value?.id || authStore.user?.id || 0 },
    },
  },
  {
    title: "dashboardMenu.newPastorAndNewChurch",
    iconSrc: homeUserIcon,
    to: { name: "ChurchAddWithNewPastor" },
  },
  {
    title: "dashboardMenu.newPastor",
    iconSrc: userIcon,
    to: { name: "UserAdd" },
  },
  {
    title: "dashboardMenu.newChurch",
    iconSrc: houseIcon,
    to: { name: "ChurchAdd" },
  },
  {
    title: "dashboardMenu.overseer",
    iconSrc: rolesIcon,
    to: { name: "UserAdd", query: { role: "overseer" } },
  },
]);

const myOverseersMeta = ref<OverseerAssignmentsStreamMeta | null>(null);
const myOverseers = ref<OverseerAssignmentItem[]>([]);
const showAllMyOverseers = ref(false);

const myOverseersPreview = computed(() => myOverseers.value.slice(0, 1));
const myOverseersRest = computed(() => myOverseers.value.slice(1));
const canSeeMoreMyOverseers = computed(
  () => myOverseers.value.length > 1 && !showAllMyOverseers.value,
);
const canSeeLessMyOverseers = computed(
  () => myOverseers.value.length > 1 && showAllMyOverseers.value,
);

const loadMyOverseers = async () => {
  try {
    myOverseersMeta.value = null;
    myOverseers.value = [];
    showAllMyOverseers.value = false;
    await dashboardService.getOverseerAssignmentsMyOverseers({
      onMeta: (meta) => {
        myOverseersMeta.value = meta;
      },
      onItem: ({ item }) => {
        myOverseers.value.push(item);
      },
    });
  } catch (error) {
    console.error("Failed to fetch admin overseer list:", error);
  }
};

onMounted(async () => {
  loadMyOverseers();
  try {
    dashboardData.value = await dashboardService.getProfile();
  } catch (error) {
    console.error("Failed to fetch admin dashboard profile:", error);
  }
});
</script>

<template>
  <OverseerProfileHeader
    v-if="headerUser"
    :user="headerUser"
  />

  <v-card
    v-if="isMobile"
    class="mt-4 mb-4"
    variant="outlined"
    elevation="0"
  >
    <v-list density="comfortable">
      <v-list-item
        v-for="item in actions"
        :key="item.title"
        :to="item.to"
        base-color="primary"
      >
        <template #prepend>
          <span
            class="overview-church-action-btn__icon overview-church-action-btn__icon--themed me-3"
            :style="{
              WebkitMaskImage: `url(${item.iconSrc})`,
              maskImage: `url(${item.iconSrc})`,
            }"
          />
        </template>
        <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>

  <v-card
    v-else
    class="px-0 py-4 mt-4 mb-4"
    variant="text"
  >
    <div
      class="d-flex flex-wrap"
      style="gap: 8px; justify-content: flex-end;"
    >
      <v-btn
        v-for="item in actions"
        :key="item.title"
        :to="item.to"
        variant="outlined"
        class="d-inline-flex align-center w-100 w-sm-auto overview-church-action-btn overview-church-action-btn--quiet"
      >
        <span
          class="overview-church-action-btn__icon overview-church-action-btn__icon--themed"
          :style="{
            WebkitMaskImage: `url(${item.iconSrc})`,
            maskImage: `url(${item.iconSrc})`,
          }"
        />
        <span class="overview-church-action-btn__label">{{ $t(item.title) }}</span>
      </v-btn>
    </div>
  </v-card>

  <section
    v-if="myOverseers.length > 0"
    class="my-oversight mt-6 mb-6"
  >
    <div class="my-oversight__header d-flex align-center mb-3">
      <h2 class="my-oversight__title text-h4 font-weight-bold mb-0">
        {{ $t("myOversight") }}
      </h2>
    </div>

    <OverseerMyOverseerItem
      v-for="overseer in myOverseersPreview"
      :key="overseer.overseer_profile.id"
      :dashboard-data="overseer"
    />

    <template v-if="showAllMyOverseers">
      <OverseerMyOverseerItem
        v-for="overseer in myOverseersRest"
        :key="overseer.overseer_profile.id"
        :dashboard-data="overseer"
      />
    </template>

    <div
      v-if="canSeeMoreMyOverseers || canSeeLessMyOverseers"
      class="d-flex justify-center mt-4"
    >
      <v-btn
        v-if="canSeeMoreMyOverseers"
        variant="outlined"
        color="primary"
        @click="showAllMyOverseers = true"
      >
        {{ $t("seeMore") }}
        <v-icon
          icon="$chevronDown"
          end
        />
      </v-btn>
      <v-btn
        v-else
        variant="outlined"
        color="primary"
        @click="showAllMyOverseers = false"
      >
        {{ $t("less") }}
        <v-icon
          icon="$chevronUp"
          end
        />
      </v-btn>
    </div>
  </section>
</template>
