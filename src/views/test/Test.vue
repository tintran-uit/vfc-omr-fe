<script setup lang="ts">
  import YesNoInput from "@/components/input/YesNoInput.vue";
import { ref, onMounted, computed, reactive } from "vue";
import CurrencySelectInput from "@/components/input/CurrencySelectInput.vue";
import GeographicalRegionSelectInput from "@/components/input/GeographicalRegionSelectInput.vue";
import CityInput from "@/components/input/CitySelectInput.vue";
import { useTheme } from "vuetify";
import { useI18n } from "vue-i18n";
import { getWeekRange } from "@/helpers/dateTimeHelper";

const theme = useTheme();

// console.log('theme color', theme.current.value.colors.chartAttendance)
const { t } = useI18n();
  const val = ref();
  const currencyVal = ref();
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

import TimeInput from "@/components/input/TimeInput.vue";
import CitySelectInput from "@/components/input/CitySelectInput.vue";
import ChangePassword from "@/components/input/ChangePassword.vue";
import AttendanceChartWidget from "@/components/widgets/AttendanceChartWidget.vue";
import VisitChart from "@/components/charts/VisitChart.vue";
import AttachmentWidget from "@/components/widgets/AttachmentWidget.vue";
import BibleVerseWidget from "@/components/widgets/BibleVerseWidget.vue";
import ChurchDetailWidget from "@/components/widgets/ChurchDetailWidget.vue";
import PastorLeaderWidget from "@/components/widgets/PastorLeaderWidget.vue";
import D3ChurchPlanting from "@/components/charts/D3ChurchPlanting.vue";
import ChurchPlantingChart from "@/components/charts/ChurchPlantingChart.vue";
import { reportService } from "@/services/reportService";
import ChurchPlantingProjectionWidget from "@/components/widgets/ChurchPlantingProjectionWidget.vue";
import RelatedUserWidget from "@/components/widgets/RelatedUserWidget.vue";
import DaugterChurchWidget from "@/components/widgets/DaugterChurchWidget.vue";
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

