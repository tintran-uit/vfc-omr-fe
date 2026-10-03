<script setup lang="ts">
import { computed, onMounted, ref, provide } from "vue";
import { useDisplay } from "vuetify";
import { useAuthStore } from "@/stores/authStore";
import { dashboardService } from "@/services/dashboardService";
import type {
  OverseerAssignmentItem,
  OverseerAssignmentsStreamMeta,
} from "@/types/overseerAssignmentsStream";
import { churchService } from "@/services/churchService";
import { userService } from "@/services/userService";
import OverseerProfileHeader from "@/components/dashboard/OverseerProfileHeader.vue";
import OverseerUser from "@/components/dashboard/OverseerUser.vue";
import OverseerNetwork from "@/components/dashboard/OverseerNetwork.vue";
import OverseerChurchApostolicRegions from "@/components/dashboard/OverseerChurchApostolicRegions.vue";
import OverseerLanguageRegion from "@/components/dashboard/OverseerLanguageRegion.vue";
import OverseerGeographicalRegion from "@/components/dashboard/OverseerGeographicalRegion.vue";
import OverseerMyOverseerItem from "@/components/dashboard/OverseerMyOverseerItem.vue";
import OverseerMetricBlock from "@/components/dashboard/OverseerMetricBlock.vue";
import OverseerChurch from "@/components/dashboard/OverseerChurch.vue";

// Charts
import OverseerAttendanceChartWidget from "@/components/dashboard/OverseerAttendanceChartWidget.vue";
import OverseerChurchPlantedChartWidget from "@/components/dashboard/OverseerChurchPlantedChartWidget.vue";
import OverseerVisitChartWidget from "@/components/dashboard/OverseerVisitChartWidget.vue";

import carIcon from "@/assets/images/icons/car.png";
import editIcon from "@/assets/images/metrics/edit.png";
import homeUserIcon from "@/assets/images/metrics/house-user.png";
import userIcon from "@/assets/images/metrics/user.png";
import houseIcon from "@/assets/images/metrics/house.png";

const authStore = useAuthStore();
const { smAndDown } = useDisplay();
const isMobile = computed(() => smAndDown.value);
const dashboardData = ref({});
provide("dashboardData", dashboardData);
const indicators = ref({});
const overseerChurchCounts = ref({});
const fetchDefaultProfile = async () => {
  try {
    dashboardData.value = await dashboardService.getProfile();
  } catch (error) {
    console.error("Failed to fetch default profile:", error);
  }
};

const fetchOverseerChurchCounts = async () => {
  try {
    overseerChurchCounts.value = await dashboardService.getOverseerChurchCounts();
  } catch (error) {
    console.error("Failed to fetch overseer church counts:", error);
  }
};

const fetchOverseerIndicators = async () => {
  try {
    indicators.value = await dashboardService.getOverseerIndicators();
  } catch (error) {
    console.error("Failed to fetch overseer indicator:", error);
  }
};

const actions = computed(() => {
  return [
    {
      title: "dashboardMenu.enterVisits",
      iconSrc: carIcon,
      to: {
        name: "VisitsAdd",
      },
    },
    {
      title: "dashboardMenu.editProfile",
      iconSrc: editIcon,
      to: {
        name: "UserEdit",
        params: {
          id: authStore.user?.id || 0,
        },
      },
    },
    {
      title: "dashboardMenu.newPastorAndNewChurch",
      iconSrc: homeUserIcon,
      to: {
        name: "ChurchAddWithNewPastor",
      },
    },
    {
      title: "dashboardMenu.newPastor",
      iconSrc: userIcon,
      to: {
        name: "UserAdd",
      },
    },
    {
      title: "dashboardMenu.newChurch",
      iconSrc: houseIcon,
      to: {
        name: "ChurchAdd",
      },
    },
  ];
});

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

function graphPayload(key: string) {
  return (indicators.value as Record<string, any>)?.[key] ?? {};
}

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
  } catch (e) {
    console.error(e);
  }
};

onMounted(async () => {
  try {loadMyOverseers();
    fetchDefaultProfile();
    fetchOverseerChurchCounts();
    fetchOverseerIndicators();
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }
});
</script>

<template>
  <OverseerProfileHeader
    v-if="dashboardData?.overseer_profile"
    :user="dashboardData.overseer_profile"
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
        :base-color="item?.color || 'primary'"
      >
        <template #prepend>
          <span
            v-if="item.iconSrc"
            class="overview-church-action-btn__icon overview-church-action-btn__icon--themed me-3"
            :style="{
              WebkitMaskImage: `url(${item.iconSrc})`,
              maskImage: `url(${item.iconSrc})`,
            }"
          />
          <v-icon
            v-else
            :icon="item.icon"
            size="20"
            class="me-3"
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
        :variant="item?.color ? 'flat' : 'outlined'"
        :color="item?.color || undefined"
        :class="[
          'd-inline-flex align-center w-100 w-sm-auto overview-church-action-btn',
          { 'overview-church-action-btn--quiet': !item?.color },
        ]"
      >
        <span
          v-if="item.iconSrc"
          class="overview-church-action-btn__icon overview-church-action-btn__icon--themed"
          :style="{
            WebkitMaskImage: `url(${item.iconSrc})`,
            maskImage: `url(${item.iconSrc})`,
          }"
        />
        <v-icon
          v-else
          :icon="item.icon"
          size="20"
          class="overview-church-action-btn__icon"
        />
        <span class="overview-church-action-btn__label">{{ $t(item.title) }}</span>
      </v-btn>
    </div>
  </v-card>

  <v-row>
    <v-col cols="12">
      <OverseerUser
        v-if="dashboardData?.overseer_profile"
        :user-id="dashboardData?.overseer_profile?.id"
        :user="dashboardData?.overseer_profile"
      />
    </v-col>
  </v-row>

  <OverseerMetricBlock :indicators="indicators" />

  <div class="d-flex flex-column ga-4 mt-4">
    <OverseerAttendanceChartWidget :data="graphPayload('attendance_graph')" />
    <OverseerChurchPlantedChartWidget :data="graphPayload('church_planted_graph')" />
    <OverseerVisitChartWidget :data="graphPayload('pastoral_visits_graph')" />
  </div>

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
      :dashboardData="overseer"
    />

    <template v-if="showAllMyOverseers">
      <OverseerMyOverseerItem
        v-for="overseer in myOverseersRest"
        :key="overseer.overseer_profile.id"
        :dashboardData="overseer"
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
 

  <v-row>
    <v-col cols="12">
      <OverseerGeographicalRegion
        v-if="overseerChurchCounts?.geographical_region_counts"
        :data="overseerChurchCounts?.geographical_region_counts"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <OverseerLanguageRegion
        v-if="overseerChurchCounts?.language_region_counts"
        :data="overseerChurchCounts?.language_region_counts"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <OverseerChurchApostolicRegions
        v-if="overseerChurchCounts?.church_region_counts"
        :data="overseerChurchCounts?.church_region_counts"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <OverseerNetwork
        v-if="overseerChurchCounts?.church_network_counts"
        :data="overseerChurchCounts?.church_network_counts"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <OverseerChurch />
    </v-col>
  </v-row>
</template>
