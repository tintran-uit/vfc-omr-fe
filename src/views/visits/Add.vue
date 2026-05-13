<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";
import CardHeader from "@/components/shared/CardHeader.vue";
import { createVisitStep1FormSchema } from "@/form-schemas/addVisitStep1FormSchema";
import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";
import { countryService } from "@/services/countryService";
import { cityService } from "@/services/cityService";
import { churchService } from "@/services/churchService";
import { visitsService } from "@/services/visitsService";
import { eventsService } from "@/services/eventsService";
import { eventTypesService, type EventType } from "@/services/eventTypesService";
import { formatDate } from "@/helpers/dateTimeHelper";

type VisitStep1 = {
  user_id: number | null;
  month: number | null;
  year: number;
  number_of_churches_visited: number;
  number_of_events_organised: number;
};

type WeekEntry = {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
};

type VisitChurchBlock = {
  key: number;
  country_id: number | null;
  city_id: number | null;
  church_id: number | null;
  cityOptions: Array<{ id: number; name: string }>;
  churchOptions: Array<{ id: number; name: string }>;
  loadingCities: boolean;
  loadingChurches: boolean;
  daysByWeek: Record<number, number>;
};

type VisitEventBlock = {
  key: number;
  country_id: number | null;
  event_type_id: number | null;
  name: string;
  attendance: number | null;
  meeting_with: number | null;
  daysByWeek: Record<number, number>;
};

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const messageStore = useMessageStore();

const step1Schema = createVisitStep1FormSchema();
const currentStep = ref<1 | 2>(1);
const saving = ref(false);
const step2FormRef = ref<any>(null);
const step2InlineError = ref<string>("");

const step1Data = ref<VisitStep1 | null>(null);
const countries = ref<Array<{ id: number; name: string }>>([]);
const visitBlocks = ref<VisitChurchBlock[]>([]);
const eventBlocks = ref<VisitEventBlock[]>([]);
const eventTypes = ref<EventType[]>([]);

const countOptions = Array.from({ length: 101 }, (_, i) => ({
  title: String(i),
  value: i,
}));

const yearOptions = computed(() => {
  const max = new Date().getFullYear() + 5;
  const min = 1990;
  const list: Array<{ title: string; value: number }> = [];
  for (let y = max; y >= min; y -= 1) {
    list.push({ title: String(y), value: y });
  }
  return list;
});

const monthOptions = computed(() =>
  Array.from({ length: 12 }, (_, idx) => ({
    value: idx + 1,
    title: t(`months.${idx + 1}`),
  })),
);

const step1Options = computed(() => ({
  counts: countOptions,
  years: yearOptions.value,
  months: monthOptions.value,
}));

const step1InitData = computed(() => {
  if (step1Data.value) return step1Data.value;
  return {
    ...(step1Schema.initData ? step1Schema.initData() : {}),
    user_id: authStore.user?.id ?? null,
  };
});

const committedWeeks = computed<WeekEntry[]>(() => {
  if (!step1Data.value?.year || !step1Data.value?.month) return [];
  return getWeeksForMonth(step1Data.value.year, step1Data.value.month);
});

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getStartOfISOWeek(date: Date) {
  const d = startOfDay(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - (day - 1));
  return d;
}

function getEndOfISOWeek(date: Date) {
  const start = getStartOfISOWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getWeeksForMonth(year: number, month: number): WeekEntry[] {
  const result: WeekEntry[] = [];
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);
  let current = getStartOfISOWeek(startOfMonth);

  while (current <= endOfMonth) {
    const startDate = getStartOfISOWeek(current);
    const endDate = getEndOfISOWeek(current);
    if (endDate.getFullYear() === year && endDate.getMonth() === month - 1) {
      result.push({
        weekNumber: getISOWeekNumber(endDate),
        startDate,
        endDate,
      });
    }
    current.setDate(current.getDate() + 7);
  }
  return result;
}

