<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  resourceService,
  type ResourceDetail,
  type ResourceFile,
  type ResourceNode,
} from "@/services/resourceService";
import { stripHtmlTags } from "@/utils/utils";

defineOptions({ name: "BrowseResourcePage" });

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const currentId = computed(() => {
  const raw = route.params.id;
  return raw == null || raw === "" ? null : String(raw);
});

const folder = ref<ResourceDetail | null>(null);
const children = ref<ResourceNode[]>([]);
const ancestors = ref<ResourceNode[]>([]);
const searchText = ref("");
const isLoading = ref(false);
const loadError = ref(false);

const isRoot = computed(() => currentId.value == null);

const pageTitle = computed(() =>
  isRoot.value ? t("resource.browseTitle") : folder.value?.name || t("resource.browseTitle"),
);

type Crumb = { title: string; to?: Record<string, unknown> };

/** Last crumb is left without `to` so Vuetify renders it as the current page. */
const breadcrumbs = computed<Crumb[]>(() => {
  const items: Crumb[] = [
    {
      title: t("resource.browseTitle"),
      to: isRoot.value ? undefined : { name: "ResourceBrowse" },
    },
  ];

  for (const node of ancestors.value) {
    items.push({
      title: node.name,
      to: { name: "ResourceFolder", params: { id: String(node.id) } },
    });
  }

  if (folder.value) {
    items.push({ title: folder.value.name });
  }

  return items;
});

type FileGroup = {
  key: string;
  filename: string;
  sort_order: number;
  part_no: number;
  downloads: ResourceFile[];
};

/**
 * One row per original filename; language variants become download buttons on that row.
 */
const fileGroups = computed<FileGroup[]>(() => {
  const map = new Map<string, ResourceFile[]>();

  for (const file of folder.value?.files ?? []) {
    const key = String(file.filename || "").trim().toLowerCase();
    if (!key) continue;
    const bucket = map.get(key) ?? [];
    bucket.push(file);
    map.set(key, bucket);
  }

  const groups: FileGroup[] = [];
  for (const [key, downloads] of map) {
    const sorted = [...downloads].sort((a, b) =>
      languageLabel(a.lang).localeCompare(languageLabel(b.lang)),
    );
    // Prefer a non-AI / English copy for the display name when several exist.
    const preferred =
      sorted.find((f) => !f.is_ai_translated && f.lang === "en") ||
      sorted.find((f) => f.lang === "en") ||
      sorted.find((f) => !f.is_ai_translated) ||
      sorted[0];

    groups.push({
      key,
      filename: preferred.filename,
      sort_order: Math.min(...sorted.map((f) => f.sort_order ?? 0)),
      part_no: preferred.part_no ?? 0,
      downloads: sorted,
    });
  }

  return groups.sort(
    (a, b) =>
      a.sort_order - b.sort_order ||
      a.part_no - b.part_no ||
      a.filename.localeCompare(b.filename),
  );
});

const hasChildren = computed(() => children.value.length > 0);
const hasFiles = computed(() => fileGroups.value.length > 0);
const isEmpty = computed(() => !isLoading.value && !hasChildren.value && !hasFiles.value);

/** `available_languages` / `lang` are BCP-47 codes; show the reader-friendly name. */
function languageLabel(code: string) {
  if (!code) return "";
  // App locales such as `ptBR` are not valid BCP-47, so fall back to English names.
  for (const tag of [locale.value.replace("ptBR", "pt-BR"), "en"]) {
    try {
      return new Intl.DisplayNames([tag], { type: "language" }).of(code) || code.toUpperCase();
    } catch {
      continue;
    }
  }
  return code.toUpperCase();
}

function openFolder(node: ResourceNode) {
  void router.push({ name: "ResourceFolder", params: { id: String(node.id) } });
}

function plainDescription(html: string | null | undefined) {
  return stripHtmlTags(html);
}

const hasDescription = computed(() =>
  Boolean(plainDescription(folder.value?.short_description)),
);

async function loadChildren() {
  const name = searchText.value.trim();

  if (isRoot.value) {
    children.value = await resourceService.listRoot(name);
    return;
  }

  // With no search term the detail response already carries the children.
  if (!name) {
    children.value = [...(folder.value?.children ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name),
    );
    return;
  }

  children.value = await resourceService.listChildren(currentId.value!, name);
}

async function load() {
  isLoading.value = true;
  loadError.value = false;

  try {
    if (isRoot.value) {
      folder.value = null;
      ancestors.value = [];
      await loadChildren();
      return;
    }

    folder.value = await resourceService.getById(currentId.value!);
    ancestors.value = await resourceService.getAncestors(folder.value?.parent_id);
    await loadChildren();
  } catch (e) {
    console.error("resource load", e);
    loadError.value = true;
    folder.value = null;
    children.value = [];
    ancestors.value = [];
  } finally {
    isLoading.value = false;
  }
}

let searchDebounce: ReturnType<typeof setTimeout> | null = null;

watch(searchText, () => {
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    void loadChildren();
  }, 400);
});

