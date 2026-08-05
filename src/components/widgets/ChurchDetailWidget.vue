<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import CardHeader from "../shared/CardHeader.vue";
import CardHeaderEditLink from "../shared/CardHeaderEditLink.vue";
import ImagePreview from "@/components/ui/ImagePreview.vue";
import { appFormatDate } from "@/helpers/appHelper";
import { getAge } from "@/helpers/dateTimeHelper";
import { churchService } from "@/services/churchService";
import { useServiceVenueStore } from "@/stores/serviceVenueStore";
import { resolveChurchGeographicRegionDisplay } from "@/utils/churchGeographicRegion";
import {
  formatWorshipServiceSchedule,
  resolveChurchWorshipServices,
  type ChurchWorshipService,
} from "@/utils/churchWorshipServices";

const props = withDefaults(
  defineProps<{
    churchId: number;
  }>(),
  {},
);

const serviceVenueStore = useServiceVenueStore();
const detail = ref<Record<string, any>>({});
const worshipServices = ref<ChurchWorshipService[]>([]);
const geographicRegionDisplay = ref("");
const headingClass = "text-left font-weight-bold";

/** Facebook cover ratio (820 x 312), matches church photo upload. */
const CHURCH_COVER_ASPECT_RATIO = 820 / 312;

const churchPhotoUrl = computed(
  () => detail.value?.photo_url || detail.value?.photo || "",
);

function joinAddress(street?: string, postalCode?: string) {
  return [street, postalCode].filter(Boolean).join(", ");
}

function formatWebsiteUrl(url?: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
}

const editRoute = computed(() => {
  if (!detail.value?.id) return undefined;
  return { name: "ChurchEdit", params: { id: String(detail.value.id) } };
});

const serviceVenueLabel = computed(() => {
  const code = detail.value?.service_venue;
  if (!code) return "";

  const option = serviceVenueStore.options.find(
    (item: { id?: string; name?: string }) => item.id === code,
  );

  return option?.name || code;
});

const attributeChips = computed(() => {
  const chips: Array<{ key: string; label: string; color: string }> = [];

  if (detail.value?.is_mother_church) {
    chips.push({ key: "mother", label: "church.mother", color: "success" });
  }

  if (detail.value?.is_msc) {
    chips.push({ key: "msc", label: "church.msc", color: "warning" });
  }

  if (detail.value?.on_map) {
    chips.push({ key: "onMap", label: "church.onMap", color: "primary" });
  }

  return chips;
});

async function fetchData(churchId: number) {
  const response = await churchService.get(churchId, false);
  detail.value = response?.data ?? response;

  const [services, regionDisplay] = await Promise.all([
    resolveChurchWorshipServices(churchId, detail.value, false),
    resolveChurchGeographicRegionDisplay(detail.value, false),
  ]);

  worshipServices.value = services;
  geographicRegionDisplay.value = regionDisplay;
}

onMounted(() => {
  serviceVenueStore.fetchForOptions();
});

watch(
  () => props.churchId,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      fetchData(newVal);
    }
  },
  { immediate: true },
);
</script>