function buildDaysByWeek(weeks: WeekEntry[]) {
  return weeks.reduce<Record<number, number>>((acc, w) => {
    acc[w.weekNumber] = 0;
    return acc;
  }, {});
}

function buildVisitBlocks(count: number) {
  const total = Number(count || 0);
  const weeks = committedWeeks.value;
  visitBlocks.value = Array.from({ length: total }, (_, idx) => ({
    key: idx + 1,
    country_id: null,
    city_id: null,
    church_id: null,
    cityOptions: [],
    churchOptions: [],
    loadingCities: false,
    loadingChurches: false,
    daysByWeek: buildDaysByWeek(weeks),
  }));
}

function buildEventBlocks(count: number) {
  const total = Number(count || 0);
  const weeks = committedWeeks.value;
  eventBlocks.value = Array.from({ length: total }, (_, idx) => ({
    key: idx + 1,
    country_id: null,
    event_type_id: null,
    name: "",
    attendance: null,
    meeting_with: null,
    daysByWeek: buildDaysByWeek(weeks),
  }));
}

const selectedEventTypeById = computed(() => {
  const map = new Map<number, EventType>();
  (eventTypes.value || []).forEach((et) => map.set(Number(et.id), et));
  return map;
});

const isOneToOneEventType = (event_type_id: number | null) => {
  if (!event_type_id) return false;
  const et = selectedEventTypeById.value.get(Number(event_type_id));
  return String(et?.meeting_type || "").toLowerCase() === "1-1";
};

const handleStep1Submit = (formData: Record<string, any>) => {
  step1Data.value = {
    user_id: formData.user_id != null ? Number(formData.user_id) : null,
    month: formData.month != null ? Number(formData.month) : null,
    year: Number(formData.year),
    number_of_churches_visited: Number(formData.number_of_churches_visited || 0),
    number_of_events_organised: Number(formData.number_of_events_organised || 0),
  };
  buildVisitBlocks(step1Data.value.number_of_churches_visited);
  buildEventBlocks(step1Data.value.number_of_events_organised);
  currentStep.value = 2;
};

const goBackToStep1 = () => {
  currentStep.value = 1;
};

const loadCountries = async () => {
  try {
    const { items } = await countryService.getAll();
    countries.value = (items || []).map((it: any) => ({
      id: it.id,
      name: it.name,
    }));
  } catch (e) {
    console.error(e);
  }
};

const loadEventTypes = async () => {
  try {
    const resp = await eventTypesService.getAll(false);
    // expected response: { success: true, data: [...] }
    const rows = (resp?.data || resp?.items || resp || []) as EventType[];
    eventTypes.value = (rows || []).map((it: any) => ({
      id: Number(it.id),
      name: String(it.name ?? ""),
      color: it.color,
      cell_color: it.cell_color,
      meeting_type: it.meeting_type,
    }));
  } catch (e) {
    console.error(e);
  }
};

const onCountryChanged = async (block: VisitChurchBlock) => {
  block.city_id = null;
  block.church_id = null;
  block.churchOptions = [];
  block.cityOptions = [];
  if (!block.country_id) return;

  block.loadingCities = true;
  try {
    const rows = await cityService.getAllByCountry(block.country_id);
    block.cityOptions = (rows || []).map((city: any) => ({
      id: city.id,
      name: city.name,
    }));
  } catch (e) {
    console.error(e);
  } finally {
    block.loadingCities = false;
  }
};

const onCityChanged = async (block: VisitChurchBlock) => {
  block.church_id = null;
  block.churchOptions = [];
  if (!block.city_id) return;

  block.loadingChurches = true;
  try {
    const resp = await churchService.getList(
      { page: 1, limit: 500, city_id: block.city_id },
      false,
    );
    block.churchOptions = (resp?.items || []).map((church: any) => ({
      id: church.id,
      name: church.name,
    }));
  } catch (e) {
    console.error(e);
  } finally {
    block.loadingChurches = false;
  }
};

