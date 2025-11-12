<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useRoute, useRouter } from "vue-router";
import peopleIcon from '@/assets/images/metrics/people.svg'
import givingIcon from '@/assets/images/metrics/giving.svg'
import plantIcon from '@/assets/images/metrics/plant.svg'
import growthIcon from '@/assets/images/metrics/growth.svg'
import { churchService } from '@/services/churchService';
import PastorLeaderWidget from '@/components/widgets/PastorLeaderWidget.vue';
import ChurchDetailWidget from '@/components/widgets/ChurchDetailWidget.vue';

const props = withDefaults(
  defineProps<{
    
  }>(),
  {
    
  }
)
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const menus = [
  {
    title: 'dashboardMenu.monthlyData',
    icon: '$chartBar',
  },
  {
    title: 'dashboardMenu.editChurch',
    icon: '$edit',
  },
  {
    title: 'dashboardMenu.worshipServices',
    icon: '$plusCircleOutline',
  },
  {
    title: 'dashboardMenu.newPastorAndNewChurch',
    icon: '$plusCircleOutline'
  },
  {
    title: 'dashboardMenu.newPastor',
    icon: '$plusCircleOutline'
  },
  {
    title: 'dashboardMenu.newChurch',
    icon: '$plusCircleOutline'
  },
]
const metrics = shallowRef([
  {
    name: 'dashboard.people',
    earnKey: 'avg_attendance',
    percentKey: null,
    color: 'primary',
    icon: peopleIcon
  },
  {
    name: 'dashboard.giving',
    earnKey: 'avg_monthly_giving',
    percentKey: null,
    color: 'primary',
    icon: givingIcon,
  },
  {
    name: 'dashboard.churchPlants',
    earnKey: 'church_plants',
    percentKey: null,
    color: 'primary',
    icon: plantIcon,
  },
  {
    name: 'dashboard.growth',
    earnKey: null,
    percentKey: 'growth',
    color: 'primary',
    icon: growthIcon,
  },
])

const detail = ref({})

const fetchData = async () => {
  try {
    detail.value = await churchService.get(id);
  } catch (error) {
    
  }
}

onMounted(() => {
  fetchData();
});

</script>

<template>
  <v-card flat>
  <!-- Cover -->
  <v-img
    :src="detail?.photo_url"
    height="150"
    cover
    class="bg-grey-darken-2"
    style="background-color: #ccc;"
  >
  </v-img>

  <!-- Avatar + Info -->
  <v-container class="position-relative">
    <v-row>
      <!-- Avatar bên trái -->
      <v-col cols="12" sm="2" class="position-relative">
        <v-avatar
          size="149"
          class="elevation-4 profile-avatar"
        >
          <v-img :src="detail?.photo_url" />
        </v-avatar>
        <div style="clear: both"></div>
      </v-col>

      <!-- User info ở giữa -->
      <v-col cols="12" sm="6" class="d-flex flex-column justify-center text-center text-sm-left">
        <div class="text-h4">
          {{ detail?.name }}
          <v-menu>
            <template #activator="{ props: menuProps }">
              <v-tooltip text="Switch to another church" location="top">
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    v-bind="{ ...menuProps, ...tooltipProps }"
                    icon="$swapHorizontal"
                    color="primary"
                    variant="text"
                  />
                </template>
              </v-tooltip>
            </template>
          </v-menu>
        </div>
        <div class="text-h5 font-weight-bold mb-1 text-medium-emphasis">
          Pastor name
        </div>
      </v-col>
    </v-row>
  </v-container>
</v-card>

    <!-- <v-row class="my-0">
      <v-col cols="6" sm="6" md="3" v-for="(metric, i) in metrics" :key="i">
        <v-card elevation="0" class="h-100">
          <v-card variant="outlined" class="h-100">
            <v-card-text class="h-100">
              <div class="d-flex align-items-center justify-space-between">
                <v-row class="mb-0">
                  <v-col cols="3" class="d-flex align-center justify-center">
                    <v-img :src="metric.icon" alt="icon" width="40" height="40" />
                  </v-col>

                  <v-col cols="7">
                    <h4 class="text-h4 d-flex align-center mb-0" v-if="metric.earnKey">
                      {{ profile?.dashboard_metrics?.[metric.earnKey] || 0 }}
                    </h4>
                    <h4 class="text-h4 d-flex align-center mb-0" v-else-if="metric.percentKey">
                      {{ profile?.dashboard_metrics?.[metric.percentKey] || 0 }}%
                    </h4>
                    <h6 class="text-h6 text-lightText mb-1">
                      {{ $t(metric.name) }}
                    </h6>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row> -->

    <!-- Menu -->
    <v-container fluid>
    <v-row class="pa-0" align="stretch">
      <v-col
        v-for="(menu, idx) in menus"
        :key="idx"
        cols="12"
        md="6"
        class="d-flex"
      >
        <a href="#" class="link-item d-flex align-center w-100 text-primary">
          <v-icon size="24" class="me-3 text-primary">{{ menu.icon }}</v-icon>
          <span class="text-body-1">{{ $t(menu.title) }}</span>
        </a>
      </v-col>
    </v-row>
  </v-container>
     <!-- #Menu -->


  <v-row>
    <v-col cols="12" md="6">
        <PastorLeaderWidget :user-id="detail?.pastor_id" />
    </v-col>
    <v-col cols="12" md="6">
        <ChurchDetailWidget :church-id="id" />
    </v-col>
  </v-row>
</template>
<style scoped lang="scss">
.profile-avatar {
  position: relative;
    top: 0px;
    left: none;
  z-index:1;
   border: 1px solid white;
   margin-left: auto;
   margin-right: auto;
   margin-top: -70px;
   display: block;
}

@media (min-width: 768px) {
  .profile-avatar {
    position:absolute; 
    left:16px;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>