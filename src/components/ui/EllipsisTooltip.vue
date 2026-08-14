<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, onUpdated, nextTick, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    text?: string
    /** When true, tooltip shows on hover even if text is not truncated. */
    always?: boolean
  }>(),
  { always: false },
)

const rootRef = ref<HTMLElement | null>(null)
const isTruncated = ref(false)
const domText = ref('')

const tooltipText = computed(() => {
  const explicit = props.text?.trim()
  if (explicit) return explicit
  return domText.value
})

const checkTruncation = async () => {
  await nextTick()
  const el = rootRef.value
  if (!el) {
    isTruncated.value = false
    return
  }
  domText.value = el.textContent?.trim() ?? ''
  isTruncated.value = el.scrollWidth > el.clientWidth
}

let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  await checkTruncation()
  const el = rootRef.value
  if (el && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      void checkTruncation()
    })
    resizeObserver.observe(el)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

onUpdated(() => {
  void checkTruncation()
})

watch(() => props.text, () => {
  void checkTruncation()
})
</script>

<template>
  <v-tooltip
    :text="tooltipText"
    :disabled="(!always && !isTruncated) || !tooltipText"
    location="top"
  >
    <template #activator="{ props: tipProps }">
      <span
        ref="rootRef"
        v-bind="tipProps"
        class="dt-ellipsis-tooltip"
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
