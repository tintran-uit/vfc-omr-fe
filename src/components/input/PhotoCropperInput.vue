<script setup lang="ts">
import { ref, watch, defineEmits, computed } from 'vue'
import { imageService } from '@/services/imageService'

const modelValue = defineModel<any>()

const props = defineProps({
  initialImage: String
})

const fileInput = ref(null)
const file = ref(null)
const uploadedImage = ref();
const loading = ref(false)
const dialog = ref(false)
const previewUrl = computed(() => {
  if (uploadedImageUrl.value) {
    return uploadedImageUrl.value
  } else if (props.initialImage) {
    return props.initialImage
  } else {
    return null
  }
})
const uploadedImageUrl = ref(null)

function triggerFileInput() {
  fileInput.value?.click()
}

async function onFileChange(e) {
  const f = e.target.files[0]
  if (!f) return
  loading.value = true

  try {
    const compressedImage = await compressImage(f, 500, 2024)
    const blobFile = new File([compressedImage], f.name, { type: compressedImage.type })


    const data = await imageService.uploadImage({
      file: blobFile
    })
    
    if (data) {
      modelValue.value = data.path
      uploadedImageUrl.value = data.url
    }
  } catch (e) {
    console.error('Error uploading image', e)
  }
  
  e.target.value = ''
  loading.value = false
}

function removeImage() {
  file.value = null
  modelValue.value = null
  uploadedImageUrl.value = null
}

function changeImage() {
  triggerFileInput()
}

function previewImage() {
  dialog.value = true
}

const compressImage = (file: File, maxSizeKB = 500, maxWidth = 1024): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        // resize theo tỉ lệ
        const ratio = Math.min(maxWidth / img.width, 1)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // hàm nén
        const qualityStep = 0.05 // giảm chất lượng từng bước
        let quality = 0.9

        const compressLoop = () => {
          canvas.toBlob((blob) => {
            if (!blob) return reject("Compression failed")

            const sizeKB = blob.size / 1024
            if (sizeKB <= maxSizeKB || quality <= 0.1) {
              resolve(blob)
            } else {
              quality -= qualityStep
              compressLoop()
            }
          }, 'image/jpeg', quality)
        }

        compressLoop()
      }

      img.onerror = (err) => reject(err)
    }

    reader.onerror = (err) => reject(err)
  })
}

</script>

<template>
  <div class="photo-upload">
    <!-- Chưa có ảnh -->
    <div
      v-if="!previewUrl && !loading"
      class="photo-empty"
      @click="triggerFileInput"
    >
      <v-icon size="36">$plus</v-icon>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="photo-loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <!-- Có ảnh -->
    <div v-if="previewUrl && !loading" class="photo-preview">
      <v-img
        :src="previewUrl"
        cover
        class="photo-img"
        @click="previewImage"
      />
      <div class="photo-actions">
        <v-btn size="x-small" icon variant="flat" color="white" @click.stop="changeImage">
          <v-icon size="16">$pencil</v-icon>
        </v-btn>
        <!-- <v-btn size="x-small" icon variant="flat" color="white" @click.stop="removeImage">
          <v-icon size="16">$delete</v-icon>
        </v-btn> -->
      </div>
    </div>

    <!-- Input file ẩn -->
    <input
      id="photo-input"
      type="file"
      ref="fileInput"
      accept="image/*"
      @change="onFileChange"
      style="display: none"
    />
  </div>

  <!-- Dialog preview -->
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-img :src="previewUrl" class="rounded-lg" />
    </v-card>
  </v-dialog>
</template>

<style scoped>
.photo-upload {
  width: 140px;
  height: 140px;
  position: relative;
  border: 1px solid #ccc;       /* border rõ nét */
  border-radius: 8px;
  background-color: #f9f9f9;    /* background nhẹ */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Trạng thái rỗng */
.photo-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
.photo-empty:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

/* Trạng thái loading */
.photo-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(250, 250, 250, 0.8);
  border-radius: 8px;
}

/* Có ảnh */
.photo-preview {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}
.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 4px;
}
</style>