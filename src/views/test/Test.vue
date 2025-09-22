<script setup lang="ts">
  import YesNoInput from "@/components/input/YesNoInput.vue";
import { ref, onMounted, computed } from "vue";
import CurrencySelectInput from "@/components/input/CurrencySelectInput.vue";
import GeographicalRegionSelectInput from "@/components/input/GeographicalRegionSelectInput.vue";
import CityInput from "@/components/input/CityInput.vue";



  const val = ref();
  const currencyVal = ref();



//   const items = ['Dog', 'Cat', 'Pig', 'Elephant']
// const search = ref('')
// const value = ref(null)

// const filtered = computed(() => {
//   if (!search.value) return items
//   const f = items.filter(i => i.toLowerCase().includes(search.value.toLowerCase()))
//   // trick: nếu rỗng thì return 1 phần tử giả để menu không tắt
//   return f.length ? f : [{ fake: true }]
// })

// function addNew() {
//   if (search.value && !items.includes(search.value)) {
//     items.push(search.value)
//     value.value = search.value
//   }
// }

// const items = ref(['Dog', 'Cat', 'Elephant'])
const value = ref(null)
const search = ref('')

const filtered = computed(() => {
  if (!search.value) return items.value.map(
      item => ({value: item, title: item})
    )

  const f = items.value.filter(i =>
    i.toLowerCase().includes(search.value.toLowerCase())
  )

  // nếu không tìm thấy, trả về một fake item để hiển thị dòng Add
  return f.length ? 
    f.map(
      item => ({value: item, title: item})
    ) : [{ add: true, title: search.value, value: search.value }]
})

function addNew(val) {
  if (val && !items.value.includes(val)) {
    items.value.push(val)
    value.value = val
  }
}

const vmodel = ref()



const items = ["Vue", "React", "Angular", "Svelte"];
const selected = ref<string[]>([]); // vẫn dùng mảng để hiển thị chip trong input

function onUpdate(value: string[]) {
  // chỉ giữ 1 phần tử cuối cùng
  if (value.length > 1) {
    selected.value = [value[value.length - 1]];
  }
}
</script>

<template>
  <v-container>
    <v-row
        no-gutters
    >
      <!-- <v-col cols="6" sm="3" lg="3" v-for="n in 6" -->
             <!-- :key="n"> -->
        <!-- <v-text-field label="firstName" /> -->
      <!-- </v-col> -->

      <v-col>
        <CityInput v-model="vmodel" />
          <v-combobox
    v-model="selected"
    :items="items"
    label="Chọn hoặc nhập"
    multiple
    clearable
    chips
    closable-chips
    @update:model-value="onUpdate"
  />

        <!-- <YesNoInput v-model="val" /> -->
        <!-- <CurrencySelectInput v-model="currencyVal" /> -->
        <!-- <v-combobox
            v-model="value"
            :items="['one', 'two', 'three']"
            density="comfortable"
            label="Comfortable"
          ></v-combobox> -->

         <!-- <v-autocomplete
    v-model="value"
    v-model:search="search"
    :items="filtered"
    item-title="fake ? '___empty___' : item"
    item-value="fake ? '' : item"
    hide-no-data
    label="Chọn option"
    :menu-props="{ closeOnContentClick: false }"
  >
    <template #item="{ item }">
      <template v-if="item.raw.fake">
        <v-list-item>
          <v-list-item-title>
            Không tìm thấy: <strong>{{ search }}</strong>
          </v-list-item-title>
          <template #append>
            <v-btn size="small" color="primary" @click.stop="addNew">+ Thêm</v-btn>
          </template>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item>
          <v-list-item-title>{{ item.raw }}</v-list-item-title>
        </v-list-item>
      </template>
    </template>
  </v-autocomplete> -->

<!-- <pre>{{ filtered }}</pre>
<v-combobox
    v-model="value"
    v-model:search="search"
    :items="filtered"
    item-title="title"
    item-value="value"
    hide-no-data
    label="Chọn hoặc thêm"
    :menu-props="{ closeOnContentClick: false }"
  >
    <template #item="{ item }">
      <template v-if="item.raw.add">
        <v-list-item>
          <v-list-item-title>
            Thêm mới: <strong>{{ item.raw.title }}</strong>
          </v-list-item-title>
          <template #append>
            <v-btn size="small" color="primary" @click.stop="addNew(item.raw.title)">
              + Add
            </v-btn>
          </template>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item>
          <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
        </v-list-item>
      </template>
    </template>
  </v-combobox> -->


        <div style="max-width: 500px;">
            
        </div>
        <pre>
            {{ model }}
        </pre>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

</style>