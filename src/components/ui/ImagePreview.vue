<script setup lang="ts">
import { computed } from 'vue'
import { useImagePreviewStore } from '@/stores/imagePreviewStore'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    src: string
    variant?: 'avatar' | 'cover' | 'square'
    size?: number
    aspectRatio?: number
    preview?: boolean
  }>(),
  {
    variant: 'square',
    preview: true,
  }
)

const store = useImagePreviewStore()

const cover = computed(() => props.variant !== 'avatar')

function handleClick() {
  if (!props.preview) return
  store.show(props.src)
}
</script>

<template>
    <v-hover v-slot="{ isHovering, props: hoverProps }">
        <div
            class="image-preview-wrapper"
            v-bind="{ ...hoverProps, ...$attrs }"
            @click="handleClick"
        >
            <v-img
                :src="src"
                :aspect-ratio="aspectRatio"
                :cover="cover"
                class="image-preview"
                :class="variant"
            />

            <!-- Overlay -->
            <Transition name="avatar-overlay">
              <div
                v-if="preview && isHovering"
                class="avatar__overlay"
              >
                <v-icon
                  color="white"
                  size="28"
                  icon="$magnifyPlusOutline"
                />
              </div>
            </Transition>
            </div>
    </v-hover>
</template>