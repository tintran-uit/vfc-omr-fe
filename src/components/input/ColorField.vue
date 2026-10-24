<script setup lang="ts">
import { computed, ref, watch } from "vue";

const COLOR_PALETTE = [
  "#000000", "#434343", "#666666", "#999999", "#B7B7B7", "#CCCCCC", "#D9D9D9", "#FFFFFF",
  "#FF4D4F", "#FF7A45", "#FA8C16", "#F9A825", "#FADB14", "#A0D911", "#52C41A", "#19E7AD",
  "#13C2C2", "#1677FF", "#3E76C8", "#2F54EB", "#722ED1", "#BE19E7", "#EB2F96", "#F759AB",
];

const model = defineModel<string>({ default: "" });

defineProps<{
  errorMessages?: string;
  label?: string;
}>();

const open = ref(false);
const hue = ref(0);
const sat = ref(1);
const val = ref(1);

function hexToRgb(value: string) {
  const match = /^#([0-9a-fA-F]{6})$/.exec(value.trim());
  if (!match) return null;
  const num = Number.parseInt(match[1], 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHsv(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : delta / max, v: max };
}

function hsvToHex(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const channel = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
}

function syncFromModel(value: string) {
  const rgb = hexToRgb(value);
  if (!rgb) return;
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  sat.value = hsv.s;
  val.value = hsv.v;
  if (hsv.s > 0) hue.value = hsv.h;
}

watch(model, syncFromModel, { immediate: true });

function applyHsv() {
  model.value = hsvToHex(hue.value, sat.value, val.value);
}

function onHue(event: Event) {
  hue.value = Number((event.target as HTMLInputElement).value);
  applyHsv();
}

function choose(swatch: string) {
  model.value = swatch;
}

function sameColor(swatch: string) {
  return model.value.trim().toLowerCase() === swatch.toLowerCase();
}

function onType(event: Event) {
  model.value = (event.target as HTMLInputElement).value;
}

function pointFromEvent(event: PointerEvent, el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
  const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
  sat.value = rect.width ? x / rect.width : 0;
  val.value = rect.height ? 1 - y / rect.height : 0;
  applyHsv();
}

function onSvDown(event: PointerEvent) {
  const el = event.currentTarget as HTMLElement;
  pointFromEvent(event, el);
  try {
    el.setPointerCapture(event.pointerId);
  } catch {
    /* synthetic events have no pointer id */
  }
}

function onSvMove(event: PointerEvent) {
  const el = event.currentTarget as HTMLElement;
  if (el.hasPointerCapture?.(event.pointerId) === false && event.buttons === 0) return;
  pointFromEvent(event, el);
}

const chipColor = computed(() => hexToRgb(model.value) ? model.value : "transparent");
const planeStyle = computed(() => ({
  background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue.value}, 100%, 50%))`,
}));
</script>

<template>
  <div>
    <v-menu
      v-model="open"
      :close-on-content-click="false"
      :open-on-click="false"
      :open-on-hover="false"
      :open-on-focus="false"
      location="bottom start"
      offset="8, 0"
      min-width="280"
      max-width="280"
      :transition="false"
    >
      <template #activator="{ props: menuProps }">
        <div
          class="color-field"
          :class="{ 'color-field--error': !!errorMessages }"
          v-bind="menuProps"
          @focusin.stop
        >
          <button
            type="button"
            class="color-field__chip"
            :style="{ background: chipColor }"
            :aria-label="label"
            @click.stop="open = !open"
          />
          <input
            class="color-field__hex"
            :value="model"
            spellcheck="false"
            :aria-label="label"
            @input="onType"
            @mouseenter.stop
            @mouseleave.stop
            @click.stop
          >
        </div>
      </template>

      <v-card
        class="color-pop"
        elevation="8"
      >
        <div class="color-pop__swatches">
          <button
            v-for="swatch in COLOR_PALETTE"
            :key="swatch"
            type="button"
            class="color-pop__swatch"
            :class="{ 'is-selected': sameColor(swatch) }"
            :style="{ background: swatch }"
            :aria-label="swatch"
            @click="choose(swatch)"
          />
        </div>
        <div
          class="color-pop__plane"
          :style="planeStyle"
          @pointerdown="onSvDown"
          @pointermove="onSvMove"
        >
          <span
            class="color-pop__thumb"
            :style="{ left: `${sat * 100}%`, top: `${(1 - val) * 100}%` }"
          />
        </div>
        <input
          class="color-pop__hue"
          type="range"
          min="0"
          max="360"
          step="1"
          :value="hue"
          aria-label="Hue"
          @input="onHue"
        >
      </v-card>
    </v-menu>
    <div
      v-if="errorMessages"
      class="color-field__error"
    >
      {{ errorMessages }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.color-field {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 4px 0 6px;
  border: 1px solid rgb(var(--v-theme-borderLight));
  border-radius: 4px;
  background: rgb(var(--v-theme-surface));

  &:focus-within {
    border-color: rgb(var(--v-theme-primary));
  }

  &--error {
    border-color: rgb(var(--v-theme-error));
  }
}

.color-field__chip {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  padding: 0;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  cursor: pointer;
}

.color-field__hex {
  flex: 1 1 auto;
  align-self: stretch;
  min-width: 0;
  height: auto;
  padding: 0 8px;
  border: 0;
  outline: none;
  background: transparent;
  color: rgba(var(--v-theme-on-surface), 0.87);
  font: inherit;
  font-size: 0.875rem;
  cursor: text;
}

.color-field__error {
  margin-top: 4px;
  color: rgb(var(--v-theme-error));
  font-size: 0.75rem;
  line-height: 1.2;
}

.color-pop {
  width: 280px;
  max-width: 100%;
  padding: 12px;
}

.color-pop__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.color-pop__swatch {
  width: 22px;
  height: 22px;
  padding: 0;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  cursor: pointer;

  &.is-selected {
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 1px;
  }
}

.color-pop__plane {
  position: relative;
  height: 140px;
  border-radius: 6px;
  cursor: crosshair;
  touch-action: none;
}

.color-pop__thumb {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.color-pop__hue {
  display: block;
  width: 100%;
  height: 14px;
  margin-top: 12px;
  appearance: none;
  border-radius: 7px;
  background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border: 2px solid #fff;
    border-radius: 50%;
    background: transparent;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45);
  }
}
</style>