watch(
  currentId,
  () => {
    searchText.value = "";
    void load();
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <v-breadcrumbs
      v-if="breadcrumbs.length > 1"
      :items="breadcrumbs"
      color="primary"
      density="compact"
      class="px-0 pt-1 pb-0"
    >
      <template #divider>
        <v-icon icon="$chevronRight" size="16" />
      </template>
    </v-breadcrumbs>

    <v-row class="my-2">
      <v-col cols="12" md="6" class="d-flex align-center">
        <div class="d-flex align-center ga-2 min-w-0">
          <v-icon
            v-if="!isRoot"
            icon="$folderOpen"
            color="primary"
            size="28"
            class="flex-shrink-0"
          />
          <div class="text-h4 font-weight-medium resource-title">
            {{ pageTitle }}
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <div class="d-flex flex-column flex-md-row align-stretch align-md-center justify-md-end ga-2">
          <v-text-field
            v-model="searchText"
            :placeholder="$t('resource.searchPlaceholder')"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="resource-search"
          >
            <template #prepend-inner>
              <v-icon icon="$magnify" />
            </template>
          </v-text-field>

          <v-btn
            v-if="!isRoot"
            color="primary"
            variant="outlined"
            @click="router.push({ name: 'ResourceBrowse' })"
          >
            <v-icon>$folder</v-icon> {{ $t("resource.allResources") }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <div
      v-if="hasDescription"
      class="resource-description mb-4"
      v-html="folder?.short_description"
    />

    <v-alert v-if="loadError" type="warning" variant="tonal" class="mb-4">
      {{ $t("resource.loadError") }}
    </v-alert>

    <v-card
      v-if="isEmpty && !loadError"
      variant="outlined"
      class="bg-surface mb-4"
    >
      <v-card-text class="text-body-1 text-medium-emphasis">
        {{ searchText.trim() ? $t("resource.noSearchResult") : $t("resource.emptyFolder") }}
      </v-card-text>
    </v-card>

    <!-- Drive-style: folder name is the page title; list has no redundant section header -->
    <v-card
      v-if="hasChildren || hasFiles"
      variant="outlined"
      elevation="0"
      class="bg-surface"
    >
      <v-list lines="two" class="py-0 resource-list">
        <template v-for="(node, index) in children" :key="`folder-${node.id}`">
          <v-divider v-if="index > 0" />
          <v-list-item class="py-3" @click="openFolder(node)">
            <template #prepend>
              <v-icon icon="$folder" color="primary" size="22" class="me-2" />
            </template>

            <v-list-item-title class="text-body-1 font-weight-medium">
              {{ node.name }}
            </v-list-item-title>

            <v-list-item-subtitle
              v-if="plainDescription(node.short_description)"
              class="text-body-2 resource-subtitle"
            >
              {{ plainDescription(node.short_description) }}
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex align-center ga-1 flex-wrap justify-end">
                <v-chip
                  v-for="code in node.available_languages ?? []"
                  :key="code"
                  size="small"
                  variant="tonal"
                  color="primary"
                >
                  {{ languageLabel(code) }}
                </v-chip>
                <v-icon icon="$chevronRight" size="18" class="ms-1 text-medium-emphasis" />
              </div>
            </template>
          </v-list-item>
        </template>

        <template v-for="(group, index) in fileGroups" :key="`file-${group.key}`">
          <v-divider v-if="index > 0 || hasChildren" />
          <v-list-item class="py-3 resource-file-item">
            <template #prepend>
              <v-icon icon="$fileDocument" color="primary" size="22" class="me-2" />
            </template>

            <v-list-item-title class="text-body-1 font-weight-medium resource-filename">
              {{ group.filename }}
            </v-list-item-title>

            <v-list-item-subtitle v-if="group.part_no" class="text-body-2 text-medium-emphasis">
              {{ $t("resource.partNo", { part: group.part_no }) }}
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex align-center ga-2 flex-wrap justify-end resource-lang-downloads">
                <v-tooltip
                  v-for="file in group.downloads"
                  :key="file.id"
                  :disabled="!file.is_ai_translated"
                  :text="$t('resource.aiTranslated')"
                >
                  <template #activator="{ props: tip }">
                    <v-btn
                      v-bind="tip"
                      color="primary"
                      variant="tonal"
                      size="small"
                      :href="file.url"
                      :download="file.filename"
                      target="_blank"
                      rel="noopener"
                    >
                      <v-icon start size="18">$download</v-icon>
                      {{ languageLabel(file.lang) }}
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.resource-title {
  line-height: 1.3;
  word-break: break-word;
}

.resource-description {
  max-width: 52rem;
  padding: 12px 14px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.06);
  border-left: 3px solid rgb(var(--v-theme-primary));
  color: rgba(var(--v-theme-on-surface), 0.75);
  font-size: 0.9375rem;
  line-height: 1.5;

  :deep(p) {
    margin-bottom: 0.5em;
  }
  :deep(p:last-child) {
    margin-bottom: 0;
  }
  :deep(ul),
  :deep(ol) {
    margin: 0.4em 0 0.5em;
    padding-left: 1.25em;
  }
  :deep(a) {
    color: rgb(var(--v-theme-primary));
  }
}

/* In the mobile column layout a flex-basis would size the field's height, not width. */
.resource-search {
  width: 100%;
  min-width: 0;
}

@media (min-width: 960px) {
  .resource-search {
    flex: 0 0 280px;
    width: 280px;
    max-width: 320px;
  }
}

.resource-list :deep(.v-list-item-title) {
  font-size: 1rem;
  line-height: 1.45;
}

.resource-list :deep(.v-list-item-subtitle) {
  font-size: 0.875rem;
  line-height: 1.4;
  opacity: 1;
}

.resource-subtitle {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  white-space: normal;
}

.resource-filename {
  word-break: break-word;
  white-space: normal;
}

.resource-lang-downloads {
  max-width: 100%;
}

@media (max-width: 599px) {
  .resource-file-item :deep(.v-list-item__content) {
    padding-bottom: 4px;
  }

  .resource-lang-downloads {
    margin-top: 6px;
    width: 100%;
    justify-content: flex-start !important;
  }
}
</style>
