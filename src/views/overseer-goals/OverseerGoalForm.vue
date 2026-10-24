<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { churchService } from "@/services/churchService";
import { countryService } from "@/services/countryService";
import { userService } from "@/services/userService";
import { goalPeriodService, type GoalPeriod } from "@/services/goalPeriodService";

type Option = { id: number; name: string };

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const periodId = computed(() => {
  const id = route.params.id;
  return id == null || id === "" ? null : String(id);
});
const isEdit = computed(() => periodId.value != null);

const pending = ref(false);
const loading = ref(false);
const overseerLoading = ref(false);
const churchLoading = ref(false);

const overseerOptions = ref<Option[]>([]);
const churchOptions = ref<Option[]>([]);
const nationOptions = ref<Option[]>([]);

const form = ref({
  user_id: null as number | null,
  local_church_id: null as number | null,
  nation_id: null as number | null,
  start_year: new Date().getFullYear(),
  end_year: new Date().getFullYear() + 2,
});

const errors = ref({
  user_id: "",
  local_church_id: "",
  nation_id: "",
  end_year: "",
});

const selectedOverseerName = ref("");
const selectedChurchName = ref("");

let overseerTimer: ReturnType<typeof setTimeout> | undefined;
let churchTimer: ReturnType<typeof setTimeout> | undefined;

function asOptions(data: unknown): Option[] {
  const record = (data && typeof data === "object" ? data : {}) as { items?: Option[] };
  const rows = Array.isArray(data) ? data : record.items || [];
  return (rows as Option[]).map((item) => ({
    id: Number(item.id),
    name: String(item.name ?? ""),
  }));
}

function mergeSelected(options: Option[], id: number | null, name: string) {
  if (id == null) return options;
  if (options.some((item) => item.id === id)) return options;
  return [{ id, name: name || String(id) }, ...options];
}

async function searchOverseers(query: string) {
  overseerLoading.value = true;
  try {
    const params: Record<string, unknown> = { page: 1, limit: 25 };
    if (query) params.name = query;
    const data = await userService.getOverseerList(params, false);
    overseerOptions.value = mergeSelected(asOptions(data), form.value.user_id, selectedOverseerName.value);
  } catch (error) {
    console.error(error);
  } finally {
    overseerLoading.value = false;
  }
}

async function searchChurches(query: string) {
  churchLoading.value = true;
  try {
    const params: Record<string, unknown> = { page: 1, limit: 25, sort_by: "name", sort_desc: false };
    if (query) params.name = query;
    const data = await churchService.getList(params, false);
    churchOptions.value = mergeSelected(asOptions(data), form.value.local_church_id, selectedChurchName.value);
  } catch (error) {
    console.error(error);
  } finally {
    churchLoading.value = false;
  }
}

function onOverseerSearch(query: string) {
  if (overseerTimer) clearTimeout(overseerTimer);
  overseerTimer = setTimeout(() => searchOverseers((query || "").trim()), 400);
}

function onChurchSearch(query: string) {
  if (churchTimer) clearTimeout(churchTimer);
  churchTimer = setTimeout(() => searchChurches((query || "").trim()), 400);
}

function required(field: "user_id" | "local_church_id" | "nation_id" | "end_year", labelKey: string) {
  const value = form.value[field];
  if (value == null || String(value).trim() === "") {
    errors.value[field] = t("validation.required", { field: t(labelKey) });
    return false;
  }
  errors.value[field] = "";
  return true;
}

function applyPeriod(period: GoalPeriod) {
  form.value.user_id = Number(period.user_id);
  form.value.local_church_id = Number(period.local_church_id);
  form.value.nation_id = Number(period.nation_id);
  form.value.start_year = Number(period.start_year);
  form.value.end_year = Number(period.end_year);
  selectedOverseerName.value = period.user_name || "";
  selectedChurchName.value = period.local_church_name || "";
  overseerOptions.value = mergeSelected([], form.value.user_id, selectedOverseerName.value);
  churchOptions.value = mergeSelected([], form.value.local_church_id, selectedChurchName.value);
  nationOptions.value = mergeSelected(
    nationOptions.value,
    form.value.nation_id,
    period.nation_name || "",
  );
}

function createdId(data: unknown): number | string | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const nested = record.goal_period as { id?: number | string } | undefined;
  const id = nested?.id ?? record.id;
  return id == null || id === "" ? null : (id as number | string);
}

