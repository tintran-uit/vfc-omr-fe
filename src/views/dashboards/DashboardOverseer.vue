<script setup lang="ts">
import { computed, onMounted, ref, provide, shallowRef } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { dashboardService } from "@/services/dashboardService";
import { churchService } from "@/services/churchService";
import { userService } from "@/services/userService";
import OverseerUser from "@/components/dashboard/OverseerUser.vue";
import OverseerNetwork from "@/components/dashboard/OverseerNetwork.vue";
import OverseerChurchApostolicRegions from "@/components/dashboard/OverseerChurchApostolicRegions.vue";
import OverseerLanguageRegion from "@/components/dashboard/OverseerLanguageRegion.vue";
import OverseerGeographicalRegion from "@/components/dashboard/OverseerGeographicalRegion.vue";
import OverseerChurch from "@/components/dashboard/OverseerChurch.vue";
// Icons
import peopleIcon from "@/assets/images/metrics/people.svg";
import givingIcon from "@/assets/images/metrics/giving.svg";
import plantIcon from "@/assets/images/metrics/plant.svg";
import growthIcon from "@/assets/images/metrics/growth.svg";
import worldwideIcon from "@/assets/images/metrics/worldwide.svg";
import educationIcon from "@/assets/images/metrics/education.svg";
import groupPeopleIcon from "@/assets/images/metrics/group-people.svg";

const authStore = useAuthStore();
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
      icon: "$chartBar",
      to: {
        name: "VisitsAdd",
      },
    },
    {
      title: "dashboardMenu.editProfile",
      icon: "$edit",
      to: {
        name: "UserEdit",
        params: {
          id: authStore.user?.id || 0,
        },
      },
    },
    {
      title: "dashboardMenu.newPastorAndNewChurch",
      icon: "$plusCircleOutline",
      to: {
        name: "ChurchAddWithNewPastor",
      },
    },
    {
      title: "dashboardMenu.newPastor",
      icon: "$plusCircleOutline",
      to: {
        name: "UserAdd",
      },
    },
    {
      title: "dashboardMenu.newChurch",
      icon: "$plusCircleOutline",
      to: {
        name: "ChurchAdd",
      },
    },
  ];
});

const metrics = shallowRef([
  {
    name: "No. of Churches",
    earnKey: "total_churches",
    percentKey: null,
    color: "primary",
    icon: peopleIcon,
  },
  {
    name: "People",
    text: "Average people in 3 months",
    earnKey: "avg_people_3_months",
    percentKey: null,
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Churches Reporting",
    text: "Percent of Churches Reporting",
    earnKey: null,
    percentKey: "percent_churches_reporting",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Growing",
    text: "Percent Growth in Churches Number",
    earnKey: null,
    percentKey: "percent_growth_churches_number",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Churches Growing",
    text: "Percent of Churches Growing",
    earnKey: null,
    percentKey: "percent_churches_growing",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Countries",
    text: "Number of Countries",
    earnKey: "countries_count",
    percentKey: null,
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Church Planted",
    text: "Percent of Churches Planted",
    earnKey: null,
    percentKey: "percent_churches_planted",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Cell Groups",
    text: "Percent of Churches with Cell Groups",
    earnKey: null,
    percentKey: "percent_churches_with_cg",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "LIW",
    text: "Percent of Churches with LIW",
    earnKey: null,
    percentKey: "percent_churches_with_gt_liw",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Giving",
    text: "Percent of Churches with Giving",
    earnKey: null,
    percentKey: "percent_churches_with_giving",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "MFP",
    text: "Percent of Churches with MFP",
    earnKey: null,
    percentKey: "percent_churches_with_mfp",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Visited",
    text: "Percent of Churches Visited in 2 Years",
    earnKey: null,
    percentKey: "percent_churches_visited_2_years",
    color: "primary",
    icon: growthIcon,
  },
]);

const goalActualMetrics = shallowRef([
  {
    name: "Growing",
    text: "Churches Growing",
    earnKey: null,
    percentKey: "percent_of_churches_growing",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Cell Groups",
    text: "Churches with Cell Groups",
    earnKey: null,
    percentKey: "percent_of_churches_cell_groups",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "LIW",
    text: "Churches with LIW Classes",
    earnKey: null,
    percentKey: "percent_of_churches_liw_classes",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "MFP",
    text: "Churches with MFP Giving",
    earnKey: null,
    percentKey: "percent_of_churches_mfp",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Reporting",
    text: "Churches up-to-date Reporting",
    earnKey: null,
    percentKey: "percent_of_churches_reporting_on_omr",
    color: "primary",
    icon: growthIcon,
  },
  {
    name: "Planting churches",
    text: "Churches Planting Churches",
    earnKey: null,
    percentKey: "percent_of_churches_doing_church_planting",
    color: "primary",
    icon: growthIcon,
  },
]);

