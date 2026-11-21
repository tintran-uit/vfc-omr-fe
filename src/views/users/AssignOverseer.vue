<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import FormPageShell from "@/components/shared/FormPageShell.vue";
import CardHeader from "@/components/shared/CardHeader.vue";
import AssignmentTable from "@/components/users/AssignmentTable.vue";
import ChurchNetworkSelectInput from "@/components/input/ChurchNetworkSelectInput.vue";
import LanguageRegionSelectInput from "@/components/input/LanguageRegionSelectInput.vue";
import GeographicalRegionSelectInput from "@/components/input/GeographicalRegionSelectInput.vue";
import ChurchRegionSelectInput from "@/components/input/ChurchRegionSelectInput.vue";
import { churchService } from "@/services/churchService";
import {
  overseerAssignmentService,
  type AssignmentType,
  type ExclusionType,
} from "@/services/overseerAssignmentService";
import { userService } from "@/services/userService";
import { useDialogStore } from "@/stores/dialogStore";

type NamedRef = { id: number; name: string };

const route = useRoute();
const { t } = useI18n();
const dialogStore = useDialogStore();
const userId = computed(() => String(route.params.id ?? ""));

const profile = ref<Record<string, any> | null>(null);
const churchNetworks = ref<NamedRef[]>([]);
const languageRegions = ref<NamedRef[]>([]);
const geographicalRegions = ref<NamedRef[]>([]);
const churchRegions = ref<NamedRef[]>([]);
const overseers = ref<NamedRef[]>([]);
const churches = ref<NamedRef[]>([]);
const excludedGeographical = ref<NamedRef[]>([]);
const excludedChurchRegions = ref<NamedRef[]>([]);
const overseerSort = ref<Record<number, number>>({});

const draftNetworks = ref<number[]>([]);
const draftLanguages = ref<number[]>([]);
const draftGeographical = ref<number[]>([]);
const draftChurchRegions = ref<number[]>([]);
const draftOverseers = ref<number[]>([]);
const draftChurches = ref<number[]>([]);
const draftExcludedGeo = ref<number[]>([]);
const draftExcludedChurch = ref<number[]>([]);

const overseerOptions = ref<NamedRef[]>([]);
const overseerLoading = ref(false);
const churchOptions = ref<NamedRef[]>([]);
const churchLoading = ref(false);
const pending = ref(false);
let overseerTimer: ReturnType<typeof setTimeout> | null = null;
let churchTimer: ReturnType<typeof setTimeout> | null = null;

const pageTitle = computed(() => {
  const name = profile.value?.name;
  return name ? `${t("user.assignTitle")}: ${name}` : t("user.assignTitle");
});

function asList(value: unknown): NamedRef[] {
  return Array.isArray(value) ? value : [];
}

function applyPayload(payload: any) {
  const data = payload?.user ? payload : payload?.data ?? {};
  profile.value = data.user ?? null;
  const allowed = data.assignments?.allowedIds ?? {};
  const excluded = data.assignments?.excludedIds ?? {};
  churchNetworks.value = asList(allowed.churchNetworkIds);
  languageRegions.value = asList(allowed.languageRegionIds);
  geographicalRegions.value = asList(allowed.geographicalRegionIds);
  churchRegions.value = asList(allowed.churchRegionIds);
  overseers.value = asList(allowed.overseerIds);
  churches.value = asList(allowed.churchIds);
  excludedGeographical.value = asList(excluded.geographicalRegionIds);
  excludedChurchRegions.value = asList(excluded.churchRegionIds);
  const nextSort: Record<number, number> = {};
  overseers.value.forEach((item, index) => {
    nextSort[item.id] = index;
  });
  overseerSort.value = nextSort;
}

async function load() {
  applyPayload(await overseerAssignmentService.get(userId.value));
}

function idList(value: number | number[] | null | undefined): number[] {
  if (value == null) return [];
  const list = Array.isArray(value) ? value : [value];
  return list.map((id) => Number(id)).filter((id) => Number.isFinite(id));
}

function freshIds(selected: number | number[] | null | undefined, existing: NamedRef[]) {
  const taken = new Set(existing.map((item) => Number(item.id)));
  return idList(selected).filter((id) => !taken.has(id));
}

async function run(task: () => Promise<void>) {
  if (pending.value) return;
  pending.value = true;
  try {
    await task();
  } catch (error) {
    console.error(error);
  } finally {
    pending.value = false;
  }
}

