<script setup lang="ts">
import { computed } from "vue";
import { useImagePreviewStore } from "@/stores/imagePreviewStore";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    src: string;
    size?: number;
    preview?: boolean;
  }>(),
  {
    size: 40,
    preview: true,
  },
);

const previewStore = useImagePreviewStore()

const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

function onClick() {
  if (!props.preview) return;
  previewStore.show(props.src);
}
</script>

<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <div
      v-bind="{ ...hoverProps, ...$attrs }"
      class="avatar"
      :style="style"
      @click="onClick"
    >
      <v-img
        :src="src"
        cover
      />

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
