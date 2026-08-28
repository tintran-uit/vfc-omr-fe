<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    titleKey?: string;
    title?: string;
    backUrl?: string | Record<string, unknown>;
    hideBack?: boolean;
    /** Wrap content in an outlined card */
    withCard?: boolean;
    /** v-col md breakpoint for title (default 6) */
    titleMd?: number;
    /** v-col md breakpoint for header-right slot (default 6) */
    headerRightMd?: number;
  }>(),
  {
    hideBack: false,
    withCard: true,
    titleMd: 6,
    headerRightMd: 6,
  },
);

const resolvedTitle = computed(() => {
  if (props.title != null && String(props.title).trim() !== "") return props.title;
  if (props.titleKey) return t(props.titleKey);
  return "";
});
</script>

<template>
  <div>
    <v-row class="my-2">
      <v-col cols="12" :md="titleMd" class="d-flex align-center">
        <div class="text-h4 font-weight-medium table-page-shell__title">
          {{ resolvedTitle }}
        </div>
      </v-col>

      <v-col cols="12" :md="headerRightMd">
        <div class="d-flex flex-column flex-md-row flex-md-wrap align-stretch align-md-center justify-md-end ga-2">
          <slot name="header-right" />

          <template v-if="backUrl && !hideBack">
            <v-btn
              color="primary"
              variant="outlined"
              @click="router.push(backUrl)"
            >
              <v-icon>$arrowLeft</v-icon> {{ $t("backToList") }}
            </v-btn>
          </template>
        </div>
      </v-col>
    </v-row>

    <component
      :is="withCard ? 'v-card' : 'div'"
      variant="outlined"
      elevation="0"
      class="bg-surface overflow-hidden"
    >
      <slot />
    </component>
  </div>
</template>

<style scoped lang="scss">
.table-page-shell__title {
  line-height: 1.3;
  word-break: break-word;
}
</style>