function saveAssignment(
  type: AssignmentType,
  selected: number[],
  existing: NamedRef[],
  clear: () => void,
) {
  const entityIds = freshIds(selected, existing);
  if (!entityIds.length) {
    clear();
    return;
  }
  return run(async () => {
    await overseerAssignmentService.add(userId.value, {
      assignment_type: type,
      entity_ids: entityIds,
      ...(type === "overseer" ? { sort_order: overseers.value.length } : {}),
      ...(type === "church" ? { sort_order: 0 } : {}),
    });
    clear();
    await load();
  });
}

async function removeAssignment(type: AssignmentType, entityId: number) {
  const confirmed = await dialogStore.confirm(t("areYouSureWantToDelete"));
  if (!confirmed) return;
  return run(async () => {
    await overseerAssignmentService.remove(userId.value, type, entityId);
    await load();
  });
}

function saveExclusions(
  type: ExclusionType,
  selected: number[],
  existing: NamedRef[],
  clear: () => void,
) {
  const entityIds = freshIds(selected, existing);
  if (!entityIds.length) {
    clear();
    return;
  }
  return run(async () => {
    for (const entityId of entityIds) {
      await overseerAssignmentService.addExclusion(userId.value, {
        exclusion_type: type,
        entity_id: entityId,
      });
    }
    clear();
    await load();
  });
}

async function removeExclusion(type: ExclusionType, entityId: number) {
  const confirmed = await dialogStore.confirm(t("areYouSureWantToDelete"));
  if (!confirmed) return;
  return run(async () => {
    await overseerAssignmentService.removeExclusion(userId.value, type, entityId);
    await load();
  });
}

function updateSortOrder() {
  if (!overseers.value.length) return;
  return run(async () => {
    const sortOrders: Record<string, number> = {};
    overseers.value.forEach((item) => {
      sortOrders[String(item.id)] = Number(overseerSort.value[item.id] ?? 0);
    });
    await overseerAssignmentService.sortOverseers(userId.value, sortOrders);
    await load();
  });
}

async function searchOverseers(query: string) {
  overseerLoading.value = true;
  try {
    const params: Record<string, unknown> = { limit: 25, page: 1 };
    if (query) params.name = query;
    const data = await userService.getOverseerList(params, false);
    overseerOptions.value = ((data?.items || []) as NamedRef[]).filter(
      (item) => String(item.id) !== userId.value,
    );
  } catch (error) {
    console.error(error);
  } finally {
    overseerLoading.value = false;
  }
}

function onOverseerSearch(query: string) {
  if (overseerTimer) clearTimeout(overseerTimer);
  overseerTimer = setTimeout(() => {
    searchOverseers((query || "").trim());
  }, 400);
}

async function searchChurches(query: string) {
  churchLoading.value = true;
  try {
    const params: Record<string, unknown> = { page: 1, limit: 25, sort_by: "name", sort_desc: false };
    if (query) params.search = query;
    const data = await churchService.getList(params, false);
    const found = ((data?.items || []) as NamedRef[]).filter((item) => item?.id != null);
    const selected = new Map(
      churchOptions.value
        .filter((item) => draftChurches.value.includes(Number(item.id)))
        .map((item) => [Number(item.id), item]),
    );
    found.forEach((item) => selected.set(Number(item.id), item));
    churchOptions.value = [...selected.values()];
  } catch (error) {
    console.error(error);
  } finally {
    churchLoading.value = false;
  }
}

function onChurchSearch(query: string) {
  if (churchTimer) clearTimeout(churchTimer);
  churchTimer = setTimeout(() => {
    searchChurches((query || "").trim());
  }, 400);
}

onMounted(() => {
  load().catch((error) => console.error(error));
  searchOverseers("");
  searchChurches("");
});
</script>