async function submit() {
  const checks = [
    required("local_church_id", "overseerGoal.localChurch"),
    required("nation_id", "overseerGoal.nation"),
    required("end_year", "overseerGoal.endYear"),
  ];
  if (!isEdit.value) checks.unshift(required("user_id", "overseerGoal.overseer"));
  if (!checks.every(Boolean)) return;

  pending.value = true;
  try {
    const years = {
      local_church_id: Number(form.value.local_church_id),
      nation_id: Number(form.value.nation_id),
      start_year: Number(form.value.start_year),
      end_year: Number(form.value.end_year),
    };
    if (isEdit.value && periodId.value) {
      await goalPeriodService.update(periodId.value, years);
      router.push({ name: "OverseerGoalList" });
      return;
    }
    const created = await goalPeriodService.create({
      user_id: Number(form.value.user_id),
      ...years,
    });
    const id = createdId(created);
    if (id != null) {
      router.push({ name: "OverseerGoalGoals", params: { id } });
    } else {
      router.push({ name: "OverseerGoalList" });
    }
  } catch (error) {
    console.error(error);
  } finally {
    pending.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    const countries = await countryService.getAll();
    nationOptions.value = asOptions(countries);
    if (periodId.value) {
      const data = await goalPeriodService.get(periodId.value);
      const period = (data?.goal_period || data) as GoalPeriod;
      applyPeriod(period);
    } else {
      searchOverseers("");
      searchChurches("");
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <FormPageShell
    :title-key="isEdit ? 'overseerGoal.editTitle' : 'overseerGoal.addTitle'"
    :back-url="{ name: 'OverseerGoalList' }"
    no-card
  >
    <v-form @submit.prevent="submit">
        <v-row>
          <v-col cols="12" md="6">
            <v-label class="mb-1">
              {{ $t("overseerGoal.overseer") }}
              <span class="text-error">*</span>
            </v-label>
            <v-autocomplete
              v-model="form.user_id"
              :items="overseerOptions"
              item-title="name"
              item-value="id"
              :placeholder="$t('overseerGoal.selectOverseer')"
              :loading="overseerLoading"
              :disabled="isEdit || loading"
              variant="outlined"
              density="compact"
              hide-details="auto"
              clearable
              :error-messages="errors.user_id"
              @update:search="onOverseerSearch"
              @update:model-value="errors.user_id = ''"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="mb-1">
              {{ $t("overseerGoal.localChurch") }}
              <span class="text-error">*</span>
            </v-label>
            <v-autocomplete
              v-model="form.local_church_id"
              :items="churchOptions"
              item-title="name"
              item-value="id"
              :placeholder="$t('overseerGoal.selectChurch')"
              :loading="churchLoading"
              :disabled="loading"
              variant="outlined"
              density="compact"
              hide-details="auto"
              clearable
              :error-messages="errors.local_church_id"
              @update:search="onChurchSearch"
              @update:model-value="errors.local_church_id = ''"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="mb-1">
              {{ $t("overseerGoal.nation") }}
              <span class="text-error">*</span>
            </v-label>
            <v-autocomplete
              v-model="form.nation_id"
              :items="nationOptions"
              item-title="name"
              item-value="id"
              :placeholder="$t('overseerGoal.selectNation')"
              :disabled="loading"
              variant="outlined"
              density="compact"
              hide-details="auto"
              clearable
              :error-messages="errors.nation_id"
              @update:model-value="errors.nation_id = ''"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-label class="mb-1">
              {{ $t("overseerGoal.startYear") }}
            </v-label>
            <v-text-field
              v-model.number="form.start_year"
              type="number"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :disabled="loading"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-label class="mb-1">
              {{ $t("overseerGoal.endYear") }}
              <span class="text-error">*</span>
            </v-label>
            <v-text-field
              v-model.number="form.end_year"
              type="number"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :disabled="loading"
              :error-messages="errors.end_year"
              @update:model-value="errors.end_year = ''"
            />
          </v-col>
        </v-row>
        <div class="d-flex justify-end mt-2">
          <v-btn
            color="primary"
            type="submit"
            :loading="pending"
            :disabled="loading"
          >
            {{ $t("save") }}
          </v-btn>
        </div>
    </v-form>
  </FormPageShell>
</template>
