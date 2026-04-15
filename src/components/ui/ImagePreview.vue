<script setup lang="ts">
import { useImagePreviewStore } from '@/stores/imagePreviewStore'

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

const cover = props.variant !== 'avatar'

function handleClick() {
  if (!props.preview) return
  store.show(props.src)
}
</script>

<template>
    <v-hover v-slot="{ isHovering, props }">
        <div
            class="image-preview-wrapper"
            v-bind="props"
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
            <div v-if="preview && isHovering" class="overlay">
                <v-icon size="28">$magnifyPlusOutline</v-icon>
            </div>
            </div>
    </v-hover>
</template>