const getWeekLabel = (week: WeekEntry) => {
  // Desired format: 21 Sep - 29 Sep ’25
  const start = formatDate(week.startDate, "DD MMM");
  const end = formatDate(week.endDate, "DD MMM");
  const yy = formatDate(week.endDate, "YY");
  return `${start} - ${end} ’${yy}`;
};

const requiredMsg = (fieldLabelKey: string) =>
  t("validation.required", { field: t(fieldLabelKey) });

const ruleRequired = (fieldLabelKey: string) => (v: any) =>
  (v !== null && v !== undefined && String(v).trim() !== "") || requiredMsg(fieldLabelKey);

const ruleIntMin0 = (msgKey: string) => (v: any) => {
  if (v === null || v === undefined || v === "") return true;
  const n = Number(v);
  return (Number.isFinite(n) && Number.isInteger(n) && n >= 0) || t(msgKey);
};

const ruleIntRange0to7 = (msgKey: string) => (v: any) => {
  if (v === null || v === undefined || v === "") return true;
  const n = Number(v);
  return (Number.isFinite(n) && Number.isInteger(n) && n >= 0 && n <= 7) || t(msgKey);
};

const scrollToFirstStep2Error = async () => {
  await nextTick();
  const firstErrorEl = document.querySelector(
    ".v-input.error, .v-field--error",
  ) as HTMLElement | null;
  if (firstErrorEl) {
    firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    firstErrorEl.focus?.();
  }
};

const buildVisitsBulkPayload = () => {
  if (!step1Data.value) return [];
  const year = Number(step1Data.value.year);
  const userId = Number(step1Data.value.user_id);
  const payload: Array<{
    user_id: number;
    church_id: number;
    year: number;
    week_number: number;
    number_of_days: number;
  }> = [];

  for (const block of visitBlocks.value) {
    const churchId = Number(block.church_id);
    for (const week of committedWeeks.value) {
      const raw = Number(block.daysByWeek[week.weekNumber] ?? 0);
      if (!Number.isFinite(raw)) continue;
      const numberOfDays = Math.max(0, Math.min(7, Math.trunc(raw)));
      if (numberOfDays <= 0) continue;
      payload.push({
        user_id: userId,
        church_id: churchId,
        year,
        week_number: week.weekNumber,
        number_of_days: numberOfDays,
      });
    }
  }

  return payload;
};

const buildEventsBulkPayload = () => {
  if (!step1Data.value) return [];
  const year = Number(step1Data.value.year);
  const userId = Number(step1Data.value.user_id);

  const payload: Array<{
    name: string;
    event_type_id: number;
    user_id: number;
    attendance?: number;
    country_id: number;
    number_of_days: number;
    year: number;
    week_number: number;
    meeting_with?: number;
  }> = [];

  for (const block of eventBlocks.value) {
    const countryId = Number(block.country_id);
    const eventTypeId = Number(block.event_type_id);
    const eventName = String(block.name || "").trim();
    const attendance =
      block.attendance == null || block.attendance === ("" as any)
        ? undefined
        : Number(block.attendance);

    const meetingWith =
      isOneToOneEventType(block.event_type_id) && block.meeting_with
        ? Number(block.meeting_with)
        : undefined;

    for (const week of committedWeeks.value) {
      const raw = Number(block.daysByWeek[week.weekNumber] ?? 0);
      if (!Number.isFinite(raw)) continue;
      const numberOfDays = Math.max(0, Math.min(7, Math.trunc(raw)));
      if (numberOfDays <= 0) continue;

      payload.push({
        name: eventName,
        event_type_id: eventTypeId,
        user_id: userId,
        attendance,
        country_id: countryId,
        number_of_days: numberOfDays,
        year,
        week_number: week.weekNumber,
        meeting_with: meetingWith,
      });
    }
  }

  return payload;
};

