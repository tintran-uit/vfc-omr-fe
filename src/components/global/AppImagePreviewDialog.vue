<script setup lang="ts">
import { useImagePreviewStore } from '@/stores/imagePreviewStore'
const store = useImagePreviewStore()
</script>

<template>
    <v-dialog v-model="store.open" max-width="600">
        <v-card>
            <v-img :src="store.src" aspect-ratio="1" cover />

            <v-card-actions class="justify-end">
                <v-btn variant="text" @click="store.close()">{{ $t('close') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>