<template>
  <CardHeader :title="$t('church.churchDetails')">
    <template
      v-if="editRoute"
      #header
    >
      <CardHeaderEditLink :to="editRoute" />
    </template>

    <div
      v-if="detail?.id || detail?.name"
      class="church-detail-widget"
    >
      <div class="pa-4">
        <div class="d-flex align-center ga-4">
          <ImagePreview
            v-if="churchPhotoUrl"
            :src="churchPhotoUrl"
            variant="cover"
            :aspect-ratio="CHURCH_COVER_ASPECT_RATIO"
            class="church-detail-widget__photo flex-shrink-0"
          />

          <div class="flex-grow-1 min-w-0">
            <div class="text-h4 font-weight-bold text-primary">
              {{ detail.name }}
            </div>
          </div>
        </div>
      </div>

      <v-table
        class="bordered-table table-in-card table-key-value table-border-top"
        density="compact"
      >
        <tbody>
          <tr>
            <th :class="headingClass">{{ $t("church.cityTown") }}</th>
            <td>{{ detail.city_name }}</td>
          </tr>
          <tr>
            <th :class="headingClass">{{ $t("church.labelCountry") }}</th>
            <td>{{ detail.country_name }}</td>
          </tr>
          <tr>
            <th :class="headingClass">{{ $t("church.serviceAddressPostal") }}</th>
            <td>
              {{ joinAddress(detail.service_address_street, detail.service_address_postal_code) }}
            </td>
          </tr>
          <tr>
            <th :class="headingClass">{{ $t("church.serviceTimeDay") }}</th>
            <td>
              <div
                v-if="worshipServices.length"
                class="d-flex flex-column ga-1"
              >
                <div
                  v-for="service in worshipServices"
                  :key="service.id"
                >
                  <span class="font-weight-medium">{{ service.name }}</span>
                  <template v-if="formatWorshipServiceSchedule(service)">
                    <span class="text-medium-emphasis">
                      — {{ formatWorshipServiceSchedule(service) }}
                    </span>
                  </template>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th :class="headingClass">{{ $t("church.language") }}</th>
            <td>{{ detail.language_name }}</td>
          </tr>
          <tr>
            <th :class="headingClass">{{ $t("church.labelServiceVenue") }}</th>
            <td>{{ serviceVenueLabel }}</td>
          </tr>
          <tr>
            <th :class="headingClass">{{ $t("church.labelDateOfBirth") }}</th>
            <td>
              <template v-if="detail.date_of_birth">
                {{ $t("yearOld", { date: appFormatDate(detail.date_of_birth), year: getAge(detail.date_of_birth) }) }}
              </template>
            </td>
          </tr>
          <tr>
            <th :class="headingClass">{{ $t("church.motherChurch") }}</th>
            <td>
              <router-link
                v-if="detail.parent_id && detail.parent_name"
                :to="{ name: 'ChurchDetail', params: { id: detail.parent_id } }"
              >
                {{ detail.parent_name }}
              </router-link>
              <template v-else>
                {{ detail.parent_name }}
              </template>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-expansion-panels class="church-detail-widget__panels">
        <v-expansion-panel elevation="0">
          <v-expansion-panel-title>
            {{ $t("church.contactDetails") }}
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <v-table
              class="bordered-table table-in-card table-key-value"
              density="compact"
            >
              <tbody>
                <tr>
                  <th :class="headingClass">{{ $t("church.labelPastor") }}</th>
                  <td>
                    <router-link
                      v-if="detail.pastor_id && detail.pastor_name"
                      :to="{ name: 'UserDetail', params: { id: detail.pastor_id } }"
                    >
                      {{ detail.pastor_name }}
                    </router-link>
                    <template v-else>
                      {{ detail.pastor_name }}
                    </template>
                  </td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.churchEmail") }}</th>
                  <td>
                    <a
                      v-if="detail.email_address"
                      :href="`mailto:${detail.email_address}`"
                    >
                      {{ detail.email_address }}
                    </a>
                  </td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.churchPhone") }}</th>
                  <td>{{ detail.office_phone }}</td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.labelWebsite") }}</th>
                  <td>
                    <a
                      v-if="detail.website"
                      :href="formatWebsiteUrl(detail.website)"
                      target="_blank"
                      rel="noopener"
                    >
                      {{ detail.website }}
                    </a>
                  </td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.socialMedia") }}</th>
                  <td>
                    <div class="d-flex ga-1 flex-wrap">
                      <v-btn
                        v-if="detail.facebook"
                        icon="$facebook"
                        variant="outlined"
                        size="small"
                        :href="detail.facebook"
                        target="_blank"
                        rel="noopener"
                      />
                      <v-btn
                        v-if="detail.twitter"
                        icon="$twitter"
                        variant="outlined"
                        size="small"
                        :href="detail.twitter"
                        target="_blank"
                        rel="noopener"
                      />
                      <v-btn
                        v-if="detail.instagram"
                        icon="$instagram"
                        variant="outlined"
                        size="small"
                        :href="detail.instagram"
                        target="_blank"
                        rel="noopener"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.mailingAddressPostal") }}</th>
                  <td>
                    {{ joinAddress(detail.mailing_address_street, detail.mailing_address_postal_code) }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="0">
          <v-expansion-panel-title>
            {{ $t("church.omrDetails") }}
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <v-table
              class="bordered-table table-in-card table-key-value"
              density="compact"
            >
              <tbody>
                <tr>
                  <th :class="headingClass">{{ $t("church.omrNumber") }}</th>
                  <td>#{{ detail.id }}</td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.geographicRegion") }}</th>
                  <td>{{ geographicRegionDisplay }}</td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.labelChurchNetwork") }}</th>
                  <td>{{ detail.church_network_name }}</td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.apostolicRegion") }}</th>
                  <td>{{ detail.church_region_name }}</td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.labelLanguageRegion") }}</th>
                  <td>{{ detail.language_region_name }}</td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.attributes") }}</th>
                  <td>
                    <div class="d-flex flex-wrap ga-2">
                      <v-chip
                        v-for="chip in attributeChips"
                        :key="chip.key"
                        :color="chip.color"
                        size="small"
                        label
                      >
                        {{ $t(chip.label) }}
                      </v-chip>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.labelChurchType") }}</th>
                  <td>{{ detail.church_type_name }}</td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.sensitiveNation") }}</th>
                  <td :class="detail.sensitive_nation ? 'text-error font-weight-bold' : undefined">
                    {{ detail.sensitive_nation ? $t("yes") : $t("no") }}
                  </td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.currency") }}</th>
                  <td>{{ detail.currency_name }}</td>
                </tr>
                <tr>
                  <th :class="headingClass">{{ $t("church.omrMapLocation") }}</th>
                  <td>
                    <a
                      v-if="detail.map_location_url"
                      :href="detail.map_location_url"
                      target="_blank"
                      rel="noopener"
                    >
                      {{ detail.map_location_url }}
                    </a>
                  </td>
                </tr>
                <tr v-if="detail.disabled">
                  <th :class="headingClass">{{ $t("church.reasonDisabling") }}</th>
                  <td>{{ detail.disabled_reason }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <div
      v-else
      class="pa-4 text-center text-medium-emphasis"
    >
      {{ $t("noData") }}
    </div>
  </CardHeader>
</template>