const saveStep2 = async () => {
  if (!step1Data.value || saving.value) return;
  step2InlineError.value = "";

  const { valid } = (await step2FormRef.value?.validate?.()) ?? { valid: true };
  if (!valid) {
    await scrollToFirstStep2Error();
    return;
  }

  const visitsPayload = buildVisitsBulkPayload();
  const eventsPayload = buildEventsBulkPayload();

  if (!visitsPayload.length && !eventsPayload.length) {
    step2InlineError.value = t("visitsAdd.validation.atLeastOneWeek");
    await nextTick();
    const alertEl = document.getElementById("step2-inline-error");
    alertEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  saving.value = true;
  try {
    await Promise.all([
      visitsPayload.length ? visitsService.bulkCreate(visitsPayload) : Promise.resolve(null),
      eventsPayload.length ? eventsService.bulkCreate(eventsPayload) : Promise.resolve(null),
    ]);

    messageStore.info(t("visitsAdd.notifications.saved"));
    router.push({ name: "Dashboard" });
  } catch (e) {
    console.error(e);
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadCountries();
  loadEventTypes();
});
</script>

<template>
  <v-row class="my-2">
    <v-col cols="12" class="d-flex align-center">
      <h3 class="text-h3 mt-2">
        {{ $t("visitsAdd.title") }}
      </h3>
    </v-col>
  </v-row>

  <template v-if="currentStep === 1">
    <DynamicFormDefault
      :form-schema="step1Schema"
      :options="step1Options"
      :init-data="step1InitData"
      form-only
      hide-form-header
      @submit="handleStep1Submit"
    >
      <template #actions="{ submit }">
        <div class="d-flex justify-end mt-4">
          <v-btn color="primary" @click="submit">
            {{ $t("visitsAdd.actions.continue") }}
          </v-btn>
        </div>
      </template>
    </DynamicFormDefault>
  </template>

  <template v-else>
    <v-card variant="outlined">
      <v-card-text class="pa-4 pa-md-6">
        <div class="text-subtitle-1 font-weight-bold mb-1">
          {{ $t("visitsAdd.step2.title") }}
        </div>
        <div class="text-body-2 text-medium-emphasis mb-4">
          {{ $t("visitsAdd.step2.context.visitor") }} {{ step1Data?.user_id }} |
          {{ monthOptions.find((m) => m.value === step1Data?.month)?.title }}
          {{ step1Data?.year }}
        </div>

        <v-alert
          v-if="!visitBlocks.length"
          type="info"
          variant="tonal"
          class="mb-4"
          density="comfortable"
        >
          {{ $t("visitsAdd.step2.noVisitsInfo") }}
        </v-alert>

        <v-form ref="step2FormRef">
          <v-alert
            v-if="step2InlineError"
            id="step2-inline-error"
            type="error"
            variant="tonal"
            class="mb-4"
            density="comfortable"
          >
            {{ step2InlineError }}
          </v-alert>

          <div
            v-if="visitBlocks.length"
            class="d-flex flex-column ga-6"
          >
            <CardHeader
              v-for="block in visitBlocks"
              :key="block.key"
              :title="`${$t('visitsAdd.step2.visits.cardTitlePrefix')} ${block.key}`"
            >
              <div class="pa-4 pa-md-6">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-label class="mb-1 d-block">{{ $t("visitsAdd.fields.nation") }}</v-label>
                    <v-autocomplete
                      v-model="block.country_id"
                      :items="countries"
                      item-title="name"
                      item-value="id"
                      variant="outlined"
                      density="compact"
                      :rules="[ruleRequired('visitsAdd.fields.nation')]"
                      @update:model-value="onCountryChanged(block)"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="mb-1 d-block">{{ $t("visitsAdd.fields.city") }}</v-label>
                    <v-autocomplete
                      v-model="block.city_id"
                      :items="block.cityOptions"
                      :loading="block.loadingCities"
                      item-title="name"
                      item-value="id"
                      variant="outlined"
                      density="compact"
                      :disabled="!block.country_id"
                      :rules="[
                        (v) =>
                          !block.country_id ||
                          ruleRequired('visitsAdd.fields.city')(v),
                      ]"
                      @update:model-value="onCityChanged(block)"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-label class="mb-1 d-block">{{ $t("visitsAdd.fields.church") }}</v-label>
                    <v-autocomplete
                      v-model="block.church_id"
                      :items="block.churchOptions"
                      :loading="block.loadingChurches"
                      item-title="name"
                      item-value="id"
                      variant="outlined"
                      density="compact"
                      :disabled="!block.city_id"
                      :rules="[
                        (v) =>
                          !block.city_id ||
                          ruleRequired('visitsAdd.fields.church')(v),
                      ]"
                    />
                  </v-col>
                </v-row>

              <div class="table-bordered mt-4">
                <table class="visit-days-table__grid">
                  <thead>
                    <tr>
                      <th class="visit-days-table__corner" />
                      <th
                        v-for="week in committedWeeks"
                        :key="`h-${block.key}-${week.weekNumber}`"
                        class="visit-days-table__th text-center"
                      >
                        <div class="text-body-2 font-weight-medium">
                          {{ getWeekLabel(week) }}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="visit-days-table__label text-body-2">
                        <div class="d-flex align-center ga-2">
                          <span>{{ $t("visitsAdd.step2.visits.weeklyRowLabel") }}</span>
                          <v-tooltip :text="$t('visitsAdd.step2.visits.weeklyRowTooltip')">
                            <template #activator="{ props }">
                              <v-icon
                                v-bind="props"
                                size="16"
                                color="primary"
                              >
                                $informationOutline
                              </v-icon>
                            </template>
                          </v-tooltip>
                        </div>
                      </td>
                      <td
                        v-for="week in committedWeeks"
                        :key="`c-${block.key}-${week.weekNumber}`"
                        class="visit-days-table__cell"
                      >
                        <v-text-field
                          v-model.number="block.daysByWeek[week.weekNumber]"
                          type="number"
                          min="0"
                          max="7"
                          step="1"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          class="visit-days-table__input"
                          placeholder="0"
                          @wheel.prevent
                          @keydown.up.prevent
                          @keydown.down.prevent
                          :rules="[
                            ruleIntRange0to7('visitsAdd.validation.daysRange0to7'),
                          ]"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              </div>
            </CardHeader>
          </div>

          <div
            v-if="eventBlocks.length"
            class="d-flex flex-column ga-6 mt-6"
          >
            <CardHeader
              v-for="event in eventBlocks"
              :key="event.key"
              :title="`${$t('visitsAdd.step2.events.cardTitlePrefix')} ${event.key}`"
            >
              <div class="pa-4 pa-md-6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-label class="mb-1 d-block">{{ $t("visitsAdd.fields.nation") }}</v-label>
                  <v-autocomplete
                    v-model="event.country_id"
                    :items="countries"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    density="compact"
                    :rules="[ruleRequired('visitsAdd.fields.nation')]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-label class="mb-1 d-block">
                    <span class="d-inline-flex align-center ga-2">
                      <span>{{ $t("visitsAdd.step2.events.fields.eventType") }}</span>
                      <v-tooltip :text="$t('visitsAdd.step2.events.tooltips.eventType')">
                        <template #activator="{ props }">
                          <v-icon
                            v-bind="props"
                            size="16"
                            color="primary"
                          >
                            $informationOutline
                          </v-icon>
                        </template>
                      </v-tooltip>
                    </span>
                  </v-label>
                  <v-autocomplete
                    v-model="event.event_type_id"
                    :items="eventTypes"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    density="compact"
                    :rules="[ruleRequired('visitsAdd.step2.events.fields.eventType')]"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-label class="mb-1 d-block">
                    <span class="d-inline-flex align-center ga-2">
                      <span>{{ $t("visitsAdd.step2.events.fields.eventName") }}</span>
                      <v-tooltip :text="$t('visitsAdd.step2.events.tooltips.eventName')">
                        <template #activator="{ props }">
                          <v-icon
                            v-bind="props"
                            size="16"
                            color="primary"
                          >
                            $informationOutline
                          </v-icon>
                        </template>
                      </v-tooltip>
                    </span>
                  </v-label>
                  <v-text-field
                    v-model="event.name"
                    variant="outlined"
                    density="compact"
                    :rules="[ruleRequired('visitsAdd.step2.events.fields.eventName')]"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-label class="mb-1 d-block">{{ $t("visitsAdd.step2.events.fields.attendance") }}</v-label>
                  <v-text-field
                    v-model.number="event.attendance"
                    type="number"
                    min="0"
                    step="1"
                    variant="outlined"
                    density="compact"
                    :rules="[ruleIntMin0('visitsAdd.validation.attendanceInvalid')]"
                    @wheel.prevent
                    @keydown.up.prevent
                    @keydown.down.prevent
                  />
                </v-col>
              </v-row>

              <v-row v-if="isOneToOneEventType(event.event_type_id)">
                <v-col cols="12" md="6">
                  <v-label class="mb-1 d-block">{{ $t("visitsAdd.step2.events.fields.meetingWith") }}</v-label>
                  <PastorSelectInput
                    v-model="event.meeting_with"
                    :rules="[
                      (v) =>
                        !isOneToOneEventType(event.event_type_id) ||
                        ruleRequired('visitsAdd.step2.events.fields.meetingWith')(v),
                    ]"
                    :clearable="true"
                  />
                </v-col>
              </v-row>

              <div class="table-bordered mt-4">
                <table class="visit-days-table__grid">
                  <thead>
                    <tr>
                      <th class="visit-days-table__corner" />
                      <th
                        v-for="week in committedWeeks"
                        :key="`eh-${event.key}-${week.weekNumber}`"
                        class="visit-days-table__th text-center"
                      >
                        <div class="text-body-2 font-weight-medium">
                          {{ getWeekLabel(week) }}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="visit-days-table__label text-body-2">
                        <div class="d-flex align-center ga-2">
                          <span>{{ $t("visitsAdd.step2.events.weeklyRowLabel") }}</span>
                          <v-tooltip :text="$t('visitsAdd.step2.events.weeklyRowTooltip')">
                            <template #activator="{ props }">
                              <v-icon
                                v-bind="props"
                                size="16"
                                color="primary"
                              >
                                $informationOutline
                              </v-icon>
                            </template>
                          </v-tooltip>
                        </div>
                      </td>
                      <td
                        v-for="week in committedWeeks"
                        :key="`ec-${event.key}-${week.weekNumber}`"
                        class="visit-days-table__cell"
                      >
                        <v-text-field
                          v-model.number="event.daysByWeek[week.weekNumber]"
                          type="number"
                          min="0"
                          max="7"
                          step="1"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          class="visit-days-table__input"
                          placeholder="0"
                          @wheel.prevent
                          @keydown.up.prevent
                          @keydown.down.prevent
                          :rules="[
                            ruleIntRange0to7('visitsAdd.validation.daysRange0to7'),
                          ]"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              </div>
            </CardHeader>
          </div>
        </v-form>

        <div class="d-flex justify-space-between mt-4">
          <v-btn variant="outlined" @click="goBackToStep1">
            {{ $t("visitsAdd.actions.back") }}
          </v-btn>
          <v-btn color="primary" :loading="saving" @click="saveStep2">
            {{ $t("visitsAdd.actions.save") }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </template>
</template>

<style scoped lang="scss">
.visit-days-table__grid {
  width: 100%;
  min-width: 520px;
}

.visit-days-table__corner {
  width: 220px;
  min-width: 180px;
}

.visit-days-table__th,
.visit-days-table__label,
.visit-days-table__cell {
  padding: 10px 12px;
  vertical-align: middle;
}

.visit-days-table__th {
  white-space: nowrap;
}

.visit-days-table__label {
  max-width: 280px;
  vertical-align: middle;
}

.visit-days-table__cell {
  width: 110px;
}

.visit-days-table__input {
  min-width: 88px;
}
</style>