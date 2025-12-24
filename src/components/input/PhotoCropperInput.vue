<script setup lang="ts">
import { ref, computed } from 'vue'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { useDialogStore } from '@/stores/dialogStore'
import { imageService } from '@/services/imageService'
import { useI18n } from 'vue-i18n'

/* =====================
   v-model
===================== */
const modelValue = defineModel<string | null>()

/* =====================
   Props
===================== */
const props = withDefaults(
  defineProps<{
    initialImage?: string
    aspectRatio?: number,
    mode?: 'avatar' | 'cover'
  }>(),
  {
    aspectRatio: 1,
    mode: 'avatar'
  }
)

/* =====================
   State
===================== */
const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)

const cropDialog = ref(false)
const cropperRef = ref<any>(null)

const cropSrc = ref<string | null>(null)
const rawFile = ref<File | null>(null)

const uploadedImageUrl = ref<string | null>(null)
const { t } = useI18n()
const dialogStore = useDialogStore()

/* =====================
   Computed
===================== */
const previewUrl = computed(() => {
  return uploadedImageUrl.value || props.initialImage || null
})

/* =====================
   Methods
===================== */
function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  rawFile.value = file
  cropSrc.value = URL.createObjectURL(file)
  cropDialog.value = true

  target.value = ''
}

async function confirmCrop() {
  if (!cropperRef.value || !rawFile.value) return

  loading.value = true
  cropDialog.value = false

  cropperRef.value.getCroppedCanvas().toBlob(
    async (blob: Blob | null) => {
      if (!blob) return

      try {
        const compressed = await compressImage(
          new File([blob], rawFile.value!.name, { type: blob.type }),
          500,
          1024
        )

        const uploadFile = new File(
          [compressed],
          rawFile.value!.name,
          { type: compressed.type }
        )

        const data = await imageService.uploadImage({
          file: uploadFile
        })

        if (data) {
          modelValue.value = data.path
          uploadedImageUrl.value = data.url
        }
      } catch (err) {
        console.error('Upload error:', err)
      } finally {
        loading.value = false
      }
    },
    'image/jpeg',
    0.95
  )
}

function removeImage() {
  if (!dialogStore.confirm(t('areYouSureWantToDeleteImage'))) {

  }
  modelValue.value = null
  uploadedImageUrl.value = null
  rawFile.value = null
  cropSrc.value = null
}

/* =====================
   Compress helper
===================== */
const compressImage = (
  file: File,
  maxSizeKB = 500,
  maxWidth = 1024
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      const img = new Image()
      img.src = reader.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const ratio = Math.min(maxWidth / img.width, 1)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        let quality = 0.9
        const step = 0.05

        const loop = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject()

              if (blob.size / 1024 <= maxSizeKB || quality <= 0.1) {
                resolve(blob)
              } else {
                quality -= step
                loop()
              }
            },
            'image/jpeg',
            quality
          )
        }

        loop()
      }

      img.onerror = reject
    }

    reader.onerror = reject
  })
}
</script>

<template>
  <div class="photo-upload" :class="props.mode">
    <!-- Empty -->
    <div
      v-if="!previewUrl && !loading"
      class="photo-empty"
      @click="triggerFileInput"
    >
      <v-icon size="36">$plus</v-icon>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="photo-loading">
      <v-progress-circular indeterminate />
    </div>

    <!-- Preview -->
    <div v-if="previewUrl && !loading" class="photo-preview">
      <v-img
        :src="previewUrl"
        cover
        class="photo-img"
        @click="triggerFileInput"
      />

      <div class="photo-actions">
        <!-- Change -->
        <v-btn
          size="x-small"
          icon
          variant="flat"
          color="white"
          @click.stop="triggerFileInput"
        >
          <v-icon size="16">$pencil</v-icon>
        </v-btn>

        <!-- Remove -->
        <v-btn
          size="x-small"
          icon
          variant="flat"
          color="white"
          @click.stop="removeImage"
        >
          <v-icon size="16">$delete</v-icon>
        </v-btn>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      hidden
      @change="onFileChange"
    />
  </div>
  
  <v-dialog v-model="cropDialog" max-width="520">
    <v-card>
      <v-card-title>{{ $t('cropImage') }}</v-card-title>

      <v-card-text>
        <vue-cropper
          ref="cropperRef"
          :src="cropSrc"
          :aspect-ratio="props.aspectRatio ?? 1"
          :view-mode="1"
          :auto-crop-area="1"
          style="width: 100%; height: 320px"
        />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="cropDialog = false">{{ $t('cancel') }}</v-btn>
        <v-btn color="primary" @click="confirmCrop">{{ $t('confirm') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.photo-upload {
  border: 1px solid #ccc;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}
.photo-upload.avatar {
  width: 140px;
  height: 140px;
}
.photo-upload.cover {
  width: 320px;
  aspect-ratio: 16 / 9;
}
.photo-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.photo-preview {
  width: 100%;
  height: 100%;
}
.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
}

.photo-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 4px;
  z-index: 2;
}
</style>