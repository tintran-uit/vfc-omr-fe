<script setup lang="ts">
import {ref, watch, computed, onMounted, defineAsyncComponent} from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import { bibleVerseService } from '@/services/bibleVerseService';

const props = withDefaults(
  defineProps<{
  }>(),
  {
  }
)
const verseHeading = ref('')
const verseBody = ref('')

onMounted(async () => {
  const {verse_heading, verse_body} = await bibleVerseService.get()

  verseHeading.value = verse_heading
  verseBody.value = verse_body
})
</script>

<template>
  <CardHeader :title="verseHeading">
    <p class="pa-5 text-h6 font-italic">{{ verseBody }}</p>
  </CardHeader>
</template>

<style scoped>

</style>