<template>
  <FormPageShell
    :title="pageTitle"
    :back-url="{ name: 'UserOverseerList' }"
    no-card
  >
    <v-row>
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignOverseeing')}: ${$t('user.churchNetwork')}`">
          <AssignmentTable
            :items="churchNetworks"
            @remove="removeAssignment('church_network', $event)"
          />
        </CardHeader>
      </v-col>
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignNew')}: ${$t('user.churchNetwork')}`">
          <div class="pa-4">
            <ChurchNetworkSelectInput
              v-model="draftNetworks"
              multiple
              chips
              closable-chips
              hide-details
              :placeholder="$t('user.assignSelectPlaceholder')"
            />
            <div class="d-flex justify-end mt-3">
              <v-btn
                color="primary"
                :disabled="!freshIds(draftNetworks, churchNetworks).length"
                :loading="pending"
                @click="saveAssignment('church_network', draftNetworks, churchNetworks, () => { draftNetworks = [] })"
              >
                {{ $t("save") }}
              </v-btn>
            </div>
          </div>
        </CardHeader>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignOverseeing')}: ${$t('user.geographicalRegion')}`">
          <AssignmentTable
            :items="geographicalRegions"
            @remove="removeAssignment('geographical_region', $event)"
          />
        </CardHeader>
      </v-col>
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignNew')}: ${$t('user.geographicalRegion')}`">
          <div class="pa-4">
            <GeographicalRegionSelectInput
              v-model="draftGeographical"
              multiple
              chips
              closable-chips
              hide-details
              :placeholder="$t('user.assignSelectPlaceholder')"
            />
            <div class="d-flex justify-end mt-3">
              <v-btn
                color="primary"
                :disabled="!freshIds(draftGeographical, geographicalRegions).length"
                :loading="pending"
                @click="saveAssignment('geographical_region', draftGeographical, geographicalRegions, () => { draftGeographical = [] })"
              >
                {{ $t("save") }}
              </v-btn>
            </div>
          </div>
        </CardHeader>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignExclusionList')}: ${$t('user.geographicalRegion')}`">
          <AssignmentTable
            :items="excludedGeographical"
            @remove="removeExclusion('geographical_region', $event)"
          />
        </CardHeader>
      </v-col>
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignExclude')}: ${$t('user.geographicalRegion')}`">
          <div class="pa-4">
            <GeographicalRegionSelectInput
              v-model="draftExcludedGeo"
              multiple
              chips
              closable-chips
              hide-details
              :placeholder="$t('user.assignSelectPlaceholder')"
            />
            <div class="d-flex justify-end mt-3">
              <v-btn
                color="primary"
                :disabled="!freshIds(draftExcludedGeo, excludedGeographical).length"
                :loading="pending"
                @click="saveExclusions('geographical_region', draftExcludedGeo, excludedGeographical, () => { draftExcludedGeo = [] })"
              >
                {{ $t("save") }}
              </v-btn>
            </div>
          </div>
        </CardHeader>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignOverseeing')}: ${$t('user.churchApostolicRegions')}`">
          <AssignmentTable
            :items="churchRegions"
            @remove="removeAssignment('church_region', $event)"
          />
        </CardHeader>
      </v-col>
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignNew')}: ${$t('user.churchApostolicRegions')}`">
          <div class="pa-4">
            <ChurchRegionSelectInput
              v-model="draftChurchRegions"
              multiple
              chips
              closable-chips
              hide-details
              :placeholder="$t('user.assignSelectPlaceholder')"
            />
            <div class="d-flex justify-end mt-3">
              <v-btn
                color="primary"
                :disabled="!freshIds(draftChurchRegions, churchRegions).length"
                :loading="pending"
                @click="saveAssignment('church_region', draftChurchRegions, churchRegions, () => { draftChurchRegions = [] })"
              >
                {{ $t("save") }}
              </v-btn>
            </div>
          </div>
        </CardHeader>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignExclusionList')}: ${$t('user.churchApostolicRegions')}`">
          <AssignmentTable
            :items="excludedChurchRegions"
            @remove="removeExclusion('church_region', $event)"
          />
        </CardHeader>
      </v-col>
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignExclude')}: ${$t('user.churchApostolicRegions')}`">
          <div class="pa-4">
            <ChurchRegionSelectInput
              v-model="draftExcludedChurch"
              multiple
              chips
              closable-chips
              hide-details
              :placeholder="$t('user.assignSelectPlaceholder')"
            />
            <div class="d-flex justify-end mt-3">
              <v-btn
                color="primary"
                :disabled="!freshIds(draftExcludedChurch, excludedChurchRegions).length"
                :loading="pending"
                @click="saveExclusions('church_region', draftExcludedChurch, excludedChurchRegions, () => { draftExcludedChurch = [] })"
              >
                {{ $t("save") }}
              </v-btn>
            </div>
          </div>
        </CardHeader>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignOverseeing')}: ${$t('user.languageRegion')}`">
          <AssignmentTable
            :items="languageRegions"
            @remove="removeAssignment('language_region', $event)"
          />
        </CardHeader>
      </v-col>
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignNew')}: ${$t('user.languageRegion')}`">
          <div class="pa-4">
            <LanguageRegionSelectInput
              v-model="draftLanguages"
              multiple
              chips
              closable-chips
              hide-details
              :placeholder="$t('user.assignSelectPlaceholder')"
            />
            <div class="d-flex justify-end mt-3">
              <v-btn
                color="primary"
                :disabled="!freshIds(draftLanguages, languageRegions).length"
                :loading="pending"
                @click="saveAssignment('language_region', draftLanguages, languageRegions, () => { draftLanguages = [] })"
              >
                {{ $t("save") }}
              </v-btn>
            </div>
          </div>
        </CardHeader>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <CardHeader
          :title="`${$t('user.assignOverseeing')}: ${$t('user.assignAddOverseer')} [${$t('user.assignDisplayOnDashboard')}]`"
        >
          <v-table
            density="compact"
            class="bordered-table"
          >
            <thead>
              <tr>
                <th class="assignment-sort">{{ $t("user.assignSort") }}</th>
                <th>{{ $t("user.labelName") }}</th>
                <th class="text-end">{{ $t("user.assignRemove") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!overseers.length">
                <td
                  colspan="3"
                  class="text-center text-medium-emphasis"
                >
                  {{ $t("noData") }}
                </td>
              </tr>
              <tr
                v-for="item in overseers"
                :key="item.id"
              >
                <td>
                  <v-text-field
                    v-model.number="overseerSort[item.id]"
                    type="number"
                    min="0"
                    density="compact"
                    variant="outlined"
                    hide-details
                    class="assignment-sort__input"
                  />
                </td>
                <td>{{ item.name }}</td>
                <td class="text-end">
                  <v-btn
                    icon="$delete"
                    variant="text"
                    size="small"
                    color="error"
                    @click="removeAssignment('overseer', item.id)"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
          <div class="pa-4">
            <v-btn
              color="primary"
              :disabled="!overseers.length"
              :loading="pending"
              @click="updateSortOrder"
            >
              {{ $t("user.assignSaveOrder") }}
            </v-btn>
          </div>
        </CardHeader>
      </v-col>
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignNew')}: ${$t('user.assignAddOverseer')}`">
          <div class="pa-4">
            <v-autocomplete
              v-model="draftOverseers"
              :items="overseerOptions"
              item-title="name"
              item-value="id"
              :loading="overseerLoading"
              :placeholder="$t('user.assignSelectPlaceholder')"
              variant="outlined"
              density="compact"
              hide-details
              multiple
              chips
              closable-chips
              clearable
              @update:search="onOverseerSearch"
            />
            <div class="d-flex justify-end mt-3">
              <v-btn
                color="primary"
                :disabled="!freshIds(draftOverseers, overseers).length"
                :loading="pending"
                @click="saveAssignment('overseer', draftOverseers, overseers, () => { draftOverseers = [] })"
              >
                {{ $t("save") }}
              </v-btn>
            </div>
          </div>
        </CardHeader>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignOverseeing')}: ${$t('user.assignChurch')}`">
          <AssignmentTable
            :items="churches"
            @remove="removeAssignment('church', $event)"
          />
        </CardHeader>
      </v-col>
      <v-col cols="12" md="6">
        <CardHeader :title="`${$t('user.assignNew')}: ${$t('user.assignChurch')}`">
          <div class="pa-4">
            <v-autocomplete
              v-model="draftChurches"
              :items="churchOptions"
              item-title="name"
              item-value="id"
              :loading="churchLoading"
              :placeholder="$t('user.assignSelectPlaceholder')"
              variant="outlined"
              density="compact"
              hide-details
              multiple
              chips
              closable-chips
              clearable
              @update:search="onChurchSearch"
            />
            <div class="d-flex justify-end mt-3">
              <v-btn
                color="primary"
                :disabled="!freshIds(draftChurches, churches).length"
                :loading="pending"
                @click="saveAssignment('church', draftChurches, churches, () => { draftChurches = [] })"
              >
                {{ $t("save") }}
              </v-btn>
            </div>
          </div>
        </CardHeader>
      </v-col>
    </v-row>
  </FormPageShell>
</template>

<style scoped lang="scss">
// Same scale as the pastor dashboard header, card titles, and widget tables.
:deep(.text-h4) {
  color: #1c1c1e;
  font-size: 1.25rem !important;
  font-weight: 700 !important;
  line-height: 1.3;
  letter-spacing: normal !important;
}

:deep(.v-card-title) {
  font-size: 1rem !important;
  font-weight: 600 !important;
  line-height: 1.5;
  letter-spacing: normal !important;
}

:deep(.v-table.bordered-table) {
  font-size: 0.875rem;
  line-height: 1.5;

  th,
  td {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  thead th {
    font-weight: 600;
  }
}

:deep(.v-btn:not(.v-btn--icon)) {
  font-size: 0.875rem;
}

.assignment-sort {
  width: 96px;
}

.assignment-sort__input {
  max-width: 84px;
}
</style>