const treeData = {
  "id": 76,
  "parent_id": null,
  "left": 2219,
  "right": 2308,
  "name": "Victory Family Centre - Ho Chi Minh City",
  "avg_attendance": 38,
  "children": [
      {
          "id": 2836,
          "parent_id": 76,
          "left": 2220,
          "right": 2221,
          "name": "Victory Family Centre - Thu Duc",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 4998,
          "parent_id": 76,
          "left": 2222,
          "right": 2223,
          "name": "Victory Family Centre - Hanoi",
          "avg_attendance": 1779,
          "children": null
      },
      {
          "id": 5304,
          "parent_id": 76,
          "left": 2224,
          "right": 2225,
          "name": "New Life Church 29",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5305,
          "parent_id": 76,
          "left": 2226,
          "right": 2227,
          "name": "New Life Church 30",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5307,
          "parent_id": 76,
          "left": 2228,
          "right": 2229,
          "name": "New Life Church 31",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5314,
          "parent_id": 76,
          "left": 2230,
          "right": 2233,
          "name": "Evangelical Church 29",
          "avg_attendance": null,
          "children": [
              {
                  "id": 5310,
                  "parent_id": 5314,
                  "left": 2231,
                  "right": 2232,
                  "name": "Evangelical Church 125",
                  "avg_attendance": null,
                  "children": null
              }
          ]
      },
      {
          "id": 5315,
          "parent_id": 76,
          "left": 2234,
          "right": 2235,
          "name": "Evangelical Church 31",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5316,
          "parent_id": 76,
          "left": 2236,
          "right": 2237,
          "name": "Evangelical Church 36",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5317,
          "parent_id": 76,
          "left": 2238,
          "right": 2239,
          "name": "New Life Church 37",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5318,
          "parent_id": 76,
          "left": 2240,
          "right": 2241,
          "name": "Evangelical Church 37",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5319,
          "parent_id": 76,
          "left": 2242,
          "right": 2243,
          "name": "Evangelical Church 38",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5320,
          "parent_id": 76,
          "left": 2244,
          "right": 2245,
          "name": "Evangelical Church 39",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5327,
          "parent_id": 76,
          "left": 2246,
          "right": 2247,
          "name": "Evangelical Church 43",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5329,
          "parent_id": 76,
          "left": 2248,
          "right": 2249,
          "name": "Evangelical Church 44",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5330,
          "parent_id": 76,
          "left": 2250,
          "right": 2255,
          "name": "Evangelical Church 41",
          "avg_attendance": null,
          "children": [
              {
                  "id": 5336,
                  "parent_id": 5330,
                  "left": 2251,
                  "right": 2252,
                  "name": "VN Church",
                  "avg_attendance": null,
                  "children": null
              },
              {
                  "id": 5337,
                  "parent_id": 5330,
                  "left": 2253,
                  "right": 2254,
                  "name": "VN Test",
                  "avg_attendance": null,
                  "children": null
              }
          ]
      },
      {
          "id": 5333,
          "parent_id": 76,
          "left": 2258,
          "right": 2267,
          "name": "Evangelical Church 54",
          "avg_attendance": null,
          "children": [
              {
                  "id": 5339,
                  "parent_id": 5333,
                  "left": 2259,
                  "right": 2262,
                  "name": "Victory Family Centre - Ho Chi Minh City copy",
                  "avg_attendance": null,
                  "children": [
                      {
                          "id": 5340,
                          "parent_id": 5339,
                          "left": 2260,
                          "right": 2261,
                          "name": "VFC QN",
                          "avg_attendance": null,
                          "children": null
                      }
                  ]
              },
              {
                  "id": 5341,
                  "parent_id": 5333,
                  "left": 2263,
                  "right": 2266,
                  "name": "Victory Family Centre - Ho Chi Minh City copyy",
                  "avg_attendance": null,
                  "children": [
                      {
                          "id": 5342,
                          "parent_id": 5341,
                          "left": 2264,
                          "right": 2265,
                          "name": "VFC VN 1",
                          "avg_attendance": null,
                          "children": null
                      }
                  ]
              }
          ]
      },
      {
          "id": 5334,
          "parent_id": 76,
          "left": 2268,
          "right": 2269,
          "name": "New Life Church 35",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5335,
          "parent_id": 76,
          "left": 2270,
          "right": 2271,
          "name": "VFC VN 123",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5338,
          "parent_id": 76,
          "left": 2272,
          "right": 2273,
          "name": "New Life Church 35",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5343,
          "parent_id": 76,
          "left": 2274,
          "right": 2275,
          "name": "Evangelical Church 540",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5344,
          "parent_id": 76,
          "left": 2276,
          "right": 2277,
          "name": "Evangelical Church 64",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5345,
          "parent_id": 76,
          "left": 2278,
          "right": 2279,
          "name": "Evangelical Church 56",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5346,
          "parent_id": 76,
          "left": 2280,
          "right": 2281,
          "name": "New Life Church 35",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5347,
          "parent_id": 76,
          "left": 2282,
          "right": 2283,
          "name": "New Life Church 35",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5348,
          "parent_id": 76,
          "left": 2284,
          "right": 2285,
          "name": "Evangelical Church 55",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5349,
          "parent_id": 76,
          "left": 2286,
          "right": 2287,
          "name": "Evangelical Church 57",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5350,
          "parent_id": 76,
          "left": 2288,
          "right": 2289,
          "name": "New Life Church 36",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5351,
          "parent_id": 76,
          "left": 2290,
          "right": 2291,
          "name": "New Life Church 37",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5352,
          "parent_id": 76,
          "left": 2292,
          "right": 2293,
          "name": "New Life Church 37",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5353,
          "parent_id": 76,
          "left": 2294,
          "right": 2295,
          "name": "New Life Church 37",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5354,
          "parent_id": 76,
          "left": 2296,
          "right": 2297,
          "name": "New Life Church 38",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5355,
          "parent_id": 76,
          "left": 2298,
          "right": 2299,
          "name": "New Life Church 38",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5356,
          "parent_id": 76,
          "left": 2300,
          "right": 2301,
          "name": "New Life Church 35",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5357,
          "parent_id": 76,
          "left": 2302,
          "right": 2303,
          "name": "New Life Church 35",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5358,
          "parent_id": 76,
          "left": 2304,
          "right": 2305,
          "name": "New Life Church 40",
          "avg_attendance": null,
          "children": null
      },
      {
          "id": 5359,
          "parent_id": 76,
          "left": 2306,
          "right": 2307,
          "name": "Hai church 01",
          "avg_attendance": null,
          "children": null
      }
  ]
}
const rows = [
  {
    "label": "Adult",
    "fn": (r) => r?.worship_sessions?.reduce((acc, session) => acc + (session.attendance.adult_attendance || 0), 0)
  },
  {
    "label": "Youth [13-18]",
    "fn": (r) => r?.worship_sessions?.reduce((acc, session) => acc + (session.attendance.youth_attendance || 0), 0)
  },
  {
    "label": "Children [0-12]",
    "fn": (r) => r?.worship_sessions?.reduce((acc, session) => acc + (session.attendance.child_attendance || 0), 0)
  },
  {
    "label": "Total Attendance",
    "fn": (r) => r?.worship_sessions?.reduce((acc, session) => acc + (session.attendance.total_attendance || 0), 0),
    "classes": ['summary-class']
  },
  {
    "label": "No. of Cell Groups",
    "fn": (r) => r?.weekly_church_events?.cell_group_count
  },
  {
    "label": "Total Cell Attendance",
    "fn": (r) => r?.weekly_church_events?.cell_group_weekly_attendance,
    "classes": ['summary-class']
  },
  {
    "label": "New Decisions",
    "fn": (r) => r?.weekly_spiritual_growth?.new_decisions
  },
  {
    "label": "Actively Discipled",
    "fn": (r) => r?.weekly_spiritual_growth?.active_disciples
  },
  {
    "label": "Water Baptised",
    "fn": (r) => r?.weekly_spiritual_growth?.water_baptisms
  },
  {
    "label": "LIW Classes",
    "fn": (r) => r?.weekly_church_events?.liw_class_count
  },
  {
    "label": "LIW Students",
    "fn": (r) => r?.weekly_church_events?.liw_class_total_students
  },
  {
    "label": "No. of Leaders",
    "fn": (r) => r?.weekly_spiritual_growth?.number_of_leaders_in_training_for_cpm
  },
  {
    "label": "Local Giving VND",
    "fn": (r) => r?.givings?.in_local_currency
  },
  {
    "label": "Local Giving USD",
    "fn": (r) => r?.givings?.in_usd
  },
]
const data4Weeks = ref([]);