onMounted(async () => {
  try {
    fetchDefaultProfile();
    fetchOverseerChurchCounts();
    fetchOverseerIndicators();
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }
});
</script>

<template>
  <h1>Dashboard Overseer</h1>

  <v-card
    class="pa-4 mt-4"
    variant="text"
  >
    <div
      class="d-flex flex-wrap"
      style="gap: 12px; justify-content: flex-end"
    >
      <v-btn
        v-for="item in actions"
        :key="item.title"
        :to="item.to"
        variant="elevated"
        :color="item?.color || 'primary'"
        class="d-inline-flex align-center w-100 w-sm-auto"
      >
        <v-icon
          :icon="item.icon"
          size="20"
          class="mr-2"
        />
        <span class="text-body-2">{{ $t(item.title) }}</span>
      </v-btn>
    </div>
  </v-card>

  <v-row class="my-0">
    <v-col
      cols="6"
      sm="6"
      md="3"
      v-for="(metric, i) in metrics"
      :key="i"
    >
      <v-card
        elevation="0"
        class="h-100"
      >
        <v-card
          variant="outlined"
          class="h-100"
        >
          <v-card-text class="h-100">
            <div class="d-flex align-items-center justify-space-between">
              <v-row class="mb-0">
                <v-col
                  cols="3"
                  class="d-flex align-center justify-center pb-0"
                >
                  <v-img
                    :src="metric.icon"
                    alt="icon"
                    width="40"
                    height="40"
                  />
                </v-col>

                <v-col
                  cols="9"
                  class="pb-0"
                >
                  <h4
                    class="text-h4 d-flex align-center mb-0 indicator-value"
                    v-if="metric.earnKey"
                  >
                    {{ indicators?.[metric.earnKey] || 0 }}
                  </h4>
                  <h4
                    class="text-h4 d-flex align-center mb-0 indicator-value"
                    v-else-if="metric.percentKey"
                  >
                    {{ indicators?.[metric.percentKey] || 0 }}%
                  </h4>
                  <h4
                    class="text-h4 d-flex align-center mb-0 indicator-value"
                    v-else-if="metric.earnFn && typeof metric.earnFn === 'function'"
                  >
                    <!-- <v-badge location="top right" color="error" content="9999"> -->
                    {{ metric.earnFn(indicators || 0) }}
                    <!-- </v-badge> -->
                  </h4>
                  <div class="text-body-1 font-weight-medium text-high-emphasis">
                    {{ $t(metric.name) }}
                  </div>
                  <div
                    v-if="metric?.text"
                    class="text-body-2 text-medium-emphasis"
                  >
                    {{ $t(metric.text) }}
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>

  <div class="text-h3 mt-4">
    Goals & Actual %'s for 6 months period {{ indicators?.goals_actuals?.period }}
  </div>
  <v-row class="my-0">
    <v-col
      cols="6"
      sm="6"
      md="3"
      v-for="(metric, i) in goalActualMetrics"
      :key="i"
    >
      <v-card
        elevation="0"
        class="h-100"
      >
        <v-card
          variant="outlined"
          class="h-100"
        >
          <v-card-text class="h-100">
            <div class="d-flex align-items-center justify-space-between">
              <v-row class="mb-0">
                <v-col
                  cols="3"
                  class="d-flex align-center justify-center pb-0"
                >
                  <v-img
                    :src="metric.icon"
                    alt="icon"
                    width="40"
                    height="40"
                  />
                </v-col>

                <v-col
                  cols="9"
                  class="pb-0"
                >
                  <h4 class="text-h4 d-flex align-center mb-0 indicator-value">
                    {{ indicators?.goals_actuals?.[metric.percentKey]["goal"] || 0 }}%

                    <v-chip
                      size="small"
                      color="error"
                      class="ml-2"
                    >
                      {{ indicators?.goals_actuals?.[metric.percentKey]["actual"] }}%
                    </v-chip>
                  </h4>

                  <div class="text-body-1 font-weight-medium text-high-emphasis">
                    {{ $t(metric.name) }}
                  </div>
                  <div
                    v-if="metric?.text"
                    class="text-body-2 text-medium-emphasis"
                  >
                    {{ $t(metric.text) }}
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <OverseerChurch />
    </v-col>
  </v-row>

  <!-- <v-row>
    <v-col cols="12">
      <OverseerUser
        v-if="dashboardData?.overseer_profile"
        :user-id="dashboardData?.overseer_profile?.id"
        :user="dashboardData?.overseer_profile"
      />
    </v-col>
  </v-row>

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
        class="mt-4"
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
  </v-row> -->
</template>

<style scoped lang="scss"></style>
