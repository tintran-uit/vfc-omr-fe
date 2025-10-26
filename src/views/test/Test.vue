<script setup lang="ts">
  import YesNoInput from "@/components/input/YesNoInput.vue";
import { ref, onMounted, computed, reactive } from "vue";
import CurrencySelectInput from "@/components/input/CurrencySelectInput.vue";
import GeographicalRegionSelectInput from "@/components/input/GeographicalRegionSelectInput.vue";
import CityInput from "@/components/input/CitySelectInput.vue";
import { useTheme } from "vuetify";

const theme = useTheme();

// console.log('theme color', theme.current.value.colors.chartAttendance)

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

import RadialTree from "@/components/charts/RadialTree.vue";
import JITChart from "@/components/charts/JITChart.vue";
const data = {
  name: "Root",
  children: [
    {
      name: "Branch A",
      children: [
        { name: "Leaf A1" },
        { name: "Leaf A2" }
      ]
    },
    {
      name: "Branch B",
      children: [
        { name: "Leaf B1" },
        { name: "Leaf B2" }
      ]
    }
  ]
};
import AttendanceLineChart from "@/components/charts/AttendanceLineChart.vue";
import GivingChart from "@/components/charts/GivingChartzzz.vue";

import TimeInput from "@/components/input/TimeInput.vue";
import CitySelectInput from "@/components/input/CitySelectInput.vue";
import ChangePassword from "@/components/input/ChangePassword.vue";
import AttendanceChartWidget from "@/components/widgets/AttendanceChartWidget.vue";
import VisitChart from "@/components/charts/VisitChart.vue";
import AttachmentWidget from "@/components/widgets/AttachmentWidget.vue";
import BibleVerseWidget from "@/components/widgets/BibleVerseWidget.vue";
import ChurchDetailWidget from "@/components/widgets/ChurchDetailWidget.vue";
import PastorLeaderWidget from "@/components/widgets/PastorLeaderWidget.vue";
const timeVal = ref(null)

const firstName = ref('Nguyen');
const lastName = ref('Van A');
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    // Khi gán fullName.value = 'Nguyễn Văn A'
    const parts = newValue.split(' ')
    firstName.value = parts[0] || ''
    lastName.value = parts.slice(1).join(' ') || ''
  },
})

// const fields = [
//   {
//     label: 'First Name',
//     name: 'firstName'
//   },
//   {
//     label: 'Last Name',
//     name: 'lastName'
//   },
//   {
//     label: 'Full Name',
//     name: 'fullName'
//   }
// ]

// const realModelValue = ref({})
// const virtualModelValue = fields.map(field => {
//   return computed({
//     get: () => realModelValue.value[field.name] || '',
//     set: (val) => {
//       console.log('set', field.name, val)
//       realModelValue.value[field.name] = val
//     }
//   })
// })
// console.log('virtualModelValue:', virtualModelValue)


// // Hàm này trả về một computed động cho từng field
// function getFieldModel(field) {
//   return computed({
//     get: () => realModelValue.value[field.name] ?? '',
//     set: (val) => {
//       realModelValue.value[field.name] = val
//     }
//   })
// }


// const fields = [
//   { label: 'First Name', name: 'firstName' },
//   { label: 'Last Name', name: 'lastName' },
//   { label: 'Full Name', name: 'fullName' },
// ]

// const realModelValue = ref({})
// const virtualModelValue = reactive({})

// // ✅ Chuẩn bị trước các computed cho từng field
// fields.forEach(field => {
//   virtualModelValue[field.name] = computed({
//     get: () => realModelValue.value[field.name] ?? '',
//     set: (val) => {
//       realModelValue.value[field.name] = val
//     }
//   })
// })

// import plantIcon from '@/assets/images/metrics/plant-01.svg';

const visitData = [
  { week: 1, visits: 4 },
  { week: 2, visits: 6 },
  { week: 3, visits: 3 },
  { week: 4, visits: 5 },
  { week: 5, visits: 0 },
  { week: 6, visits: 2 },
  { week: 7, visits: 7 },
  { week: 8, visits: 4 },
  { week: 9, visits: 8 },
  { week: 10, visits: 6 },
  { week: 11, visits: 9 },
  { week: 12, visits: 3 },
  { week: 13, visits: 5 },
  { week: 14, visits: 4 },
  { week: 15, visits: 6 },
  { week: 16, visits: 2 },
  { week: 17, visits: 7 },
  { week: 18, visits: 5 },
  { week: 19, visits: 8 },
  { week: 20, visits: 4 },
  { week: 21, visits: 6 },
  { week: 22, visits: 3 },
  { week: 23, visits: 5 },
  { week: 24, visits: 4 },
  { week: 25, visits: 6 },
  { week: 26, visits: 7 },
  { week: 27, visits: 8 },
  { week: 28, visits: 5 },
  { week: 29, visits: 6 },
  { week: 30, visits: 4 },
  { week: 31, visits: 3 },
  { week: 32, visits: 7 },
  { week: 33, visits: 5 },
  { week: 34, visits: 8 },
  { week: 35, visits: 4 },
  { week: 36, visits: 9 },
  { week: 37, visits: 6 },
  { week: 38, visits: 7 },
  { week: 39, visits: 3 },
  { week: 40, visits: 4 },
  { week: 41, visits: 5 },
  { week: 42, visits: 2 },
  { week: 43, visits: 6 },
  { week: 44, visits: 3 },
  { week: 45, visits: 4 },
  { week: 46, visits: 7 },
  { week: 47, visits: 5 },
  { week: 48, visits: 8 },
  { week: 49, visits: 3 },
  { week: 50, visits: 4 },
  { week: 51, visits: 6 },
  { week: 52, visits: 5 },
]
</script>

<template>
  <v-container>
    <AttendanceChartWidget church-id="76" />
    <!-- <PastorLeaderWidget :user-id="4" /> -->
    <!-- <ChurchDetailWidget church-id="76" /> -->
    <!-- <AttendanceWidget /> -->

    <!-- <AttachmentWidget :church-id="76" /> -->
     <!-- <BibleVerseWidget /> -->

    <!-- <VisitChart :data="visitData" :year="2024" /> -->
    <!--
    <pre>
      realModelValue: {{ realModelValue }}
    </pre>
    <pre>
      VirtualModel {{ virtualModelValue }}
    </pre>
    <div v-for="(field, index) in fields" :key="field.name">
      <v-text-field v-model="virtualModelValue[index]" :label="field.label" />
    </div>
  -->

    <!-- <CitySelectInput /> -->
    <!-- <AttendanceLineChart /> -->
    <!-- <RadialTree :data="data" :width="800" :height="800" /> -->
      <!-- <GivingChart />
     <JITChart /> -->

     <!-- <TimeInput v-model="timeVal" /> -->
  </v-container>

  <!-- <div class="my-box">
    mai box nè
  </div>
  <p>
    <v-btn class="myBtn">
      Button
    </v-btn>
  </p> -->
</template>

<style scoped lang="scss">

</style>