const showWeekRange = (year, weekNumber) => {
  const [start, end] = getWeekRange(year, weekNumber, 'DD MMM')

  return t('report.rangeDateOfWeek', { start, end, weekNumber, year })
}

onMounted(async () => {
  data4Weeks.value = await reportService.getLast4WeeksOfChurch(76)

  console.log('data4Weeks:', data4Weeks.value)
})  

const avatar = ref(null)
</script>

<template>
  <pre>Avatar: {{ avatar }}</pre>
  <v-container>
    <PhotoCropperInput v-model="avatar"
  :aspect-ratio="1"></PhotoCropperInput>
    <!-- <AttendanceChartWidget church-id="76" /> -->

    <!-- <DaugterChurchWidget church-id="76" /> -->


    <!-- <ChurchPlantingProjectionWidget church-id="76" /> -->

    <!-- <v-row>
      <v-col cols="12" md="6">
        <ChurchDetailWidget church-id="76" />
      </v-col>
      <v-col cols="12" md="6">
        <PastorLeaderWidget user-id="4" />
      </v-col>  
    </v-row> -->
   
   

    <!-- <RelatedUserWidget church-id="76" /> -->

    <!-- <XWidget church-id="76" /> -->

    

    <!-- <D3ChurchPlanting :width="800" :height="600" :data="treeData" /> -->
     <!-- <JITChart /> -->
     <!-- <ChurchPlantingChart :width="800" :height="600" :data="treeData" /> -->
     <!-- <v-table class="elevation-1 striped-table">
      <thead>
        <tr>
          <th class="font-weight-bold text-center">Week, Year</th>
          <th class="font-weight-bold text-center" v-for="col in data4Weeks" :key="`${col.year}-${col.weekNumber}`" v-html="showWeekRange(col.year, col.week_number)">
            
          </th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in rows" :key="index" :class="row?.classes || [] ">
        <td class="font-weight-bold">{{ row.label }}:</td>
        <td class="text-center" v-for="col in data4Weeks" :key="`${col.year}-${col.weekNumber}`">{{ row?.fn ? row.fn(col) : null }}</td>
      </tr>
      </tbody>
    </v-table> -->
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
.striped-table {
  line-height: 1.1;
}
  .striped-table tbody tr:nth-child(odd) {
  background-color: #fafafa;
}
.striped-table tbody tr:nth-child(even) {
  background-color: #f0f0f0;
}

.summary-class {
  background-color: #DEE9F7 !important;
}
</style>