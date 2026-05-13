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
    /** When true, don't render the outer card wrapper */
    noCard?: boolean;
  }>(),
  {
    hideBack: false,
    noCard: false,
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
      <v-col
        cols="12"
        md="6"
        class="d-flex align-center"
      >
        <div class="text-h4 font-weight-medium">
          {{ resolvedTitle }}
        </div>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <div class="d-flex justify-md-end">
          <slot name="header-right">
            <template v-if="backUrl && !hideBack">
              <v-btn
                color="primary"
                variant="outlined"
                @click="router.push(backUrl)"
              >
                <v-icon>$arrowLeft</v-icon> {{ $t("backToList") }}
              </v-btn>
            </template>
          </slot>
        </div>
      </v-col>
    </v-row>

    <component
      :is="noCard ? 'div' : 'v-card'"
      variant="outlined"
      elevation="0"
      class="bg-surface"
    >
      <component :is="noCard ? 'div' : 'v-card-text'">
        <div class="pa-4 pa-md-6">
          <slot />
        </div>
      </component>
    </component>
  </div>
</template>

