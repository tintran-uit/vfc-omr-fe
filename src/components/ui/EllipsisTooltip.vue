<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    text?: string
    /** When true, tooltip shows on hover even if text is not truncated. */
    always?: boolean
  }>(),
  { always: false },
)

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)
const domText = ref("")

const tooltipText = computed(() => {
  const explicit = props.text?.trim()
  if (explicit) return explicit
  return domText.value
})

function overflows(el: HTMLElement) {
  if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) return true
  const nodes = el.querySelectorAll<HTMLElement>("*")
  for (const node of nodes) {
    if (node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1) return true
  }
  return false
}

function assignRef(el: unknown, activatorRef: unknown) {
  rootRef.value = el instanceof HTMLElement ? el : null
  if (typeof activatorRef === "function") activatorRef(el)
  else if (activatorRef && typeof activatorRef === "object" && "value" in activatorRef) {
    (activatorRef as { value: unknown }).value = el
  }
}

function withoutRef(tipProps: Record<string, unknown>) {
  const rest = { ...tipProps }
  delete rest.ref
  return rest
}

function show() {
  const el = rootRef.value
  if (!el) return
  domText.value = el.textContent?.trim() ?? ""
  open.value = !!tooltipText.value && (props.always || overflows(el))
}

function hide() {
  open.value = false
}
</script>

<template>
  <v-tooltip
    :model-value="open"
    :text="tooltipText"
    :open-on-hover="false"
    :open-on-click="false"
    location="top"
    max-width="420"
    @update:model-value="(value) => { if (!value) hide() }"
  >
    <template #activator="{ props: tipProps }">
      <span
        v-bind="withoutRef(tipProps)"
        :ref="(el) => assignRef(el, tipProps.ref)"
        class="dt-ellipsis-tooltip"
        @mouseenter="show"
        @mouseleave="hide"
        @focusin="show"
        @focusout="hide"
      >
        <slot />
      </span>
    </template>
  </v-tooltip>
</template>

<style scoped>
.dt-ellipsis-tooltip {
  display: block;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dt-ellipsis-tooltip :deep(a),
.dt-ellipsis-tooltip :deep(.dt-cell-link) {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
