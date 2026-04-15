<script setup lang="ts">
import { ref, watch, nextTick } from "vue";

const props = defineProps({
  modelValue: Number,
  label: String,
});

const emit = defineEmits(["update:modelValue"]);

const displayValue = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

const formatNumber = (value: number | null) => {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat().format(value);
};

const parseNumber = (value: string) => {
  const raw = value.replace(/,/g, "");
  return raw ? Number(raw) : null;
};

watch(
  () => props.modelValue,
  (val) => {
    displayValue.value = formatNumber(val);
  },
  { immediate: true },
);

const onInput = async (val: string) => {
  const inputEl = inputRef.value;
  if (!inputEl) return;

  // 1. Lưu vị trí cursor cũ
  const selectionStart = inputEl.selectionStart || 0;

  // 2. Đếm số ký tự số trước cursor
  const rawBeforeCursor = val.slice(0, selectionStart).replace(/[^\d]/g, "");

  // 3. Clean + parse
  //   const cleaned = val.replace(/[^\d]/g, '')
  const cleaned = val
    .replace(/[^\d.-]/g, "") // cho phép số + . + -
    .replace(/(?!^)-/g, "") // chỉ cho dấu - ở đầu
    .replace(/(\..*)\./g, "$1"); // chỉ 1 dấu .
  const numberValue = parseNumber(cleaned);

  emit("update:modelValue", numberValue);

  // 4. Format lại
  const formatted = formatNumber(numberValue);
  displayValue.value = formatted;

  await nextTick();

  // 5. Tính lại vị trí cursor mới
  let newCursor = 0;
  let digitCount = 0;

  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      digitCount++;
    }
    if (digitCount === rawBeforeCursor.length) {
      newCursor = i + 1;
      break;
    }
  }

  // fallback nếu ở cuối
  if (rawBeforeCursor.length === 0) newCursor = 0;

  inputEl.setSelectionRange(newCursor, newCursor);
};

const onKeyPress = (e: KeyboardEvent) => {
  const allowed = /[0-9.-]/;

  if (!allowed.test(e.key)) {
    e.preventDefault();
  }

  // chỉ cho 1 dấu .
  if (e.key === "." && (e.target as HTMLInputElement).value.includes(".")) {
    e.preventDefault();
  }

  // chỉ cho - ở đầu
  if (e.key === "-" && (e.target as HTMLInputElement).selectionStart !== 0) {
    e.preventDefault();
  }
};
</script>

<template>
  <v-text-field
    ref="inputRef"
    :label="label"
    :rules="rules"
    :model-value="displayValue"
    @update:model-value="onInput"
    @keypress="onKeyPress"
    single-line
    variant="outlined"
  />
</template>
